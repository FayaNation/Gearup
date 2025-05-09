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
    }
  };

  const renderPanel = () => {
    switch (selectedMenu) {
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
