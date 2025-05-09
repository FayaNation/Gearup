// src/components/AdminLayout.jsx
import React from 'react';
import './AdminLayout.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

// Sidebar: Courses (FINAL CLEANED VERSION)
const CoursesSidebar = ({ onMenuSelect }) => (
  <>
    <h3>Departments & Courses</h3>
    <ul>
      <li onClick={() => onMenuSelect('add')}>Add Department & Course</li>
      <li onClick={() => onMenuSelect('manage')}>Manage Department & Course</li>
    </ul>
    <h3>Upload & Resources</h3>
    <ul>
      <li onClick={() => onMenuSelect('upload')}>Upload Training Content</li>
    </ul>
  </>
);


// Sidebar: Assessments
const AssessmentsSidebar = ({ onMenuSelect }) => (
  <>
    <h3>Assessments</h3>
    <ul>
      <li onClick={() => onMenuSelect('create')}>Create Assessment</li>
      <li onClick={() => onMenuSelect('manage')}>Manage Assessments</li>
    </ul>
  </>
);

// Sidebar: Employees (merged Manage/Edit)
const EmployeesSidebar = ({ onMenuSelect }) => (
  <>
    <h3>Employees</h3>
    <ul>
      <li onClick={() => onMenuSelect('add')}>Add Employee</li>
      <li onClick={() => onMenuSelect('manage')}>Manage & Edit Employees</li>
    </ul>
  </>
);

const AdminLayout = ({ children, onMenuSelect }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  // Sidebar logic by current route
  let sidebar = null;
  if (location.pathname.startsWith('/admin/courses')) {
    sidebar = <CoursesSidebar onMenuSelect={onMenuSelect} />;
  } else if (location.pathname.startsWith('/admin/assessments')) {
    sidebar = <AssessmentsSidebar onMenuSelect={onMenuSelect} />;
  } else if (location.pathname.startsWith('/admin/employees')) {
    sidebar = <EmployeesSidebar onMenuSelect={onMenuSelect} />;
  }

  return (
    <div className="admin-layout">
      <header className="admin-navbar">
        <div className="admin-navbar-left">
          <div className="logo">GearUp Admin</div>
        </div>
        <div className="admin-navbar-right">
          <nav className="admin-nav">
            <Link to="/admin/courses">Courses</Link>
            <Link to="/admin/assessments">Assessments</Link>
            <Link to="/admin/employees">Employees</Link>
            <Link to="/admin/reports">Certifications</Link>
          </nav>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <div className="admin-body">
        {sidebar && <aside className="admin-sidebar">{sidebar}</aside>}
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
