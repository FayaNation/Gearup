import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulate successful login
    navigate('/admin/courses');
  };

  return (
    <div className="admin-login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <input type="text" placeholder="Username" className="login-input" />
        <input type="password" placeholder="Password" className="login-input" />
        <button onClick={handleLogin} className="login-btn">Login</button>
      </div>
    </div>
  );
};

export default AdminLogin;
