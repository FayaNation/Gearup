import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="left-link">About Us</div>
        <div className="right-buttons">
          <button onClick={() => navigate('/admin-login')}>Admin</button>
          <button onClick={() => navigate('/employee-login')}>Employee</button>
        </div>
      </header>

      <main className="about-section">
        <h1>Welcome to <span>GearUp</span></h1>
        <p>
          At GearUp, we're more than just a company—we're your trusted partner in keeping automotive performance at its peak.<br />
          Whether you're managing a fleet or an individual machine, our digital training and certification tools empower your workforce to stay ahead of the curve.<br />
          Dive into powerful learning, precise diagnostics, and expert-led certification—all in one place.<br />
          <strong>Let’s get your team geared up for success!</strong>
        </p>
      </main>
    </div>
  );
};

export default LandingPage;
