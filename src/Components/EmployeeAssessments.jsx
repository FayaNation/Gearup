import React, { useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import './EmployeeAssessments.css';

const sampleAssessment = {
  title: 'Engine Basics Quiz',
  questions: [
    {
      prompt: 'What does the camshaft do?',
      options: ['Controls fuel flow', 'Controls air intake', 'Opens and closes valves', 'Measures temperature'],
      answer: 2,
    },
    {
      prompt: 'Which part ignites the air-fuel mixture?',
      options: ['Alternator', 'Spark Plug', 'Fuel Injector', 'Starter Motor'],
      answer: 1,
    },
  ],
};

const EmployeeAssessments = () => {
  const [activeTab, setActiveTab] = useState('take');
  const [currentAssessment, setCurrentAssessment] = useState(sampleAssessment);
  const [responses, setResponses] = useState([]);
  const [results, setResults] = useState([]);

  const handleOptionChange = (questionIndex, selectedOption) => {
    const updatedResponses = [...responses];
    updatedResponses[questionIndex] = selectedOption;
    setResponses(updatedResponses);
  };

  const handleSubmit = () => {
    const total = currentAssessment.questions.length;
    let score = 0;
    currentAssessment.questions.forEach((q, idx) => {
      if (responses[idx] === q.answer) score++;
    });

    const percent = Math.round((score / total) * 100);
    const passed = percent >= 70;

    setResults([
      ...results,
      {
        title: currentAssessment.title,
        score: percent,
        status: passed ? 'Passed' : 'Failed',
        date: new Date().toLocaleDateString(),
      },
    ]);

    setResponses([]);
    alert(`Assessment Submitted! You scored ${percent}% (${passed ? '✅ Passed' : '❌ Failed'})`);
  };

  return (
    <EmployeeLayout>
      <div className="employee-assessments">
        <div className="assessment-tabs">
          <button
            className={activeTab === 'take' ? 'active' : ''}
            onClick={() => setActiveTab('take')}
          >
            Take Assessment
          </button>
          <button
            className={activeTab === 'results' ? 'active' : ''}
            onClick={() => setActiveTab('results')}
          >
            View Results
          </button>
        </div>

        <div className="assessment-content">
          {activeTab === 'take' && (
            <div className="take-assessment">
              <h2>{currentAssessment.title}</h2>
              {currentAssessment.questions.map((q, idx) => (
                <div key={idx} className="question-block">
                  <p><strong>Q{idx + 1}:</strong> {q.prompt}</p>
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="option-label">
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        checked={responses[idx] === optIdx}
                        onChange={() => handleOptionChange(idx, optIdx)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ))}
              <button className="submit-btn" onClick={handleSubmit}>Submit Assessment</button>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="assessment-results">
              <h2>Assessment Results</h2>
              {results.length === 0 ? (
                <p>No assessments taken yet.</p>
              ) : (
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Assessment</th>
                      <th>Score</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((res, i) => (
                      <tr key={i}>
                        <td>{res.title}</td>
                        <td>{res.score}%</td>
                        <td>{res.status === 'Passed' ? '✅ Passed' : '❌ Failed'}</td>
                        <td>{res.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeAssessments;
