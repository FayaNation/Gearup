import React, { useState, useEffect } from 'react';
import EmployeeLayout from './EmployeeLayout';
import './EmployeeCourses.css';
import { app } from '../firebase';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, query, where, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const EmployeeCourses = () => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [departments, setDepartments] = useState(['All']);
  const [videos, setVideos] = useState([]);
  const [resources, setResources] = useState([]);
  const [ratings, setRatings] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize Firestore and Auth
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Get current user ID and fetch data on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setCurrentUserId(user.uid);
        }
      } catch (error) {
        console.error("Error getting current user:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDepartments(),
          fetchVideos(),
          fetchResources(),
          fetchUserRatings(),
          getCurrentUser()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Function to fetch departments from Firestore
  const fetchDepartments = async () => {
    try {
      const departmentsSnapshot = await getDocs(collection(db, "departments"));
      const departmentList = ['All'];
      departmentsSnapshot.docs.forEach(doc => {
        const deptData = doc.data();
        departmentList.push(deptData.name);
      });
      setDepartments(departmentList);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Function to fetch videos from Firestore
  const fetchVideos = async () => {
    try {
      const videosSnapshot = await getDocs(collection(db, "videos"));
      const videosList = [];
      
      for (const videoDoc of videosSnapshot.docs) {
        const videoData = videoDoc.data();
        let department = "Uncategorized";
        
        // If video has a departmentId, fetch department name
        if (videoData.departmentId) {
          try {
            const departmentDoc = await getDoc(doc(db, "departments", videoData.departmentId));
            if (departmentDoc.exists()) {
              department = departmentDoc.data().name;
            }
          } catch (error) {
            console.error("Error fetching department for video:", error);
          }
        }
        
        videosList.push({
          id: videoDoc.id,
          title: videoData.title,
          department: department,
          description: videoData.description || "",
          videoUrl: videoData.fileUrl,
          fileName: videoData.fileName,
          uploadDate: videoData.uploadDate ? new Date(videoData.uploadDate.seconds * 1000).toLocaleDateString() : "",
        });
      }
      
      setVideos(videosList);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  // Function to fetch resources from Firestore
  const fetchResources = async () => {
    try {
      const resourcesSnapshot = await getDocs(collection(db, "resources"));
      const resourcesList = resourcesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResources(resourcesList);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  // Function to fetch user ratings from Firestore
  const fetchUserRatings = async () => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const ratingsSnapshot = await getDocs(
          query(collection(db, "ratings"), where("userId", "==", userId))
        );
        
        const userRatings = {};
        ratingsSnapshot.docs.forEach(doc => {
          const ratingData = doc.data();
          userRatings[ratingData.videoId] = {
            value: ratingData.rating,
            ratingId: doc.id
          };
        });
        
        setRatings(userRatings);
        setCurrentUserId(userId);
      }
    } catch (error) {
      console.error("Error fetching user ratings:", error);
    }
  };

  // Function to handle rating a video
  const handleRating = async (videoId, rating) => {
    try {
      if (!currentUserId) {
        console.error("No user is logged in");
        return;
      }
      
      // Check if user has already rated this video
      if (ratings[videoId] && ratings[videoId].ratingId) {
        // Update existing rating
        await updateDoc(doc(db, "ratings", ratings[videoId].ratingId), {
          rating: rating
        });
      } else {
        // Add new rating
        const docRef = await addDoc(collection(db, "ratings"), {
          userId: currentUserId,
          videoId: videoId,
          rating: rating,
          timestamp: new Date()
        });
        
        // Update local state
        setRatings({
          ...ratings,
          [videoId]: { value: rating, ratingId: docRef.id }
        });
      }
      
      // Update local state
      setRatings({
        ...ratings,
        [videoId]: {
          ...ratings[videoId],
          value: rating
        }
      });
      
    } catch (error) {
      console.error("Error saving rating:", error);
    }
  };

  // Function to get resources for a video
  const getResourcesForVideo = (videoId) => {
    // Filter resources by department (assuming resources have a departmentId property)
    // In a real app, you might want to structure this differently
    const videoResources = resources.filter(resource => {
      const video = videos.find(v => v.id === videoId);
      return video && resource.departmentId === video.departmentId;
    });
    
    return videoResources;
  };

  // Filter videos based on selected department
  const filteredVideos =
    selectedDept === 'All'
      ? videos
      : videos.filter((vid) => vid.department === selectedDept);

  return (
    <EmployeeLayout>
      <div className="employee-courses">
        <h2>Training Videos</h2>

        {loading ? (
          <div className="loading">Loading videos...</div>
        ) : (
          <>
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
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <div key={video.id} className="video-card">
                    <video 
                      controls 
                      src={video.videoUrl}
                      poster="/video-poster.jpg"  // Optional: add a default poster
                    />
                    <h3>{video.title}</h3>
                    <p className="video-department">Department: {video.department}</p>
                    {video.description && <p>{video.description}</p>}
                    
                    {/* Video resources */}
                    {resources.length > 0 && (
                      <div className="resources">
                        <h4>Resources:</h4>
                        <ul>
                          {resources.map((res) => (
                            <li key={res.id}>
                              <a 
                                href={res.fileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                download={res.fileName}
                              >
                                {res.title || res.fileName}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Rating system */}
                    <div className="rating">
                      <p>Rate this video:</p>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            ratings[video.id] && ratings[video.id].value >= star 
                              ? 'star filled' 
                              : 'star'
                          }
                          onClick={() => handleRating(video.id, star)}
                        >
                          ★
                        </span>
                      ))}
                      <span className="rating-value">
                        {ratings[video.id] 
                          ? `(${ratings[video.id].value}/5)` 
                          : '(Unrated)'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-videos">
                  No videos available for this department.
                </p>
              )}
            </div>
          </>
        )}
      </div>
      
      <style jsx>{`
        .employee-courses {
          padding: 20px;
        }
        
        .department-filter {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .department-filter button {
          padding: 8px 15px;
          border-radius: 20px;
          border: none;
          background-color: #f0f0f0;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .department-filter button.active {
          background-color: #9c27b0;
          color: white;
        }
        
        .video-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .video-card {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          background-color: white;
        }
        
        .video-card video {
          width: 100%;
          height: auto;
        }
        
        .video-card h3 {
          padding: 10px 15px;
          margin: 0;
        }
        
        .video-card p {
          padding: 0 15px 10px;
          margin: 0;
          color: #555;
        }
        
        .video-department {
          font-size: 0.9rem;
          color: #666;
        }
        
        .resources {
          padding: 0 15px 10px;
        }
        
        .resources h4 {
          margin: 10px 0 5px;
        }
        
        .resources ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .rating {
          padding: 10px 15px;
          display: flex;
          align-items: center;
          background-color: #f9f9f9;
        }
        
        .rating p {
          margin: 0;
          padding: 0;
          margin-right: 10px;
        }
        
        .star {
          cursor: pointer;
          font-size: 24px;
          color: #ddd;
          margin-right: 2px;
        }
        
        .star.filled {
          color: #ffc107;
        }
        
        .rating-value {
          margin-left: 8px;
          font-size: 14px;
          color: #666;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: #666;
        }
        
        .no-videos {
          text-align: center;
          grid-column: 1 / -1;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </EmployeeLayout>
  );
};

export default EmployeeCourses;