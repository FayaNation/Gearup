import { useState, useEffect } from 'react';


const CourseList = () => {
  const { isLoading: isFirebaseLoading, dbInitialized, db } = useFirebase();
  const [courses, setCourses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initializingDb, setInitializingDb] = useState(false);

  useEffect(() => {
    // Only fetch courses when Firebase is ready
    if (!isFirebaseLoading) {
      const fetchCourses = async () => {
        try {
          console.log('Fetching courses...');
          setIsLoading(true);

          // Check if db is available
          if (!db) {
            throw new Error('Firestore database not initialized');
          }

          const coursesData = await getCourses();
          console.log('Courses data:', coursesData);

          // If no courses found and database hasn't been initialized yet, try to initialize it
          if (Object.keys(coursesData).length === 0 && !dbInitialized && !initializingDb) {
            console.log('No courses found. Attempting to initialize database...');
            setInitializingDb(true);

            const result = await initializeDatabase();

            if (result) {
              console.log('Database initialized successfully. Fetching courses again...');
              const newCoursesData = await getCourses();
              setCourses(newCoursesData);
            } else {
              console.warn('Failed to initialize database');
            }

            setInitializingDb(false);
          } else {
            setCourses(coursesData);
          }
        } catch (err) {
          console.error('Error fetching courses:', err);
          setError(`Failed to load courses: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCourses();
    }
  }, [isFirebaseLoading, dbInitialized, db, initializingDb]);

  if (isFirebaseLoading || isLoading) {
    return <div>Loading courses... {initializingDb ? '(Initializing database)' : ''}</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (Object.keys(courses).length === 0) {
    return (
      <div>
        <p>No courses available.</p>
        <button onClick={async () => {
          setIsLoading(true);
          await initializeDatabase();
          window.location.reload();
        }}>Initialize Database</button>
      </div>
    );
  }

  return (
    <div className="course-list">
      <h2>Available Courses</h2>
      <div className="courses-grid">
        {Object.entries(courses).map(([id, course]) => (
          <div key={id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className="course-details">
              <span className="category">{course.category}</span>
              <span className="duration">{course.duration}</span>
              <span className="level">{course.level}</span>
            </div>
            <button className="view-course-btn">View Course</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
