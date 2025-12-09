import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../App.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [focusedInput, setFocusedInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration data:', formData);
  };

  return (
    <div className="register-page">
      <Navbar />
      
      <div className="register-container">
        <div className="register-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </div>

        <div className="register-content">
          <div className="register-form-container">
            <div className="register-form-header">
              <h1 className="register-title">Join Cinaverse</h1>
              <p className="register-subtitle">Create your account and start your cinematic journey</p>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className={`input-group ${focusedInput === 'firstName' || formData.firstName ? 'focused' : ''}`}>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('firstName')}
                    onBlur={() => setFocusedInput('')}
                    className="form-input"
                    required
                  />
                  <label className="form-label">First Name</label>
                  <div className="input-line"></div>
                </div>

                <div className={`input-group ${focusedInput === 'lastName' || formData.lastName ? 'focused' : ''}`}>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('lastName')}
                    onBlur={() => setFocusedInput('')}
                    className="form-input"
                    required
                  />
                  <label className="form-label">Last Name</label>
                  <div className="input-line"></div>
                </div>
              </div>

              <div className={`input-group ${focusedInput === 'email' || formData.email ? 'focused' : ''}`}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput('')}
                  className="form-input"
                  required
                />
                <label className="form-label">Email Address</label>
                <div className="input-line"></div>
              </div>

              <div className={`input-group ${focusedInput === 'password' || formData.password ? 'focused' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput('')}
                  className="form-input"
                  required
                />
                <label className="form-label">Password</label>
                <div className="input-line"></div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              <div className={`input-group ${focusedInput === 'confirmPassword' || formData.confirmPassword ? 'focused' : ''}`}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedInput('confirmPassword')}
                  onBlur={() => setFocusedInput('')}
                  className="form-input"
                  required
                />
                <label className="form-label">Confirm Password</label>
                <div className="input-line"></div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              <div className="form-actions">
                <button type="submit" className="register-btn">
                  <span className="btn-text">Create Account</span>
                  <div className="btn-ripple"></div>
                </button>
              </div>

              <div className="form-footer">
                <p className="login-link">
                  Already have an account? 
                  <a href="/login" className="link-animated"> Sign In</a>
                </p>
              </div>
            </form>
          </div>

          <div className="register-info">
            <div className="info-content">
              <h2 className="info-title">Welcome to the Future of Cinema</h2>
              <ul className="features-list">
                <li className="feature-item">
                  <span className="feature-icon">🎬</span>
                  <span className="feature-text">Access thousands of movies and shows</span>
                </li>
                <li className="feature-item">
                  <span className="feature-icon">⭐</span>
                  <span className="feature-text">Personalized recommendations</span>
                </li>
                <li className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span className="feature-text">Watch on any device</span>
                </li>
                <li className="feature-item">
                  <span className="feature-icon">🔥</span>
                  <span className="feature-text">Latest releases and trending content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
