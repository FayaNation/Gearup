import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './AdminAssessments.css';
import { app } from '../firebase';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';

const AdminAssessments = () => {
  const [activeTab, setActiveTab] = useState('create');

  const [assessmentTitle, setAssessmentTitle] = useState('');
  const [assignedCourse, setAssignedCourse] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [timeLimit, setTimeLimit] = useState(30); // Default 30 minutes
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    prompt: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });

  const [assessments, setAssessments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // Firebase data
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Initialize Firestore
  const db = getFirestore(app);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter courses when department changes
  useEffect(() => {
    if (selectedDepartment) {
      const filtered = courses.filter(course => course.departmentId === selectedDepartment);
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
    setAssignedCourse('');
  }, [selectedDepartment, courses]);

  // Function to fetch all data from Firestore
  const fetchData = async () => {
    try {
      // Fetch departments
      const departmentsSnapshot = await getDocs(collection(db, "departments"));
      const departmentList = departmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setDepartments(departmentList);

      // Fetch courses
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const courseList = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        departmentId: doc.data().departmentId
      }));
      setCourses(courseList);

      // Fetch assessments
      const assessmentsSnapshot = await getDocs(collection(db, "assessments"));
      const assessmentList = assessmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssessments(assessmentList);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error loading data. Please try again.");
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...newQuestion.options];
    updated[index] = value;
    setNewQuestion({ ...newQuestion, options: updated });
  };

  const handleAddQuestion = () => {
    if (
      newQuestion.prompt &&
      newQuestion.options.every((opt) => opt.trim() !== '') &&
      newQuestion.correctAnswer
    ) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion({ prompt: '', options: ['', '', '', ''], correctAnswer: '' });
    } else {
      alert('Complete all fields before adding the question.');
    }
  };

  const handleSaveAssessment = async () => {
    if (!assessmentTitle || questions.length === 0 || !assignedCourse || !selectedDepartment) {
      alert('Title, department, course, and questions are required.');
      return;
    }

    try {
      const assessmentData = {
        title: assessmentTitle,
        departmentId: selectedDepartment,
        departmentName: departments.find(d => d.id === selectedDepartment)?.name || '',
        courseId: assignedCourse,
        courseName: courses.find(c => c.id === assignedCourse)?.name || '',
        questions: questions,
        timeLimit: Number(timeLimit),
        randomizeQuestions: true,
        createdAt: new Date()
      };

      if (editingId) {
        // Update existing assessment
        await updateDoc(doc(db, "assessments", editingId), assessmentData);
        alert('Assessment updated successfully!');
      } else {
        // Add new assessment
        await addDoc(collection(db, "assessments"), assessmentData);
        alert('Assessment saved successfully!');
      }

      // Refresh data
      await fetchData();
      
      // Reset form
      setAssessmentTitle('');
      setSelectedDepartment('');
      setAssignedCourse('');
      setQuestions([]);
      setTimeLimit(30);
      setEditingIndex(null);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert('Error saving assessment. Please try again.');
    }
  };

  const handleEdit = (assessment, index) => {
    setAssessmentTitle(assessment.title);
    setSelectedDepartment(assessment.departmentId);
    setAssignedCourse(assessment.courseId);
    setQuestions(assessment.questions || []);
    setTimeLimit(assessment.timeLimit || 30);
    setEditingIndex(index);
    setEditingId(assessment.id);
    setActiveTab('create');
  };

  const handleDelete = async (assessmentId) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await deleteDoc(doc(db, "assessments", assessmentId));
        await fetchData();
        alert('Assessment deleted successfully!');
      } catch (error) {
        console.error("Error deleting assessment:", error);
        alert('Error deleting assessment. Please try again.');
      }
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'create') {
      return (
        <div className="create-assessment">
          <h2>{editingId !== null ? 'Edit' : 'Create'} Assessment</h2>

          <input
            type="text"
            placeholder="Assessment Title"
            value={assessmentTitle}
            onChange={(e) => setAssessmentTitle(e.target.value)}
          />

          <div className="timer-input">
            <label>Time Limit (minutes):</label>
            <input
              type="number"
              min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          <select
            value={assignedCourse}
            onChange={(e) => setAssignedCourse(e.target.value)}
            disabled={!selectedDepartment}
          >
            <option value="">Select Course</option>
            {filteredCourses.map((course) => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>

          <div className="question-builder">
            <h4>Add a Question</h4>
            <input
              type="text"
              placeholder="Question prompt"
              value={newQuestion.prompt}
              onChange={(e) => setNewQuestion({ ...newQuestion, prompt: e.target.value })}
            />
            {newQuestion.options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
              />
            ))}
            <select
              value={newQuestion.correctAnswer}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })
              }
            >
              <option value="">Select Correct Answer</option>
              {newQuestion.options.map((opt, idx) => (
                opt && <option key={idx} value={opt}>
                  {String.fromCharCode(65 + idx)}: {opt}
                </option>
              ))}
            </select>
            <button onClick={handleAddQuestion}>Add Question</button>
          </div>

          {questions.length > 0 && (
            <div className="preview">
              <h4>Questions Preview</h4>
              <ul>
                {questions.map((q, idx) => (
                  <li key={idx}>
                    <strong>Q{idx + 1}:</strong> {q.prompt} <br />
                    <em>Correct Answer:</em> {q.correctAnswer}
                    <button 
                      className="remove-btn"
                      onClick={() => {
                        const updatedQuestions = [...questions];
                        updatedQuestions.splice(idx, 1);
                        setQuestions(updatedQuestions);
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className="save-btn" onClick={handleSaveAssessment}>
            {editingId !== null ? 'Update' : 'Save'} Assessment
          </button>
        </div>
      );
    }

    if (activeTab === 'manage') {
      return (
        <div className="manage-panel">
          <h2>Manage Assessments</h2>
          {assessments.length > 0 ? (
            assessments.map((a, index) => (
              <div key={a.id || index} className="assessment-card">
                <h4>{a.title}</h4>
                <p>Department: {a.departmentName}</p>
                <p>Course: {a.courseName}</p>
                <p>Questions: {a.questions ? a.questions.length : 0}</p>
                <p>Time Limit: {a.timeLimit || 30} minutes</p>
                <div className="manage-actions">
                  <button onClick={() => handleEdit(a, index)}>Edit</button>
                  <button onClick={() => handleDelete(a.id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No assessments available.</p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <AdminLayout onMenuSelect={setActiveTab} activeMenu={activeTab}>
      <div className="assessments-panel">{renderTabContent()}</div>
    </AdminLayout>
  );
};

export default AdminAssessments;