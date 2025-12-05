import React from 'react';

export default function Footer() {
  return (
    <footer className="professional-footer">
      <div className="container-fluid">
        <div className="footer-content">
          
          {/* Main Footer Content */}
          <div className="row">
            
            {/* Brand Section */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="footer-brand">
                <h4 className="brand-title">Cinaverse</h4>
                <p className="brand-tagline">Your Gateway to Cinematic Excellence</p>
                <p className="brand-description">
                  Discover, explore, and enjoy the best movies and shows from around the world.
                </p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h5 className="footer-heading">Explore</h5>
              <ul className="footer-links">
                <li><a href="#trending">Trending</a></li>
                <li><a href="#movies">Movies</a></li>
                <li><a href="#series">TV Series</a></li>
                <li><a href="#genres">Genres</a></li>
                <li><a href="#watchlist">My List</a></li>
              </ul>
            </div>
            
            {/* Categories */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h5 className="footer-heading">Categories</h5>
              <ul className="footer-links">
                <li><a href="#action">Action</a></li>
                <li><a href="#drama">Drama</a></li>
                <li><a href="#comedy">Comedy</a></li>
                <li><a href="#thriller">Thriller</a></li>
                <li><a href="#horror">Horror</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h5 className="footer-heading">Support</h5>
              <ul className="footer-links">
                <li><a href="#help">Help Center</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#feedback">Feedback</a></li>
                <li><a href="#report">Report Issue</a></li>
              </ul>
            </div>
            
            {/* Connect */}
            <div className="col-lg-3 col-md-12 mb-4">
              <h5 className="footer-heading">Connect With Us</h5>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  f
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  𝕏
                </a>
              
              </div>
              <div className="newsletter">
                <p className="newsletter-text">Stay updated with latest releases</p>
                <div className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="newsletter-input"
                  />
                  <button className="newsletter-btn">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="copyright">
                  © 2024 Cinaverse. All rights reserved.
                </p>
              </div>
              <div className="col-md-6">
                <div className="footer-bottom-links">
                  <a href="#privacy">Privacy Policy</a>
                  <a href="#terms">Terms of Service</a>
                  <a href="#cookies">Cookie Settings</a>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
