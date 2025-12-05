import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import thedarkknight from '../assets/thedarkknight.jpg';
import avengerendgame from '../assets/avenger-endgame.jpg';
import spiderman from '../assets/spider-man.png';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Sample movie data for UI
  const movies = [
    {
      id: 1,
      title: 'The Dark Knight',
      overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      backdrop_path: thedarkknight
    },
    {
      id: 2,
      title: 'Avengers: Endgame',
      overview: 'After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more.',
      backdrop_path: avengerendgame
    },
    {
      id: 3,
      title: 'Spider-Man: No Way Home',
      overview: 'For the first time in the cinematic history of Spider-Man, our friendly neighborhood hero is unmasked and no longer able to separate his normal life from the high-stakes of being a Super Hero.',
      backdrop_path: spiderman
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentMovie = movies[currentSlide];

  return (
    <div className="hero-carousel" style={{ width: '100vw', overflow: 'hidden' }}>
      <div 
        className="hero-slide" 
        style={{
          backgroundImage: `url(${currentMovie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100vw',
          position: 'relative'
        }}
      >
        <div className="hero-overlay"></div>
        <div className="container-fluid h-100 d-flex align-items-center">
          <div className="row w-100">
            <div className="col-lg-6 col-md-8">
              <div className="hero-content">
                <h1 className="h3 fw-bold text-white mb-3">
                  {currentMovie.title}
                </h1>
                <p className="text-white mb-3" style={{ maxWidth: '400px', fontSize: '0.9rem' }}>
                  {currentMovie.overview}
                </p>
                <div className="hero-buttons">
                  <button className="btn btn-danger me-2 px-3 py-2">
                    <i className="bi bi-play-fill me-1"></i>Play
                  </button>
                  <button className="btn btn-outline-light px-3 py-2">
                    <i className="bi bi-info-circle me-1"></i>More Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          className="hero-arrow-left"
          onClick={prevSlide}
        >
          〈
        </button>
        <button 
          className="hero-arrow-right"
          onClick={nextSlide}
        >
          〉
        </button>

        {/* Indicators */}
        <div className="hero-indicators">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
