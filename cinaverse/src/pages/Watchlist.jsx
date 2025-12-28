import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WatchlistItem from '../components/watchlist/WatchlistItem';
import { useStore } from '../context/StoreContext';
import '../App.css';

const Watchlist = () => {
  const { getWatchlist, removeFromWatchlist } = useStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWatchlist();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load watchlist');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromWatchlist(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      alert(e.message || 'Failed to remove');
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="section-header">
          <div>
            <h2>My Watchlist</h2>
            <p className="text-muted">Manage the movies you want to watch.</p>
          </div>
        </div>
        {loading && <p className="text-muted">Loading...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="watchlist-grid">
          {!loading && items.map((item) => (
            <WatchlistItem key={item.id} item={item} onRemove={() => handleRemove(item.id)} />
          ))}
        </div>
        {!loading && items.length === 0 && <p className="text-muted">Your watchlist is empty.</p>}
      </main>
      <Footer />
    </div>
  );
};

export default Watchlist;
