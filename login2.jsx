import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState(null); // null, 'admin', or 'employee'
  const navigate = useNavigate();

  const handleLogin = () => {
    if (role === 'admin') {
      navigate('/admin/courses');
    } else if (role === 'employee') {
      navigate('/employee/courses');
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.left}>About Us</div>
        <div style={styles.right}>
          <button style={styles.roleButton} onClick={() => setRole('admin')}>Admin</button>
          <button style={styles.roleButton} onClick={() => setRole('employee')}>Employee</button>
        </div>
      </div>

      {/* Login box */}
      {role && (
        <div style={styles.loginBox}>
          <h2 style={styles.heading}>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
          <input type="text" placeholder="Username" style={styles.input} />
          <input type="password" placeholder="Password" style={styles.input} />
          <button onClick={handleLogin} style={styles.loginButton}>Login</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    height: '100vh',
    backgroundColor: '#F2E1FD',
    fontFamily: 'Arial, sans-serif',
  },
  topBar: {
    backgroundColor: '#2E2D2D',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    fontWeight: 'bold',
    color: '#F2E1FD',
  },
  right: {
    display: 'flex',
    gap: '1rem',
  },
  roleButton: {
    backgroundColor: '#CE4DDB',
    border: 'none',
    padding: '0.5rem 1rem',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  loginBox: {
    marginTop: '5rem',
    backgroundColor: '#fff',
    width: '320px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#CE4DDB',
    marginBottom: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  loginButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#CE4DDB',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Login;
