import { useState, useEffect } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { getCourses } from '../utils/databaseUtils';

const CourseList = () => {
  const { isLoading: isFirebaseLoading } = useFirebase();
  const [courses, setCourses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch courses when Firebase is ready
    if (!isFirebaseLoading) {
      const fetchCourses = async () => {
        try {
          setIsLoading(true);
          const coursesData = await getCourses();
          setCourses(coursesData);
        } catch (err) {
          console.error('Error fetching courses:', err);
          setError('Failed to load courses. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchCourses();
    }
  }, [isFirebaseLoading]);

  if (isFirebaseLoading || isLoading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (Object.keys(courses).length === 0) {
    return <div>No courses available.</div>;
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