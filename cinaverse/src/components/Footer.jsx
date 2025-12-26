import React from 'react';

export default function Footer() {
  return (
    <footer className="simple-footer" style={{ background: '#000', color: '#fff', padding: '2rem 0 1rem 0', marginTop: '0', borderTop: '2px solid #ff0000' }}>
      <div className="container text-center">
        <h4 style={{ color: '#ff0000', fontWeight: 'bold', marginBottom: 8 }}>Cinaverse</h4>
        <div style={{ marginBottom: 12 }}>Your Gateway to Cinematic Excellence</div>
        <div style={{ marginBottom: 16 }}>
          <a href="#privacy" style={{ color: '#ff0000', margin: '0 1rem', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#terms" style={{ color: '#ff0000', margin: '0 1rem', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#cookies" style={{ color: '#ff0000', margin: '0 1rem', textDecoration: 'none' }}>Cookie Settings</a>
        </div>
        <div style={{ color: '#fff', fontSize: 14, opacity: 0.7 }}>
          © 2024 Cinaverse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
