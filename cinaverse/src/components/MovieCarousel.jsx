import React, { useState, useRef } from 'react';

const MovieCarousel = ({ title, movies }) => {
  const scrollRef = useRef(null);
  const [failedImages, setFailedImages] = useState(new Set());

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleImageError = (movieId) => {
    setFailedImages(prev => new Set([...prev, movieId]));
  };

  // Filter out movies with failed images
  const validMovies = movies.filter(movie => {
    const movieId = movie.id || movie.tmdbId;
    return !failedImages.has(movieId);
  });

  return (
    <div className="movie-carousel-section">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">{title}</h2>
          <div className="carousel-controls">
            <button 
              className="carousel-btn" 
              onClick={() => scroll('left')}
              aria-label="Previous"
            >
              ‹
            </button>
            <button 
              className="carousel-btn" 
              onClick={() => scroll('right')}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
        
        <div className="movie-section-card">
          <div className="movie-carousel-container" ref={scrollRef}>
            <div className="movie-carousel-track">
              {validMovies.map((movie, index) => {
                const posterPath = movie.poster || movie.poster_path || movie.backdrop_path;
                const src = posterPath
                  ? (posterPath.startsWith('http') ? posterPath : `https://image.tmdb.org/t/p/w500${posterPath}`)
                  : '/src/assets/placeholder-movie.jpg';
                const rating = movie.rating || movie.vote_average;
                const title = movie.title || movie.name || 'Untitled';
                const year = movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : '');
                const overview = movie.overview || '';
                const movieId = movie.id || movie.tmdbId;
                
                return (
                  <div key={index} className="movie-card">
                    <div className="movie-poster">
                      <img 
                        src={src} 
                        alt={title}
                        className="movie-image"
                        loading="lazy"
                        onError={() => handleImageError(movieId)}
                      />
                      <div className="movie-overlay">
                        <div className="movie-info">
                          <h5 className="movie-title">{title}</h5>
                          {year && <p className="movie-year">{year}</p>}
                          {rating && (
                            <div className="movie-rating">
                              ⭐ {rating}
                            </div>
                          )}
                          {overview && <p className="movie-overview">{overview.slice(0, 110)}{overview.length > 110 ? '…' : ''}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
