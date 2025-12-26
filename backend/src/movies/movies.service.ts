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
  private memoryCache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_TTL = 900000; // 15 minutes
  private configCache = new Map<string, { data: any; timestamp: number }>();
  private CONFIG_TTL = 300000; // 5 minutes for user/child configs

  constructor(
    private http: HttpService,
    private config: ConfigService,
    @InjectRepository(MovieCache) private cache: Repository<MovieCache>,
    @InjectRepository(ParentalSettings) private parentalRepo: Repository<ParentalSettings>,
    @InjectRepository(ChildProfile) private childRepo: Repository<ChildProfile>,
  ) { }

  private getCached(key: string) {
    const cached = this.memoryCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) return cached.data;
    return null;
  }

  private setCache(key: string, data: any) {
    this.memoryCache.set(key, { data, timestamp: Date.now() });
  }

  async search(query: string, userId?: number, childProfileId?: number) {
    const cacheKey = `search_${query}`;
    let data = this.getCached(cacheKey);

    if (!data) {
      const key = this.config.get('TMDB_API_KEY');
      const res = await this.http.axiosRef.get(`${this.base}/search/movie`, { params: { api_key: key, query } });
      data = res.data;
      this.setCache(cacheKey, data);
    }

    const filter = await this.getFilterConfig(userId, childProfileId);
    return this.filterList(data, filter);
  }

  async getTrending(timeWindow: 'day' | 'week' = 'week', userId?: number, childProfileId?: number) {
    const cacheKey = `trending_${timeWindow}`;
    let data = this.getCached(cacheKey);

    if (!data) {
      const key = this.config.get('TMDB_API_KEY');
      const res = await this.http.axiosRef.get(`${this.base}/trending/movie/${timeWindow}`, { params: { api_key: key } });
      data = res.data;
      this.setCache(cacheKey, data);
    }

    const filter = await this.getFilterConfig(userId, childProfileId);
    return this.filterList(data, filter);
  }

  async getPopular(page: number = 1, userId?: number, childProfileId?: number) {
    const cacheKey = `popular_${page}`;
    let data = this.getCached(cacheKey);

    if (!data) {
      const key = this.config.get('TMDB_API_KEY');
      const res = await this.http.axiosRef.get(`${this.base}/movie/popular`, { params: { api_key: key, page } });
      data = res.data;
      this.setCache(cacheKey, data);
    }

    const filter = await this.getFilterConfig(userId, childProfileId);
    return this.filterList(data, filter);
  }

  async getLatestReleases(userId?: number, childProfileId?: number) {
    const cacheKey = 'latest_releases';
    let data = this.getCached(cacheKey);

    if (!data) {
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
      data = res.data;
      this.setCache(cacheKey, data);
    }

    const filter = await this.getFilterConfig(userId, childProfileId);
    return this.filterList(data, filter);
  }

  async getDetails(id: string, userId?: number, childProfileId?: number) {
    const cached = await this.cache.findOne({ where: { movieId: id } });
    if (cached && Date.now() - new Date(cached.updatedAt).getTime() < 86400000) {
      const filter = await this.getFilterConfig(userId, childProfileId);
      this.ensureDetailAllowed(cached.data, filter);
      return cached.data;
    }

    const key = this.config.get('TMDB_API_KEY');
    const res = await this.http.axiosRef.get(`${this.base}/movie/${id}`, { params: { api_key: key } });
    const filter = await this.getFilterConfig(userId, childProfileId);
    this.ensureDetailAllowed(res.data, filter);
    await this.cache.upsert({ movieId: id, data: res.data }, ['movieId']);
    return res.data;
  }

  async getTrailer(id: string) {
    const cacheKey = `trailer_${id}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const key = this.config.get('TMDB_API_KEY');
    const res = await this.http.axiosRef.get(`${this.base}/movie/${id}/videos`, { params: { api_key: key } });
    const trailer = res.data.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
    const result = trailer && trailer.key ? { trailerUrl: `https://www.youtube.com/watch?v=${trailer.key}` } : { trailerUrl: null };

    this.setCache(cacheKey, result);
    return result;
  }

  async getSimilarMovies(id: string, userId?: number, childProfileId?: number) {
    const cacheKey = `similar_${id}`;
    let data = this.getCached(cacheKey);

    if (!data) {
      const key = this.config.get('TMDB_API_KEY');
      const res = await this.http.axiosRef.get(`${this.base}/movie/${id}/similar`, { params: { api_key: key } });
      data = res.data;
      this.setCache(cacheKey, data);
    }

    const filter = await this.getFilterConfig(userId, childProfileId);
    return this.filterList(data, filter);
  }

  async getGenres() {
    const cacheKey = 'genres_list';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const key = this.config.get('TMDB_API_KEY');
    const res = await this.http.axiosRef.get(`${this.base}/genre/movie/list`, { params: { api_key: key } });
    this.setCache(cacheKey, res.data);
    return res.data;
  }

  private async getFilterConfig(userId?: number, childProfileId?: number): Promise<{ type: 'child'; cfg: ChildConfig } | { type: 'parental'; cfg: ParentalConfig } | null> {
    const cacheKey = childProfileId ? `child_${childProfileId}` : `parental_${userId}`;
    if (userId || childProfileId) {
      const cached = this.configCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CONFIG_TTL) return cached.data;
    }

    let result: any = null;

    if (childProfileId !== undefined && childProfileId !== null) {
      if (!userId) throw new UnauthorizedException('Login required');
      const child = await this.childRepo.findOne({ where: { id: childProfileId, parent: { id: userId } } });
      if (!child) throw new ForbiddenException('Profile not found');
      result = { type: 'child', cfg: { age: child.age, allowedGenres: child.allowedGenres, maxAgeRating: child.maxAgeRating } };
    } else if (userId) {
      const settings = await this.parentalRepo.findOne({ where: { user: { id: userId } } });
      if (settings) {
        result = { type: 'parental', cfg: { minAge: settings.minAge, bannedGenres: settings.bannedGenres } };
      }
    }

    if (userId || childProfileId) {
      this.configCache.set(cacheKey, { data: result, timestamp: Date.now() });
    }
    return result;
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

  private filterList(data: any, filter: { type: 'child'; cfg: ChildConfig } | { type: 'parental'; cfg: ParentalConfig } | null) {
    if (!filter) return data;

    // Pre-parse genre lists for efficiency
    const parsedGenres = filter.type === 'child'
      ? this.parseGenreList(filter.cfg.allowedGenres)
      : this.parseGenreList(filter.cfg?.bannedGenres);

    const minAge = filter.type === 'parental' ? filter.cfg?.minAge ?? 0 : filter.cfg.age;

    const results = Array.isArray(data?.results)
      ? data.results.filter((movie: any) => {
        const isAdult = Boolean(movie?.adult);
        if (minAge > 0 && isAdult && (filter.type === 'child' ? minAge < 18 : true)) return false;

        const genreIds = this.extractGenres(movie);
        if (filter.type === 'child' && parsedGenres.size > 0) {
          if (!genreIds.some(id => parsedGenres.has(id))) return false;
        } else if (filter.type === 'parental' && parsedGenres.size > 0) {
          if (genreIds.some(id => parsedGenres.has(id))) return false;
        }
        return true;
      })
      : [];
    return { ...data, results };
  }

  private ensureDetailAllowed(movie: any, filter: { type: 'child'; cfg: ChildConfig } | { type: 'parental'; cfg: ParentalConfig } | null) {
    if (!filter) return;
    const parsedGenres = filter.type === 'child'
      ? this.parseGenreList(filter.cfg.allowedGenres)
      : this.parseGenreList(filter.cfg?.bannedGenres);

    const minAge = filter.type === 'parental' ? filter.cfg?.minAge ?? 0 : filter.cfg.age;
    const isAdult = Boolean(movie?.adult);
    const genreIds = this.extractGenres(movie);

    let blocked = false;
    if (minAge > 0 && isAdult && (filter.type === 'child' ? minAge < 18 : true)) blocked = true;
    else if (filter.type === 'child' && parsedGenres.size > 0) {
      if (!genreIds.some(id => parsedGenres.has(id))) blocked = true;
    } else if (filter.type === 'parental' && parsedGenres.size > 0) {
      if (genreIds.some(id => parsedGenres.has(id))) blocked = true;
    }

    if (blocked) throw new ForbiddenException('Blocked by restrictions');
  }

  private extractGenres(movie: any): number[] {
    if (Array.isArray(movie?.genre_ids)) return movie.genre_ids;
    if (Array.isArray(movie?.genres)) return movie.genres.map((g: any) => g.id);
    return [];
  }

}
