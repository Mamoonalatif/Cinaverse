import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.png';
import { useStore } from '../context/StoreContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, activeChildId, clearChildProfile, childProfiles } = useStore();

  // Find active child profile name
  const activeChild = childProfiles?.find(p => p.id === activeChildId);

  // Only show links based on user role
  const navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'Discover', path: '/discover' },
    user && { name: 'Watchlist', path: '/watchlist' },
    user && { name: 'Dashboard', path: '/dashboard' },
  ].filter(Boolean);

  const handleLogout = () => {
    clearChildProfile();
    logout();
    navigate('/auth', { replace: true });
  };

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
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `nav-link custom-nav-link${isActive ? ' active-link' : ''}`
                }
                end
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="d-flex gap-2 align-items-center">
          {activeChild && (
            <span className="badge custom-red text-white fw-black px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: '10px', letterSpacing: '1px' }}>
              PROFILING: {activeChild.name.toUpperCase()}
            </span>
          )}
          {!user && (
            <>
              <Link to="/auth" className="btn btn-outline-light fw-bold px-3">
                Login / Signup
              </Link>
            </>
          )}
          {user && (
            <button
              className="btn btn-outline-light fw-bold px-3 hover-red"
              onClick={handleLogout}
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

