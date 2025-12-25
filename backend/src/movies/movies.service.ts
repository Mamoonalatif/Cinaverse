import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieCache } from '../entities/movie-cache.entity';
import { ParentalSettings } from '../entities/parental-settings.entity';
import { ChildProfile } from '../entities/child-profile.entity';

type ParentalConfig = { minAge?: number; bannedGenres?: string | null } | null;
type ChildConfig = { age: number; allowedGenres: string | null; maxAgeRating: string | null };

const GENRE_NAME_TO_ID: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  'science fiction': 878,
  'tv movie': 10770,
  thriller: 53,
  war: 10752,
  western: 37,
};

@Injectable()
export class MoviesService {
  private base = 'https://api.themoviedb.org/3';

  constructor(
    private http: HttpService,
    private config: ConfigService,
    @InjectRepository(MovieCache) private cache: Repository<MovieCache>,
    @InjectRepository(ParentalSettings) private parentalRepo: Repository<ParentalSettings>,
    @InjectRepository(ChildProfile) private childRepo: Repository<ChildProfile>,
  ) {}

  async search(query: string, userId?: number, childProfileId?: number) {
    const key = this.config.get('TMDB_API_KEY');
    const res = await this.http.axiosRef.get(`${this.base}/search/movie`, { params: { api_key: key, query } });
    const filter = await this.getFilterConfig(userId, childProfileId);
    return this.filterList(res.data, filter);
  }

  async getTrending(timeWindow: 'day' | 'week' = 'week', userId?: number, childProfileId?: number) {
    const key = this.config.get('TMDB_API_KEY');
    const res = await this.http.axiosRef.get(`${this.base}/trending/movie/${timeWindow}`, { params: { api_key: key } });
    const filter = await this.getFilterConfig(userId, childProfileId);
    return this.filterList(res.data, filter);
  }

  async getPopular(page: number = 1, userId?: number, childProfileId?: number) {
    const key = this.config.get('TMDB_API_KEY');
    const res = await this.http.axiosRef.get(`${this.base}/movie/popular`, { params: { api_key: key, page } });
    const filter = await this.getFilterConfig(userId, childProfileId);
    return this.filterList(res.data, filter);
  }

  async getLatestReleases(userId?: number, childProfileId?: number) {
    const key = this.config.get('TMDB_API_KEY');
    const currentYear = new Date().getFullYear();
    const res = await this.http.axiosRef.get(`${this.base}/discover/movie`, {
      params: {
        api_key: key,
        primary_release_year: currentYear,
        sort_by: 'release_date.desc',
        'vote_count.gte': 10,
      },
    });
    const filter = await this.getFilterConfig(userId, childProfileId);
    return this.filterList(res.data, filter);
  }

  async getDetails(id: string, userId?: number, childProfileId?: number) {
    const cached = await this.cache.findOne({ where: { movieId: id } });
    if (cached && Date.now() - new Date(cached.updatedAt).getTime() < 86400000) return cached.data;
    
    const key = this.config.get('TMDB_API_KEY');
    const res = await this.http.axiosRef.get(`${this.base}/movie/${id}`, { params: { api_key: key } });
    const filter = await this.getFilterConfig(userId, childProfileId);
    this.ensureDetailAllowed(res.data, filter);
    await this.cache.save({ movieId: id, data: res.data });
    return res.data;
  }

  async getTrailer(id: string) {
    const key = this.config.get('TMDB_API_KEY');
    const res = await this.http.axiosRef.get(`${this.base}/movie/${id}/videos`, { params: { api_key: key } });
    return res.data.results.find((v: any) => v.type === 'Trailer') || null;
  }

  private async getFilterConfig(userId?: number, childProfileId?: number): Promise<{ type: 'child'; cfg: ChildConfig } | { type: 'parental'; cfg: ParentalConfig } | null> {
    if (childProfileId !== undefined && childProfileId !== null) {
      if (!userId) {
        throw new UnauthorizedException('Login required for child profile selection');
      }
      const child = await this.childRepo.findOne({ where: { id: childProfileId, parent: { id: userId } } });
      if (!child) throw new ForbiddenException('Child profile not found or not yours');
      return { type: 'child', cfg: { age: child.age, allowedGenres: child.allowedGenres, maxAgeRating: child.maxAgeRating } };
    }

    if (!userId) return null;
    const settings = await this.parentalRepo.findOne({ where: { user: { id: userId } } });
    if (!settings) return null;
    return { type: 'parental', cfg: { minAge: settings.minAge, bannedGenres: settings.bannedGenres } };
  }

  private parseGenreList(raw: string | null | undefined): Set<number> {
    if (!raw) return new Set();
    return new Set(
      raw
        .split(',')
        .map((g) => g.trim().toLowerCase())
        .filter(Boolean)
        .map((g) => {
          if (GENRE_NAME_TO_ID[g]) return GENRE_NAME_TO_ID[g];
          const asNum = Number(g);
          return Number.isFinite(asNum) ? asNum : null;
        })
        .filter((v): v is number => v !== null),
    );
  }

  private isBlockedByParental(movie: any, cfg: ParentalConfig): boolean {
    if (!cfg) return false;
    if ((cfg.minAge ?? 0) <= 0 && !cfg.bannedGenres) return false;
    const bannedIds = this.parseGenreList(cfg.bannedGenres);
    const minAge = cfg.minAge ?? 0;
    const isAdult = Boolean(movie?.adult);
    if (minAge > 0 && isAdult) return true;
    if (bannedIds.size > 0) {
      const genreIds = this.extractGenres(movie);
      if (genreIds.some((id) => bannedIds.has(id))) return true;
    }
    return false;
  }

  private isBlockedByChild(movie: any, cfg: ChildConfig): boolean {
    const genreIds = this.extractGenres(movie);
    const allowed = this.parseGenreList(cfg.allowedGenres);
    const isAdult = Boolean(movie?.adult);
    if (cfg.age < 18 && isAdult) return true;
    if (allowed.size > 0) {
      // require at least one overlap with allowed genres; if none, block
      if (!genreIds.some((id) => allowed.has(id))) return true;
    }
    return false;
  }

  private extractGenres(movie: any): number[] {
    if (Array.isArray(movie?.genre_ids)) return movie.genre_ids;
    if (Array.isArray(movie?.genres)) return movie.genres.map((g: any) => g.id);
    return [];
  }

  private filterList(data: any, filter: { type: 'child'; cfg: ChildConfig } | { type: 'parental'; cfg: ParentalConfig } | null) {
    if (!filter) return data;
    if (filter.type === 'parental' && (!filter.cfg || ((filter.cfg.minAge ?? 0) <= 0 && !filter.cfg.bannedGenres))) return data;

    const results = Array.isArray(data?.results)
      ? data.results.filter((movie: any) => {
          if (filter.type === 'child') return !this.isBlockedByChild(movie, filter.cfg);
          return !this.isBlockedByParental(movie, filter.cfg);
        })
      : [];
    return { ...data, results };
  }

  private ensureDetailAllowed(detail: any, filter: { type: 'child'; cfg: ChildConfig } | { type: 'parental'; cfg: ParentalConfig } | null) {
    if (!filter) return;
    if (filter.type === 'parental' && (!filter.cfg || ((filter.cfg.minAge ?? 0) <= 0 && !filter.cfg.bannedGenres))) return;
    const blocked = filter.type === 'child' ? this.isBlockedByChild(detail, filter.cfg) : this.isBlockedByParental(detail, filter.cfg);
    if (blocked) throw new ForbiddenException('Content blocked by profile restrictions');
  }
}
