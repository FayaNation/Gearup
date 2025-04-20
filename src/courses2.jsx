import React from 'react';

const courses = [
  { title: 'Piston', updated: 'Updated today' },
  { title: 'Spark Plugs', updated: 'Updated yesterday' },
  { title: 'Crankshaft', updated: 'Updated 2 days ago' },
  { title: 'Camshaft', updated: 'Updated yesterday' },
  { title: 'Turbocharger', updated: 'Updated yesterday' },
  { title: 'Oil Filter', updated: 'Updated today' },
];

const Courses = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Training Videos</h2>
      <div style={styles.grid}>
        {courses.map((course, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.thumbnail}></div>
            <h3>{course.title}</h3>
            <p>{course.updated}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#fff',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  thumbnail: {
    width: '100%',
    height: '100px',
    backgroundColor: '#f0f0f0',
    marginBottom: '0.75rem',
    borderRadius: '8px',
  },
};

export default Courses;
