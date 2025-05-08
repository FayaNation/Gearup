// src/components/EmployeeLayout.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './EmployeeLayout.css';
import { FiLogOut } from 'react-icons/fi';

const EmployeeLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Clear employee session if applicable
    navigate('/');
  };

  return (
    <div className="employee-layout">
      <header className="employee-navbar">
        <div className="employee-navbar-left">
          <div className="logo">GearUp Employee</div>
        </div>

        <div className="employee-navbar-right">
          <nav className="employee-nav">
            <Link
              to="/employee/courses"
              className={location.pathname.includes('courses') ? 'active' : ''}
            >
              Courses
            </Link>
            <Link
              to="/employee/assessments"
              className={location.pathname.includes('assessments') ? 'active' : ''}
            >
              Assessments
            </Link>
            <Link
              to="/employee/certifications"
              className={location.pathname.includes('certifications') ? 'active' : ''}
            >
              Certifications
            </Link>
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <main className="employee-content">
        {children}
      </main>
    </div>
  );
};

export default EmployeeLayout;
