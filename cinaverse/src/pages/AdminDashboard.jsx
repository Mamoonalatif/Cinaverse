import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsCard from '../components/dashboards/StatsCard';
import { useStore } from '../context/StoreContext';
import '../App.css';

const AdminDashboard = () => {
  const { adminGetUsers, adminGetLogs, adminGetWatchlists, adminUpdateUserRole } = useStore();
  const [users, setUsers] = useState([]);
  const [logsCount, setLogsCount] = useState(0);
  const [watchlists, setWatchlists] = useState([]);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await adminGetUsers();
        setUsers(Array.isArray(u) ? u : []);
      } catch (e) {
        setError(e.message || 'Admin access required');
      }
      try {
        const logs = await adminGetLogs();
        setLogsCount(Array.isArray(logs) ? logs.length : 0);
      } catch {}
      try {
        const wl = await adminGetWatchlists();
        setWatchlists(Array.isArray(wl) ? wl : []);
      } catch {}
    };
    load();
  }, []);

  const handleRoleChange = async (id, role) => {
    setSavingId(id);
    try {
      await adminUpdateUserRole(id, role);
      const u = await adminGetUsers();
      setUsers(Array.isArray(u) ? u : []);
    } catch (e) {
      setError(e.message || 'Failed to update role');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="section-header">
          <div>
            <h2>Admin Dashboard</h2>
            <p className="text-muted">Platform overview</p>
          </div>
        </div>

        {error && <div className="alert alert-warning">{error}</div>}

        <div className="stats-grid">
          <StatsCard icon="👥" label="Users" value={users.length} />
          <StatsCard icon="📋" label="Watchlists" value={watchlists.length} />
          <StatsCard icon="📝" label="Logs" value={logsCount} />
        </div>

        <section className="card-panel">
          <div className="card-header">
            <h4>Recent Users</h4>
          </div>
          <div className="table-responsive">
            <table className="table table-dark table-sm mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 8).map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.email}</td>
                    <td>{u.createdAt || u.created_at || ''}</td>
                    <td>{u.role}</td>
                    <td>
                      <select
                        className="form-select form-select-sm bg-dark text-white"
                        value={u.role}
                        disabled={savingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="user">user</option>
                        <option value="parent">parent</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr>
                    <td colSpan="5" className="text-muted">No users or insufficient permissions.</td>
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

export default AdminDashboard;
