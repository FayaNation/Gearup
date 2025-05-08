import React, { useState, useEffect } from 'react';
import EmployeeLayout from './EmployeeLayout';
import './EmployeeAssessments.css';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

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
  };

  return (
    <EmployeeLayout>
      <div className="employee-assessments">
        <div className="assessment-tabs">
          <button className={activeTab === 'take' ? 'active' : ''} onClick={() => setActiveTab('take')}>Take Assessment</button>
          <button className={activeTab === 'results' ? 'active' : ''} onClick={() => setActiveTab('results')}>View Results</button>
        </div>

        <div className="assessment-content">
          {activeTab === 'take' && (
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
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <h3>Previous Results</h3>
              {results.length === 0 ? <p>No results yet.</p> : (
                <table>
                  <thead>
                    <tr><th>Assessment</th><th>Score</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {results.map((res, i) => (
                      <tr key={i}>
                        <td>{res.title}</td>
                        <td>{res.score}%</td>
                        <td>{res.status}</td>
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