import React from 'react';

const Filters = ({ sortBy, setSortBy, minRating, setMinRating, year, setYear }) => {
  return (
    <div className="discover-filters">
      <div>
        <label className="form-label">Sort by</label>
        <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="popularity">Popularity</option>
          <option value="rating">Rating</option>
          <option value="year">Year</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div>
        <label className="form-label">Min rating</label>
        <select className="form-select" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
          <option value={0}>Any</option>
          <option value={6}>6+</option>
          <option value={7}>7+</option>
          <option value={8}>8+</option>
          <option value={9}>9+</option>
        </select>
      </div>
      <div>
        <label className="form-label">Year</label>
        <input
          type="number"
          className="form-control"
          placeholder="e.g. 2024"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Filters;
