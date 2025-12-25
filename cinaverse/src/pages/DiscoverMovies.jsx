import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/discover/SearchBar';
import Filters from '../components/discover/Filters';
import MovieResultCard from '../components/discover/MovieResultCard';
import { useStore } from '../context/StoreContext';
import '../App.css';

const DiscoverMovies = () => {
  const { searchMovies, addToWatchlist } = useStore();
  const [query, setQuery] = useState('trending');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [minRating, setMinRating] = useState(0);
  const [year, setYear] = useState('');

  const fetchMovies = async (q) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(q || query || 'trending');
      setResults(Array.isArray(data) ? data : (data?.results || []));
    } catch (e) {
      setError(e.message || 'Could not load movies');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies('trending');
  }, []);

  const filtered = useMemo(() => {
    return results
      .filter((m) => {
        const rating = m.vote_average || m.rating || 0;
        const releaseYear = m.release_date ? new Date(m.release_date).getFullYear() : null;
        const matchesRating = rating >= minRating;
        const matchesYear = year ? String(releaseYear || '').startsWith(String(year)) : true;
        return matchesRating && matchesYear;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.vote_average || b.rating || 0) - (a.vote_average || a.rating || 0);
        if (sortBy === 'year') {
          const ay = a.release_date ? new Date(a.release_date).getFullYear() : 0;
          const by = b.release_date ? new Date(b.release_date).getFullYear() : 0;
          return by - ay;
        }
        if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
        return (b.popularity || 0) - (a.popularity || 0);
      });
  }, [results, sortBy, minRating, year]);

  const handleAdd = async (movie) => {
    try {
      await addToWatchlist(movie.id);
      alert('Added to watchlist');
    } catch (e) {
      alert(e.message || 'Failed to add');
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <section className="section-header">
          <div>
            <h2>Discover Movies</h2>
            <p className="text-muted">Search the catalog and add titles to your watchlist.</p>
          </div>
          <SearchBar value={query} onChange={setQuery} onSubmit={() => fetchMovies(query)} />
        </section>

        <Filters sortBy={sortBy} setSortBy={setSortBy} minRating={minRating} setMinRating={setMinRating} year={year} setYear={setYear} />

        {loading && <p className="text-muted">Loading...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="discover-grid">
          {!loading && filtered.map((movie) => (
            <MovieResultCard key={movie.id} movie={movie} onAdd={handleAdd} />
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="text-muted">No movies found. Try another search.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DiscoverMovies;
