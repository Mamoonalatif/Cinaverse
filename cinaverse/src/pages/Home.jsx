import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/home/Hero';
import MovieCarousel from '../components/home/MovieCarousel';
import Footer from '../components/Footer';
import AboutUs from '../components/home/AboutUs';
import { useStore } from '../context/StoreContext';
import '../App.css';

const Home = () => {
  const { getTrendingMovies, getLatestMovies } = useStore();
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [trendData, latestData] = await Promise.all([
          getTrendingMovies(),
          getLatestMovies()
        ]);
        setTrending(Array.isArray(trendData) ? trendData : (trendData?.results || []));
        setLatest(Array.isArray(latestData) ? latestData : (latestData?.results || []));
      } catch (error) {
        console.error('Failed to load home data:', error);
      }
    };
    load();
  }, [getTrendingMovies, getLatestMovies]);

  return (
    <div className="homepage">
      <Navbar />
      <Hero />
      <MovieCarousel title="Trending Now" movies={trending} />
      <MovieCarousel title="Latest Releases" movies={latest} />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default Home;
