import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminAssessments.css';

const AdminAssessments = () => {
  const [activeTab, setActiveTab] = useState('create');

  const [assessmentTitle, setAssessmentTitle] = useState('');
  const [assignedCourse, setAssignedCourse] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    prompt: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });

  const [assessments, setAssessments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const courseList = ['Engine Basics', 'Auto Electrical', 'Diagnostics'];

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

  const handleSaveAssessment = () => {
    if (!assessmentTitle || questions.length === 0 || !assignedCourse) {
      alert('Title, course, and questions are required.');
      return;
    }

    const newAssessment = {
      title: assessmentTitle,
      course: assignedCourse,
      questions,
    };

    if (editingIndex !== null) {
      const updated = [...assessments];
      updated[editingIndex] = newAssessment;
      setAssessments(updated);
      setEditingIndex(null);
    } else {
      setAssessments([...assessments, newAssessment]);
    }

    alert('Assessment saved ✅');
    setAssessmentTitle('');
    setAssignedCourse('');
    setQuestions([]);
  };

  const handleEdit = (index) => {
    const a = assessments[index];
    setAssessmentTitle(a.title);
    setAssignedCourse(a.course);
    setQuestions(a.questions);
    setEditingIndex(index);
    setActiveTab('create');
  };

  const handleDelete = (index) => {
    const updated = [...assessments];
    updated.splice(index, 1);
    setAssessments(updated);
  };

  const renderTabContent = () => {
    if (activeTab === 'create') {
      return (
        <div className="create-assessment">
          <h2>{editingIndex !== null ? 'Edit' : 'Create'} Assessment</h2>

          <input
            type="text"
            placeholder="Assessment Title"
            value={assessmentTitle}
            onChange={(e) => setAssessmentTitle(e.target.value)}
          />

          <select
            value={assignedCourse}
            onChange={(e) => setAssignedCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {courseList.map((course, i) => (
              <option key={i} value={course}>{course}</option>
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
                <option key={idx} value={opt}>
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
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className="save-btn" onClick={handleSaveAssessment}>
            {editingIndex !== null ? 'Update' : 'Save'} Assessment
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
              <div key={index} className="assessment-card">
                <h4>{a.title}</h4>
                <p>Course: {a.course}</p>
                <p>Questions: {a.questions.length}</p>
                <div className="manage-actions">
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
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
