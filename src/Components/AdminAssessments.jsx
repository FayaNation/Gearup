import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminAssessments.css';

const AdminAssessments = () => {
  const [activeTab, setActiveTab] = useState('create');

  // Create tab state
  const [assessmentTitle, setAssessmentTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    prompt: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });

  // Create tab - Settings inputs
  const [passScore, setPassScore] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [shuffle, setShuffle] = useState(false);
  const [allowRetry, setAllowRetry] = useState(false);

  // Assign tab state
  const [assignAssessment, setAssignAssessment] = useState('');
  const [assignCourse, setAssignCourse] = useState('');

  // Dummy data for courses
  const courseList = ['Engine Basics', 'Auto Electrical', 'Diagnostics'];

  // Saved assessments
  const assessmentList = questions.length > 0 ? [assessmentTitle] : [];

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleAddQuestion = () => {
    if (
      newQuestion.prompt &&
      newQuestion.options.every((opt) => opt.trim() !== '') &&
      newQuestion.correctAnswer
    ) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion({
        prompt: '',
        options: ['', '', '', ''],
        correctAnswer: '',
      });
    } else {
      alert('Please complete all fields before adding the question.');
    }
  };

  const handleSaveAssessment = () => {
    if (!assessmentTitle || questions.length === 0) {
      alert('Assessment title and at least one question are required.');
      return;
    }

    console.log('Assessment Saved:', {
      title: assessmentTitle,
      questions,
      settings: {
        passScore,
        timeLimit,
        shuffle,
        allowRetry,
      },
    });

    alert(`Assessment saved ✅\nPass Score: ${passScore}%\nTime Limit: ${timeLimit} min\nShuffle: ${shuffle ? 'Yes' : 'No'}\nRetry: ${allowRetry ? 'Yes' : 'No'}`);

    setAssessmentTitle('');
    setQuestions([]);
    setPassScore('');
    setTimeLimit('');
    setShuffle(false);
    setAllowRetry(false);
  };

  const handleAssign = () => {
    if (assignAssessment && assignCourse) {
      alert(`✅ "${assignAssessment}" has been assigned to "${assignCourse}"`);
      setAssignAssessment('');
      setAssignCourse('');
    } else {
      alert('Please select both an assessment and a course.');
    }
  };

  const handleDeleteAssessment = () => {
    setAssessmentTitle('');
    setQuestions([]);
    alert('Assessment deleted 🗑️');
  };

  const renderTabContent = () => {
    if (activeTab === 'create') {
      return (
        <div className="create-assessment">
          <h2>Create New Assessment</h2>

          <input
            type="text"
            placeholder="Assessment Title"
            value={assessmentTitle}
            onChange={(e) => setAssessmentTitle(e.target.value)}
          />

          <div className="question-builder">
            <h4>Add a Question</h4>
            <input
              type="text"
              placeholder="Question prompt"
              value={newQuestion.prompt}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, prompt: e.target.value })
              }
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
                setNewQuestion({
                  ...newQuestion,
                  correctAnswer: e.target.value,
                })
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

          <div className="assessment-settings">
            <h4>Settings</h4>
            <label>
              Minimum Pass Score (%):
              <input
                type="number"
                value={passScore}
                onChange={(e) => setPassScore(e.target.value)}
                placeholder="e.g. 70"
              />
            </label>

            <label>
              Time Limit (minutes):
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="e.g. 30"
              />
            </label>

            <label>
              <input
                type="checkbox"
                checked={shuffle}
                onChange={() => setShuffle(!shuffle)}
              />
              Shuffle Questions
            </label>

            <label>
              <input
                type="checkbox"
                checked={allowRetry}
                onChange={() => setAllowRetry(!allowRetry)}
              />
              Allow Retry
            </label>
          </div>

          {questions.length > 0 && (
            <div className="preview">
              <h4>Questions Added</h4>
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

          <button onClick={handleSaveAssessment} className="save-btn">
            Save Assessment
          </button>
        </div>
      );
    }

    if (activeTab === 'assign') {
      return (
        <div className="assign-panel">
          <h2>Assign Assessment to Course</h2>

          <select
            value={assignAssessment}
            onChange={(e) => setAssignAssessment(e.target.value)}
          >
            <option value="">Select Assessment</option>
            {assessmentList.map((a, i) => (
              <option key={i} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select
            value={assignCourse}
            onChange={(e) => setAssignCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {courseList.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button onClick={handleAssign}>Assign</button>
        </div>
      );
    }

    if (activeTab === 'manage') {
      return (
        <div className="manage-panel">
          <h2>Manage Assessments</h2>

          {assessmentTitle && questions.length > 0 ? (
            <div className="assessment-card">
              <h4>{assessmentTitle}</h4>
              <p>Questions: {questions.length}</p>
              <button
                onClick={() =>
                  alert(
                    questions
                      .map((q, idx) => `Q${idx + 1}: ${q.prompt}`)
                      .join('\n\n')
                  )
                }
              >
                View Questions
              </button>
              <button onClick={handleDeleteAssessment}>Delete</button>
            </div>
          ) : (
            <p>No assessments created yet.</p>
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
