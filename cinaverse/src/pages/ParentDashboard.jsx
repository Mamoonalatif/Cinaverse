import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsCard from '../components/dashboards/StatsCard';
import { useStore } from '../context/StoreContext';
import '../App.css';

const ParentDashboard = () => {
  const {
    getParentalSettings,
    setParentalSettings,
    getWatchlist,
    listChildProfiles,
    createChildProfile,
    deleteChildProfile,
    selectChildProfile,
    clearChildProfile,
    activeChildId,
  } = useStore();

  const [settings, setSettings] = useState({ minAge: 13, bannedGenres: '' });
  const [saving, setSaving] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ name: '', age: 10, allowedGenres: 'animation,family', maxAgeRating: 'PG' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await getParentalSettings();
        if (s) setSettings({ minAge: s.minAge ?? 13, bannedGenres: s.bannedGenres ?? '' });
      } catch {}
      try {
        const wl = await getWatchlist();
        setWatchlistCount(Array.isArray(wl) ? wl.length : 0);
      } catch {}
      try {
        const cps = await listChildProfiles();
        setProfiles(Array.isArray(cps) ? cps : []);
      } catch {}
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setParentalSettings(settings);
      alert('Saved');
    } catch (e) {
      alert(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateChild = async () => {
    setBusy(true);
    try {
      await createChildProfile(form);
      const cps = await listChildProfiles();
      setProfiles(Array.isArray(cps) ? cps : []);
      setForm({ name: '', age: 10, allowedGenres: 'animation,family', maxAgeRating: 'PG' });
    } catch (e) {
      alert(e.message || 'Could not create profile');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this child profile?')) return;
    setBusy(true);
    try {
      await deleteChildProfile(id);
      const cps = await listChildProfiles();
      setProfiles(Array.isArray(cps) ? cps : []);
      if (activeChildId === id) clearChildProfile();
    } catch (e) {
      alert(e.message || 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="section-header">
          <div>
            <h2>Parent Dashboard</h2>
            <p className="text-muted">Control viewing preferences and child profiles</p>
          </div>
        </div>

        <div className="stats-grid">
          <StatsCard icon="🛡️" label="Min Age" value={settings.minAge} />
          <StatsCard icon="📋" label="Watchlist" value={watchlistCount} />
          <StatsCard icon="👶" label="Child Profiles" value={profiles.length} />
        </div>

        <section className="card-panel">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4>Parental Settings</h4>
            {activeChildId && <span className="badge bg-info">Active Child: #{activeChildId}</span>}
          </div>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Minimum Age</label>
              <input
                type="number"
                className="form-control"
                value={settings.minAge}
                onChange={(e) => setSettings((prev) => ({ ...prev, minAge: Number(e.target.value) }))}
              />
            </div>
            <div className="col-md-9">
              <label className="form-label">Banned Genres (comma separated)</label>
              <input
                type="text"
                className="form-control"
                value={settings.bannedGenres}
                onChange={(e) => setSettings((prev) => ({ ...prev, bannedGenres: e.target.value }))}
              />
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-danger" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              {activeChildId && (
                <button className="btn btn-outline-light" onClick={clearChildProfile}>
                  Clear Active Child
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="card-panel mt-4">
          <div className="card-header">
            <h4>Child Profiles</h4>
          </div>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                value={form.age}
                onChange={(e) => setForm((p) => ({ ...p, age: Number(e.target.value) }))}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Max Age Rating</label>
              <input
                className="form-control"
                value={form.maxAgeRating}
                onChange={(e) => setForm((p) => ({ ...p, maxAgeRating: e.target.value }))}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Allowed Genres (comma)</label>
              <input
                className="form-control"
                value={form.allowedGenres}
                onChange={(e) => setForm((p) => ({ ...p, allowedGenres: e.target.value }))}
              />
            </div>
            <div className="col-12">
              <button className="btn btn-primary" onClick={handleCreateChild} disabled={busy}>
                {busy ? 'Saving...' : 'Add Child Profile'}
              </button>
            </div>
          </div>

          <div className="table-responsive mt-3">
            <table className="table table-dark table-sm mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Allowed Genres</th>
                  <th>Max Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.age}</td>
                    <td>{c.allowedGenres}</td>
                    <td>{c.maxAgeRating}</td>
                    <td className="d-flex gap-2">
                      <button
                        className={`btn btn-sm ${activeChildId === c.id ? 'btn-success' : 'btn-outline-light'}`}
                        onClick={() => selectChildProfile(c.id)}
                      >
                        {activeChildId === c.id ? 'Active' : 'Activate'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!profiles.length && (
                  <tr>
                    <td colSpan="6" className="text-muted">No child profiles yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ParentDashboard;
