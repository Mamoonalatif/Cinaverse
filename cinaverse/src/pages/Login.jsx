import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/auth/LoginForm';
import '../App.css';

const Login = () => {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main auth-page">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
