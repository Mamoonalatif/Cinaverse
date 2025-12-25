import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieCarousel from '../components/MovieCarousel';
import Footer from '../components/Footer';
import { useStore } from '../context/StoreContext';
import '../App.css';

const Home = () => {
  const { getTrendingMovies, getLatestMovies } = useStore();
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const trend = await getTrendingMovies();
        setTrending(Array.isArray(trend) ? trend : (trend?.results || []));
      } catch {
        setTrending([]);
      }
      try {
        const recent = await getLatestMovies();
        setLatest(Array.isArray(recent) ? recent : (recent?.results || []));
      } catch {
        setLatest([]);
      }
    };
    load();
  }, []);

  return (
    <div className="homepage">
      <Navbar />
      <Hero />
      <MovieCarousel title="Trending Now" movies={trending} />
      <MovieCarousel title="Latest Releases" movies={latest} />
      <Footer />
    </div>
  );
};

export default Home;
