import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsCard from '../components/dashboards/StatsCard';
import ActivityList from '../components/dashboards/ActivityList';
import { useStore } from '../context/StoreContext';
import '../App.css';

const UserDashboard = () => {
  const { user, getWatchlist, getLogs } = useStore();
  const [watchlist, setWatchlist] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const wl = await getWatchlist();
        setWatchlist(Array.isArray(wl) ? wl : []);
      } catch {
        setWatchlist([]);
      }
      try {
        const l = await getLogs();
        setLogs(Array.isArray(l) ? l.slice(0, 10) : []);
      } catch {
        setLogs([]);
      }
    };
    load();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="section-header">
          <div>
            <h2>Welcome, {user?.email || 'Guest'}</h2>
            <p className="text-muted">Overview of your activity</p>
          </div>
        </div>

        <div className="stats-grid">
          <StatsCard icon="📋" label="Watchlist items" value={watchlist.length} />
          <StatsCard icon="⭐" label="Recent reviews" value={0} />
          <StatsCard icon="🕒" label="Activity logs" value={logs.length} />
          <StatsCard icon="💳" label="Plan" value={user?.plan || 'None'} tone="accent" />
        </div>

        <section className="card-panel">
          <div className="card-header">
            <h4>Recent Activity</h4>
          </div>
          <ActivityList items={logs} />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
