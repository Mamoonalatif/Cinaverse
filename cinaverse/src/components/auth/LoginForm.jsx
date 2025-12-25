import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading } = useStore();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email: form.email, password: form.password, remember: form.remember });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-subtitle">Sign in to continue</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group d-flex align-items-center justify-content-between">
          <label className="d-flex align-items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />
            Remember me
          </label>
          <a className="text-muted" href="#">Forgot password?</a>
        </div>
        <button type="submit" className="btn btn-danger w-100" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div className="auth-footer">
          <span>New here?</span>
          <button type="button" className="btn btn-link" onClick={() => navigate('/register')}>
            Create account
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
