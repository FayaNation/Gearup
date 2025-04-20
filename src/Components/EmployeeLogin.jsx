import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeLogin.css';

const EmployeeLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/employee/courses');
  };

  return (
    <div className="employee-login-container">
      <div className="login-box">
        <h2>Employee Login</h2>
        <input type="text" placeholder="Username" className="login-input" />
        <input type="password" placeholder="Password" className="login-input" />
        <button onClick={handleLogin} className="login-btn">Login</button>
      </div>
    </div>
  );
};

export default EmployeeLogin;
