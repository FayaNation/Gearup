import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminCourses.css';

const AdminCourses = () => {
  const [selectedMenu, setSelectedMenu] = useState('add');

  const [departments, setDepartments] = useState([
    { name: 'Mechanical', courses: ['Engine Basics'] },
    { name: 'Electrical', courses: ['Electrical Systems'] },
  ]);

  const [newDept, setNewDept] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editingCourse, setEditingCourse] = useState({ dept: '', index: null });

  const [resources, setResources] = useState([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceFile, setResourceFile] = useState(null);

  const handleAddDepartmentCourse = () => {
    if (!newDept || !newCourse) return;
    const deptIndex = departments.findIndex((d) => d.name === newDept);
    const updated = [...departments];

    if (deptIndex !== -1) {
      updated[deptIndex].courses.push(newCourse);
    } else {
      updated.push({ name: newDept, courses: [newCourse] });
    }

    setDepartments(updated);
    setNewDept('');
    setNewCourse('');
  };

  const handleEditCourse = () => {
    const updated = departments.map((d) => {
      if (d.name === editingCourse.dept) {
        const newCourses = [...d.courses];
        newCourses[editingCourse.index] = editValue;
        return { ...d, courses: newCourses };
      }
      return d;
    });

    setDepartments(updated);
    setEditingCourse({ dept: '', index: null });
    setEditValue('');
  };

  const handleDeleteCourse = (dept, index) => {
    const updated = departments.map((d) => {
      if (d.name === dept) {
        const newCourses = [...d.courses];
        newCourses.splice(index, 1);
        return { ...d, courses: newCourses };
      }
      return d;
    });

    setDepartments(updated);
  };

  const handleDeleteDepartment = (deptName) => {
    setDepartments(departments.filter((d) => d.name !== deptName));
  };

  const handleUploadVideo = () => {
    if (videoTitle && videoFile) {
      alert(`🎥 Video "${videoTitle}" uploaded ✅`);
      setVideoTitle('');
      setVideoFile(null);
    }
  };

  const handleUploadResource = () => {
    if (resourceTitle && resourceFile) {
      setResources([
        ...resources,
        {
          name: resourceTitle,
          file: resourceFile.name,
        },
      ]);
      setResourceTitle('');
      setResourceFile(null);
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
              {departments.map((d, idx) => (
                <div key={idx} className="dept-card">
                  <div className="dept-header">
                    <h4>{d.name} ({d.courses.length})</h4>
                    <button onClick={() => handleDeleteDepartment(d.name)}>🗑</button>
                  </div>
                  <ul>
                    {d.courses.map((course, i) => (
                      <li key={i}>
                        {editingCourse.dept === d.name && editingCourse.index === i ? (
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
                            {course}
                            <button
                              onClick={() => {
                                setEditingCourse({ dept: d.name, index: i });
                                setEditValue(course);
                              }}
                            >
                              ✏️
                            </button>
                            <button onClick={() => handleDeleteCourse(d.name, i)}>🗑</button>
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

      case 'manage':
        return (
          <div className="courses-panel">
            <h2>Manage Course Materials</h2>
            <p>Edit uploaded videos and resources per course.</p>
            {/* Placeholder for later expansion */}
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
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
                <button onClick={handleUploadVideo}>Upload Video</button>
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
                <button onClick={handleUploadResource}>Upload Resource</button>
              </div>
            </div>

            {resources.length > 0 && (
              <div className="resource-preview">
                <h4>Uploaded Resources</h4>
                <ul>
                  {resources.map((res, i) => (
                    <li key={i}>
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
    </AdminLayout>
  );
};

export default AdminCourses;
