import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
  <div style={styles.navLeft}>
    <Link to="/courses">Courses</Link>
    <Link to="#">Assessments</Link>
    <Link to="#">Employees</Link>
    <Link to="#">Certifications</Link>
    <Link to="#">Report</Link>
  </div>
  <div style={styles.profileIcon}>👤</div>
</nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1>Gear Up!</h1>
        <p>Welcome! Let’s Keep Your Vehicles Running Smoothly.</p>
      </section>

      {/* Branding Section */}
      <section style={styles.branding}>
      <img src="/gear.png" alt="GearUp Logo" style={styles.logo} />
        <div>
          <h2>Welcome to GearUp</h2>
          <p>Your Partner in Automotive Solutions.</p>
        </div>
      </section>

      {/* Footer Message */}
      <footer style={styles.footer}>
        <p>Stay informed with our expert advice.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    color: '#333',
    minHeight: '100vh',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  navLeft: {
    display: 'flex',
    gap: '1.5rem',
  },
  profileIcon: {
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  hero: {
    backgroundColor: '#f9e0e9', // soft pink
    color: '#333',
    textAlign: 'center',
    padding: '4rem 1rem 3rem',
  },
  branding: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    padding: '3rem 2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  logo: {
    width: '140px',
    height: 'auto',
    borderRadius: '12px',
    backgroundColor: '#eee',
    animation: 'spin 2s ease-in-out',
  },
  footer: {
    textAlign: 'center',
    paddingBottom: '2rem',
    fontStyle: 'italic',
  },
};

export default Home;
