import React from 'react';
import { useStore } from '../../context/StoreContext';

const Filters = ({ sortBy, setSortBy, minRating, setMinRating, year, setYear, genre, setGenre }) => {
  const { genres } = useStore();

  return (
    <div className="discover-filters bg-black rounded-3 p-3 mb-3 d-flex flex-wrap gap-3 align-items-end">
      <div>
        <label className="form-label text-secondary">Sort by</label>
        <select className="form-select bg-black text-secondary border-secondary" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="popularity">Popularity</option>
          <option value="rating">Rating</option>
          <option value="year">Year</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div>
        <label className="form-label text-secondary">Min rating</label>
        <select className="form-select bg-black text-secondary border-secondary" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
          <option value={0}>min-rating</option>
          <option value={6}>6+</option>
          <option value={7}>7+</option>
          <option value={8}>8+</option>
          <option value={9}>9+</option>
        </select>
      </div>
      <div>
        <label className="form-label text-secondary">Year</label>
        <input
          type="number"
          className="form-control bg-black border-secondary"
          style={{ color: '#ccc' }}
          placeholder="e.g. 2024"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <div>
        <label className="form-label text-secondary">Genre</label>
        <select className="form-select bg-black text-secondary border-secondary" value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="">Any</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
