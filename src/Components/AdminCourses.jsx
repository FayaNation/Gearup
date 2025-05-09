<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminCourses.css';

const AdminCourses = () => {
  const [selectedMenu, setSelectedMenu] = useState('upload');

  const [courses, setCourses] = useState([
    { title: 'Engine Basics', department: 'Mechanical' },
    { title: 'Electrical Systems', department: 'Electrical' },
  ]);

  const departments = ['Mechanical', 'Electrical', 'HR', 'Logistics'];

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');

  const [assignDept, setAssignDept] = useState('');
  const [assignCourse, setAssignCourse] = useState('');

  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDept, setEditDept] = useState('');

  const [settingsCourse, setSettingsCourse] = useState('');
const [courseDuration, setCourseDuration] = useState('');
const [prerequisite, setPrerequisite] = useState('');

const [minScore, setMinScore] = useState('');
const [enableFeedback, setEnableFeedback] = useState(false);
const [mandatory, setMandatory] = useState(false);



  // Resource State
  const [resources, setResources] = useState([]);
  const [resourceName, setResourceName] = useState('');
  const [resourceFile, setResourceFile] = useState(null);
  const [resourceCourse, setResourceCourse] = useState('');

  const handleAddCourse = () => {
    if (title && department) {
      setCourses([...courses, { title, department }]);
      setTitle('');
      setDepartment('');
>>>>>>> feature
    }
  };

  const renderPanel = () => {
    switch (selectedMenu) {
<<<<<<< HEAD
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

=======
      case 'upload':
        return (
          <>
            <h2>Upload Training Video</h2>
            <div className="form-section">
              <input
                type="text"
                placeholder="Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <input type="file" />
              <button onClick={handleAddCourse}>Upload</button>
            </div>
          </>
        );

      case 'assign':
        return (
          <>
            <h2>Assign Department to Course</h2>
            <div className="form-section">
              <select
                value={assignCourse}
                onChange={(e) => setAssignCourse(e.target.value)}
              >
                <option value="">Select Course</option>
                {courses.map((c, i) => (
                  <option key={i} value={c.title}>{c.title}</option>
                ))}
              </select>

              <select
                value={assignDept}
                onChange={(e) => setAssignDept(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  if (assignCourse && assignDept) {
                    alert(`${assignCourse} assigned to ${assignDept} department ✅`);
                    setAssignCourse('');
                    setAssignDept('');
                  }
                }}
              >
                Assign
              </button>
            </div>
          </>
        );

      case 'materials':
        return (
          <>
            <h2>Manage Course Materials</h2>
            <div className="course-list">
              {courses.map((course, index) => (
                <div key={index} className="course-card">
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="New Title"
                      />
                      <input
                        type="text"
                        value={editDept}
                        onChange={(e) => setEditDept(e.target.value)}
                        placeholder="New Department"
                      />
                      <button
                        onClick={() => {
                          const updated = [...courses];
                          updated[index] = {
                            title: editTitle,
                            department: editDept,
                          };
                          setCourses(updated);
                          setEditingIndex(null);
                        }}
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingIndex(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <h3>{course.title}</h3>
                      <p><strong>Department:</strong> {course.department}</p>
                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setEditingIndex(index);
                            setEditTitle(course.title);
                            setEditDept(course.department);
                          }}
                          style={{ marginRight: '0.5rem' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            const filtered = courses.filter((_, i) => i !== index);
                            setCourses(filtered);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        );

      case 'resources':
        return (
          <>
            <h2>Add Supporting Resources</h2>
            <div className="form-section">
              <select
                value={resourceCourse}
                onChange={(e) => setResourceCourse(e.target.value)}
              >
                <option value="">Select Course</option>
                {courses.map((c, i) => (
                  <option key={i} value={c.title}>{c.title}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Resource Name"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
              />
              <input
                type="file"
                onChange={(e) => setResourceFile(e.target.files[0])}
              />
              <button
                onClick={() => {
                  if (resourceCourse && resourceName && resourceFile) {
                    const newResource = {
                      courseTitle: resourceCourse,
                      name: resourceName,
                      fileName: resourceFile.name,
                    };
                    setResources([...resources, newResource]);
                    setResourceCourse('');
                    setResourceName('');
                    setResourceFile(null);
                    alert('Resource added ✅');
                  }
                }}
              >
                Upload
              </button>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3>Uploaded Resources</h3>
              {resources.length === 0 ? (
                <p>No resources uploaded yet.</p>
              ) : (
                <ul>
                  {resources.map((res, index) => (
                    <li key={index}>
                      <strong>{res.name}</strong> – {res.fileName} (
                      <em>{res.courseTitle}</em>)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        );

      case 'settings':
  return (
    <>
      <h2>Course Settings</h2>
      <div className="form-section">
        <select
          value={settingsCourse}
          onChange={(e) => setSettingsCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((c, i) => (
            <option key={i} value={c.title}>{c.title}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Duration (e.g. 3 weeks)"
          value={courseDuration}
          onChange={(e) => setCourseDuration(e.target.value)}
        />

        <input
          type="text"
          placeholder="Prerequisite (optional)"
          value={prerequisite}
          onChange={(e) => setPrerequisite(e.target.value)}
        />

        <button
          onClick={() => {
            if (settingsCourse && courseDuration) {
              alert(`Settings updated for ${settingsCourse} ✅`);
              setSettingsCourse('');
              setCourseDuration('');
              setPrerequisite('');
            }
          }}
        >
          Save Settings
        </button>
      </div>
    </>
  );


  case 'completion':
    return (
      <>
        <h2>Completion Rules</h2>
        <div className="form-section" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <label>
            Select Course:
            <select
              value={settingsCourse}
              onChange={(e) => setSettingsCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((c, i) => (
                <option key={i} value={c.title}>{c.title}</option>
              ))}
            </select>
          </label>
  
          <label>
            Minimum Passing Score (%):
            <input
              type="number"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              placeholder="e.g. 70"
            />
          </label>
  
          <label>
            <input
              type="checkbox"
              checked={enableFeedback}
              onChange={() => setEnableFeedback(!enableFeedback)}
            />
            Enable Feedback Collection
          </label>
  
          <label>
            <input
              type="checkbox"
              checked={mandatory}
              onChange={() => setMandatory(!mandatory)}
            />
            Course is Mandatory
          </label>
  
          <button
            disabled={!settingsCourse}
            onClick={() => {
              alert(`Rules saved for "${settingsCourse}" ✅ 
  - Pass: ${minScore}% 
  - Feedback: ${enableFeedback ? 'Yes' : 'No'} 
  - Mandatory: ${mandatory ? 'Yes' : 'No'}`);
              setMinScore('');
              setEnableFeedback(false);
              setMandatory(false);
              setSettingsCourse('');
            }}
            style={{
              opacity: settingsCourse ? 1 : 0.5,
              cursor: settingsCourse ? 'pointer' : 'not-allowed',
            }}
          >
            Save Rules
          </button>
        </div>
      </>
    );
  


>>>>>>> feature
      default:
        return <h2>Select a menu option</h2>;
    }
  };

  return (
    <AdminLayout onMenuSelect={setSelectedMenu} activeMenu={selectedMenu}>
      {renderPanel()}
<<<<<<< HEAD
      {showMessage && (
        <div className={`message-popup ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}
=======
>>>>>>> feature
    </AdminLayout>
  );
};

<<<<<<< HEAD
export default AdminCourses;
=======
export default AdminCourses;
>>>>>>> feature
