import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './AdminCourses.css';
import { app } from '../firebase';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AdminCourses = () => {
  const [selectedMenu, setSelectedMenu] = useState('add');
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editingCourse, setEditingCourse] = useState({ dept: '', index: null, id: null });

  const [resources, setResources] = useState([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceFile, setResourceFile] = useState(null);
  
  // Upload progress tracking
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Success message
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize Firestore and Storage
  const db = getFirestore(app);
  const storage = getStorage(app);

  // Fetch departments and courses from Firestore on component mount
  useEffect(() => {
    fetchDepartmentsAndCourses();
  }, []);

  // Function to fetch departments and courses from Firestore
  const fetchDepartmentsAndCourses = async () => {
    try {
      const departmentsSnapshot = await getDocs(collection(db, "departments"));
      const deptData = [];

      for (const deptDoc of departmentsSnapshot.docs) {
        const deptInfo = deptDoc.data();
        const coursesSnapshot = await getDocs(
          query(collection(db, "courses"), where("departmentId", "==", deptDoc.id))
        );
        
        const coursesList = coursesSnapshot.docs.map(courseDoc => ({
          id: courseDoc.id,
          name: courseDoc.data().name
        }));

        deptData.push({
          id: deptDoc.id,
          name: deptInfo.name,
          courses: coursesList
        });
      }

      setDepartments(deptData);
    } catch (error) {
      console.error("Error fetching data:", error);
      showMessageToUser("Error loading data", "error");
    }
  };

  // Function to show messages to user
  const showMessageToUser = (msg, type = "success") => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  // Function to add department and course to Firestore
  const handleAddDepartmentCourse = async () => {
    if (!newDept || !newCourse) return;
    
    try {
      // Check if department already exists - case insensitive comparison
      const existingDept = departments.find(
        (d) => d.name.toLowerCase() === newDept.toLowerCase()
      );
      
      let departmentId;
      
      if (!existingDept) {
        // Add new department
        const deptRef = await addDoc(collection(db, "departments"), {
          name: newDept
        });
        departmentId = deptRef.id;
      } else {
        // Use existing department
        departmentId = existingDept.id;
      }
      
      // Add new course
      await addDoc(collection(db, "courses"), {
        name: newCourse,
        departmentId: departmentId
      });
      
      // Refresh the departments and courses
      await fetchDepartmentsAndCourses();
      
      setNewDept('');
      setNewCourse('');
      showMessageToUser("Course added successfully!");
    } catch (error) {
      console.error("Error adding course:", error);
      showMessageToUser("Error adding course", "error");
    }
  };

  // Function to save edited course to Firestore
  const handleEditCourse = async () => {
    try {
      if (editingCourse.id) {
        await updateDoc(doc(db, "courses", editingCourse.id), {
          name: editValue
        });
        
        // Refresh departments and courses
        await fetchDepartmentsAndCourses();
        
        setEditingCourse({ dept: '', index: null, id: null });
        setEditValue('');
        showMessageToUser("Course updated successfully!");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      showMessageToUser("Error updating course", "error");
    }
  };

  // Function to delete course from Firestore
  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteDoc(doc(db, "courses", courseId));
      
      // Refresh departments and courses
      await fetchDepartmentsAndCourses();
      showMessageToUser("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      showMessageToUser("Error deleting course", "error");
    }
  };

  // Function to delete department from Firestore
  const handleDeleteDepartment = async (deptId) => {
    try {
      // First, find all courses in this department
      const coursesSnapshot = await getDocs(
        query(collection(db, "courses"), where("departmentId", "==", deptId))
      );
      
      // Delete all courses in this department
      const courseDeletePromises = coursesSnapshot.docs.map(courseDoc => 
        deleteDoc(doc(db, "courses", courseDoc.id))
      );
      
      await Promise.all(courseDeletePromises);
      
      // Delete the department
      await deleteDoc(doc(db, "departments", deptId));
      
      // Refresh departments and courses
      await fetchDepartmentsAndCourses();
      showMessageToUser("Department deleted successfully!");
    } catch (error) {
      console.error("Error deleting department:", error);
      showMessageToUser("Error deleting department", "error");
    }
  };

  // Function to upload video to Firebase Storage
  const handleUploadVideo = async () => {
    if (!videoTitle || !videoFile) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a storage reference
      const storageRef = ref(storage, `videos/${videoFile.name}`);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, videoFile);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading video:", error);
          setIsUploading(false);
          showMessageToUser("Error uploading video", "error");
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Save video information to Firestore
          await addDoc(collection(db, "videos"), {
            title: videoTitle,
            fileUrl: downloadURL,
            fileName: videoFile.name,
            uploadDate: new Date()
          });
          
          setVideoTitle('');
          setVideoFile(null);
          setIsUploading(false);
          showMessageToUser("Video uploaded successfully!");
        }
      );
    } catch (error) {
      console.error("Error in video upload process:", error);
      setIsUploading(false);
      showMessageToUser("Error uploading video", "error");
    }
  };

  // Function to upload resource to Firebase Storage
  const handleUploadResource = async () => {
    if (!resourceTitle || !resourceFile) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a storage reference
      const storageRef = ref(storage, `resources/${resourceFile.name}`);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, resourceFile);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading resource:", error);
          setIsUploading(false);
          showMessageToUser("Error uploading resource", "error");
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Save resource information to Firestore
          const docRef = await addDoc(collection(db, "resources"), {
            title: resourceTitle,
            fileUrl: downloadURL,
            fileName: resourceFile.name,
            uploadDate: new Date()
          });
          
          // Update local state
          setResources([
            ...resources,
            {
              id: docRef.id,
              name: resourceTitle,
              file: resourceFile.name,
              url: downloadURL
            },
          ]);
          
          setResourceTitle('');
          setResourceFile(null);
          setIsUploading(false);
          showMessageToUser("Resource uploaded successfully!");
        }
      );
    } catch (error) {
      console.error("Error in resource upload process:", error);
      setIsUploading(false);
      showMessageToUser("Error uploading resource", "error");
    }
  };

  const renderPanel = () => {
    switch (selectedMenu) {
      case 'add':
        return (
          <div className="courses-panel">
            <h2>Add Department & Course</h2>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Department"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
              />
              <input
                type="text"
                placeholder="Course Title"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
              />
              <button onClick={handleAddDepartmentCourse}>Add</button>
            </div>

            <div className="department-list">
              {departments.map((d) => (
                <div key={d.id} className="dept-card">
                  <div className="dept-header">
                    <h4>{d.name} ({d.courses.length})</h4>
                    <button onClick={() => handleDeleteDepartment(d.id)}>🗑</button>
                  </div>
                  <ul>
                    {d.courses.map((course, i) => (
                      <li key={course.id}>
                        {editingCourse.dept === d.id && editingCourse.index === i ? (
                          <>
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                            />
                            <button onClick={handleEditCourse}>Save</button>
                          </>
                        ) : (
                          <>
                            {course.name}
                            <button
                              onClick={() => {
                                setEditingCourse({ dept: d.id, index: i, id: course.id });
                                setEditValue(course.name);
                              }}
                            >
                              ✏️
                            </button>
                            <button onClick={() => handleDeleteCourse(course.id)}>🗑</button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'upload':
        return (
          <div className="courses-panel">
            <h2>Upload Training Content</h2>
            <div className="upload-section">
              <div className="upload-box">
                <h4>Upload Video</h4>
                <input
                  type="text"
                  placeholder="Video Title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                />
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
                <button onClick={handleUploadVideo} disabled={isUploading}>Upload Video</button>
                {isUploading && (
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                )}
              </div>

              <div className="upload-box">
                <h4>Upload Resource</h4>
                <input
                  type="text"
                  placeholder="Resource Title"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                />
                <input
                  type="file"
                  onChange={(e) => setResourceFile(e.target.files[0])}
                />
                <button onClick={handleUploadResource} disabled={isUploading}>Upload Resource</button>
                {isUploading && (
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                )}
              </div>
            </div>

            {resources.length > 0 && (
              <div className="resource-preview">
                <h4>Uploaded Resources</h4>
                <ul>
                  {resources.map((res) => (
                    <li key={res.id}>
                      📄 <strong>{res.name}</strong> — {res.file}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return <h2>Select a menu option</h2>;
    }
  };

  return (
    <AdminLayout onMenuSelect={setSelectedMenu} activeMenu={selectedMenu}>
      {renderPanel()}
      {showMessage && (
        <div className={`message-popup ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCourses;