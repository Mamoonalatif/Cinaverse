import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.png';
import { useStore } from '../context/StoreContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const { user, logout, activeChildId, clearChildProfile } = useStore();

  const navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'Discover', path: '/discover' },
    { name: 'Watchlist', path: '/watchlist' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Admin', path: '/admin-dashboard' },
    { name: 'Parent', path: '/parent-dashboard' }
  ];

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container-fluid px-4">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Cinaverse Logo" className="navbar-logo me-2" />
        </Link>

        {/* Navigation Links */}
        <ul className="navbar-nav d-flex flex-row">
          {navigationLinks.map((link) => (
            <li key={link.name} className="nav-item mx-3">
              <Link
                to={link.path}
                className={`nav-link custom-nav-link ${location.pathname === link.path ? 'active-link' : ''}`}
                onClick={() => setActiveLink(link.path)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="d-flex gap-2 align-items-center">
          {activeChildId && (
            <span className="badge bg-info text-dark">Child Active: #{activeChildId}</span>
          )}
          {!user && (
            <>
              <Link to="/login" className="btn btn-outline-light fw-bold px-3">
                Login
              </Link>
              <Link to="/register" className="btn btn-danger fw-bold px-3">
                Sign Up
              </Link>
            </>
          )}
          {user && (
            <button
              className="btn btn-outline-light fw-bold px-3"
              onClick={async () => {
                clearChildProfile();
                await logout();
                navigate('/login');
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

