import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieCarousel from '../components/MovieCarousel';
import Footer from '../components/Footer';
import '../App.css';

const Home = () => {
  // Sample movie data - you can replace with TMDB API data later
  const trendingMovies = [
    { 
      title: 'Monkey Man', 
      poster: '/src/assets/monkey-man.jpg', 
      year: '2024', 
      rating: '8.2' 
    },
    { 
      title: 'Oppenheimer', 
      poster: '/src/assets/oppenheimer.jpg', 
      year: '2023', 
      rating: '8.3' 
    },
    { 
      title: 'Cargo', 
      poster: '/src/assets/cargo.jpg', 
      year: '2024', 
      rating: '7.8' 
    },
    { 
      title: 'My Trip', 
      poster: '/src/assets/my-trip.jpg', 
      year: '2024', 
      rating: '7.5' 
    },
    { 
      title: 'The Godfather', 
      poster: '/src/assets/the-godfather.jpg', 
      year: '1972', 
      rating: '9.2' 
    },
    { 
      title: 'Avengers: Endgame', 
      poster: '/src/assets/avengers.jpg', 
      year: '2019', 
      rating: '8.4' 
    },
    { 
      title: 'Dune', 
      poster: '/src/assets/dune.jpg', 
      year: '2024', 
      rating: '8.0' 
    }
  ];

  const latestReleases = [
    { 
      title: 'Death Note', 
      poster: '/src/assets/death-note.jpg', 
      year: '2024', 
      rating: '8.0' 
    },
    { 
      title: 'Jujutsu Kaisen', 
      poster: '/src/assets/jujutsu-kaisen.jpg', 
      year: '2024', 
      rating: '8.7' 
    },
    { 
      title: 'Attack on Titan', 
      poster: '/src/assets/attack-on-titan.jpg', 
      year: '2024', 
      rating: '9.0' 
    },
    { 
      title: 'Wind Breaker', 
      poster: '/src/assets/wind-breaker.jpg', 
      year: '2024', 
      rating: '7.9' 
    },
    { 
      title: 'Demon Slayer', 
      poster: '/src/assets/demon-slayer.jpg', 
      year: '2024', 
      rating: '8.5' 
    },
    { 
      title: 'Dragon Ball Super', 
      poster: '/src/assets/dragon-ball.jpg', 
      year: '2024', 
      rating: '8.1' 
    },
    { 
      title: 'One Piece', 
      poster: '/src/assets/onepiece.jpg', 
      year: '2024', 
      rating: '9.1' 
    }
  ];

  return (
    <div className="homepage">
      <Navbar />
      <Hero />
      
      {/* Movie Sections */}
      <MovieCarousel title="Trending Now" movies={trendingMovies} />
      <MovieCarousel title="Latest Releases" movies={latestReleases} />
      
      <Footer />
    </div>
  );
};

export default Home;
