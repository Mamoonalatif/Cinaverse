import React from 'react';

const SearchBar = ({ value, onChange, onSubmit }) => {
  return (
    <form className="search-bar bg-black rounded-3 p-2 d-flex align-items-center" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <input
        type="text"
        className="form-control bg-black text-secondary border-secondary me-2"
        placeholder="Search movies by title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ minWidth: 180 }}
      />
      <button type="submit" className="btn custom-red-btn">Search</button>
    </form>
  );
};

export default SearchBar;
