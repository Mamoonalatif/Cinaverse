import React from 'react';

const WatchlistItem = ({ item, onRemove }) => {
  const title = item.title || item.name || `Movie #${item.movieId || item.id}`;
  const posterPath = item.poster || item.poster_path;
  const poster = posterPath ? (posterPath.startsWith('http') ? posterPath : `https://image.tmdb.org/t/p/w500${posterPath}`) : '/src/assets/placeholder-movie.jpg';
  const rating = item.rating || item.vote_average || 'N/A';
  const year = item.year || (item.release_date ? new Date(item.release_date).getFullYear() : '');
  const status = item.status || 'unwatched';

  return (
    <div className="watchlist-card">
      <div className="watchlist-poster">
        <img src={poster} alt={title} />
        <div className="watchlist-overlay">
          <button className="btn btn-outline-light btn-sm" onClick={onRemove}>Remove</button>
        </div>
        <div className="watchlist-badge">{status}</div>
      </div>
      <div className="watchlist-info">
        <h5>{title}</h5>
        <p className="text-muted">{year}</p>
        <div className="watchlist-meta">⭐ {rating}</div>
      </div>
    </div>
  );
};

export default WatchlistItem;
