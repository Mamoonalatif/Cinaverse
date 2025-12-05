import React, { useState, useRef } from 'react';

const MovieCarousel = ({ title, movies }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
              {movies.map((movie, index) => (
                <div key={index} className="movie-card">
                  <div className="movie-poster">
                    <img 
                      src={movie.poster || '/src/assets/placeholder-movie.jpg'} 
                      alt={movie.title}
                      className="movie-image"
                      loading="lazy"
                    />
                    <div className="movie-overlay">
                      <div className="movie-info">
                        <h5 className="movie-title">{movie.title}</h5>
                        {movie.year && <p className="movie-year">{movie.year}</p>}
                        {movie.rating && (
                          <div className="movie-rating">
                            ⭐ {movie.rating}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
