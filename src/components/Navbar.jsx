import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('Home');

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container-fluid px-4">
        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img src={logo} alt="Cinaverse Logo" className="navbar-logo me-2" />
        </a>

        {/* Navigation Links */}
        <ul className="navbar-nav d-flex flex-row">
          {['Home', 'Movies', 'Wishlist', 'TV Guide'].map((link) => (
            <li key={link} className="nav-item mx-3">
              <a
                href="#"
                className={`nav-link custom-nav-link ${activeLink === link ? 'active-link' : ''}`}
                onClick={() => setActiveLink(link)}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Sign Up Button */}
        <button className="btn btn-danger fw-bold px-3">
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

