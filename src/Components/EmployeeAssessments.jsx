<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import EmployeeLayout from './EmployeeLayout';
import './EmployeeAssessments.css';


const EmployeeAssessments = () => {
  const [activeTab, setActiveTab] = useState('take');
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [responses, setResponses] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [certificateMessage, setCertificateMessage] = useState('');

  const getRandomQuestions = (questions, count = 5) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'assessments'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAssessments(data);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleAssessmentChange = (e) => {
    const selectedId = e.target.value;
    setSelectedAssessmentId(selectedId);
    const selected = assessments.find(a => a.id === selectedId);
    const randomQs = getRandomQuestions(selected.questions, 5);
    setCurrentAssessment({ title: selected.title, questions: randomQs });
    setResponses([]);
    setSubmitted(false);
    setCertificateMessage('');
  };

  const handleOptionChange = (index, value) => {
    const updated = [...responses];
    updated[index] = value;
    setResponses(updated);
  };

  const handleSubmit = async () => {
    const total = currentAssessment.questions.length;
    const correct = currentAssessment.questions.reduce(
      (acc, q, i) => acc + (responses[i] === q.correctAnswer ? 1 : 0),
      0
    );
    const percent = Math.round((correct / total) * 100);
    const passed = percent >= 70;
    const now = new Date().toISOString();

    const resultEntry = {
      title: currentAssessment.title,
      score: percent,
      status: passed ? 'Passed' : 'Failed',
      date: new Date().toLocaleDateString(),
    };

    setResults([...results, resultEntry]);
    setSubmitted(true);

    try {
      await addDoc(collection(db, 'assessmentResults'), {
        ...resultEntry,
        employeeId: 'employee1',
        assessmentId: selectedAssessmentId,
        createdAt: serverTimestamp(),
      });

      if (passed) {
        setCertificateMessage(`Congratulations! You passed and earned a certificate for "${currentAssessment.title}".`);
        await addDoc(collection(db, 'certifications'), {
          title: `${currentAssessment.title} Certificate`,
          employeeId: 'employee1',
          assessmentId: selectedAssessmentId,
          issuedDate: now,
          certificateLink: '', // can be updated later
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Error saving result/certificate:', err);
    }

    setResponses([]);
=======
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
>>>>>>> feature
  };

  return (
    <EmployeeLayout>
      <div className="employee-assessments">
        <div className="assessment-tabs">
<<<<<<< HEAD
          <button className={activeTab === 'take' ? 'active' : ''} onClick={() => setActiveTab('take')}>Take Assessment</button>
          <button className={activeTab === 'results' ? 'active' : ''} onClick={() => setActiveTab('results')}>View Results</button>
=======
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
>>>>>>> feature
        </div>

        <div className="assessment-content">
          {activeTab === 'take' && (
<<<<<<< HEAD
            <div>
              <h3>Select an Assessment</h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <select value={selectedAssessmentId} onChange={handleAssessmentChange}>
                  <option value="">-- Choose --</option>
                  {assessments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              )}

              {currentAssessment && (
                <>
                  <h4>{currentAssessment.title}</h4>
                  {currentAssessment.questions.map((q, i) => (
                    <div key={i}>
                      <p><strong>Q{i + 1}:</strong> {q.question}</p>
                      {q.options.map((opt, idx) => (
                        <label key={idx}>
                          <input
                            type="radio"
                            name={`q${i}`}
                            checked={responses[i] === idx}
                            onChange={() => handleOptionChange(i, idx)}
                          /> {opt}
                        </label>
                      ))}
                    </div>
                  ))}
                  <button onClick={handleSubmit}>Submit Assessment</button>
                  {submitted && certificateMessage && <p>{certificateMessage}</p>}
                </>
              )}
=======
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
>>>>>>> feature
            </div>
          )}

          {activeTab === 'results' && (
<<<<<<< HEAD
            <div>
              <h3>Previous Results</h3>
              {results.length === 0 ? <p>No results yet.</p> : (
                <table>
                  <thead>
                    <tr><th>Assessment</th><th>Score</th><th>Status</th><th>Date</th></tr>
=======
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
>>>>>>> feature
                  </thead>
                  <tbody>
                    {results.map((res, i) => (
                      <tr key={i}>
                        <td>{res.title}</td>
                        <td>{res.score}%</td>
<<<<<<< HEAD
                        <td>{res.status}</td>
=======
                        <td>{res.status === 'Passed' ? '✅ Passed' : '❌ Failed'}</td>
>>>>>>> feature
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

<<<<<<< HEAD
export default EmployeeAssessments;
=======
export default EmployeeAssessments;
>>>>>>> feature
