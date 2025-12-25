import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, loading } = useStore();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register({ email: form.email, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Join Cinaverse</h2>
      <p className="auth-subtitle">Create your account to start watching</p>
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
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-danger w-100" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <div className="auth-footer">
          <span>Already have an account?</span>
          <button type="button" className="btn btn-link" onClick={() => navigate('/login')}>
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
