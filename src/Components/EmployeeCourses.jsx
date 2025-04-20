import React, { useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import './EmployeeCourses.css';

const videoData = [
  {
    id: 1,
    title: 'Engine Basics',
    department: 'Mechanical',
    description: 'Learn the fundamentals of internal combustion engines.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    resources: [
      { name: 'Engine Manual (PDF)', link: '#' },
      { name: 'Engine Slide Deck', link: '#' },
    ],
  },
  {
    id: 2,
    title: 'Electrical Diagnostics',
    department: 'Electrical',
    description: 'Understand how to diagnose electrical systems.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    resources: [
      { name: 'Wiring Diagrams', link: '#' },
    ],
  },
  {
    id: 3,
    title: 'Hydraulics Overview',
    department: 'Mechanical',
    description: 'Basics of hydraulic systems in automotive engineering.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    resources: [],
  },
];

const departments = ['All', 'Mechanical', 'Electrical'];

const EmployeeCourses = () => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [ratings, setRatings] = useState({});

  const handleRating = (videoId, rating) => {
    setRatings({ ...ratings, [videoId]: rating });
  };

  const filteredVideos =
    selectedDept === 'All'
      ? videoData
      : videoData.filter((vid) => vid.department === selectedDept);

  return (
    <EmployeeLayout>
      <div className="employee-courses">
        <h2>Training Videos</h2>

        <div className="department-filter">
          {departments.map((dept) => (
            <button
              key={dept}
              className={selectedDept === dept ? 'active' : ''}
              onClick={() => setSelectedDept(dept)}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="video-list">
          {filteredVideos.map((video) => (
            <div key={video.id} className="video-card">
              <video controls src={video.videoUrl} />
              <h3>{video.title}</h3>
              <p>{video.description}</p>

              {video.resources && video.resources.length > 0 && (
                <div className="resources">
                  <h4>Resources:</h4>
                  <ul>
                    {video.resources.map((res, i) => (
                      <li key={i}>
                        <a href={res.link} target="_blank" rel="noreferrer">
                          {res.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={ratings[video.id] >= star ? 'star filled' : 'star'}
                    onClick={() => handleRating(video.id, star)}
                  >
                    ★
                  </span>
                ))}
                <span className="rating-value">
                  {ratings[video.id] ? `(${ratings[video.id]}/5)` : '(Unrated)'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeCourses;