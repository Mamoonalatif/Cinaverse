import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/auth/RegisterForm';
import '../App.css';

const Register = () => {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main auth-page">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
};

export default Register;
