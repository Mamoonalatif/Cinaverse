import React from 'react';

const SearchBar = ({ value, onChange, onSubmit }) => {
  return (
    <form className="search-bar" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <input
        type="text"
        className="form-control"
        placeholder="Search movies by title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className="btn btn-danger">Search</button>
    </form>
  );
};

export default SearchBar;
