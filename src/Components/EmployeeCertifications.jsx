<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import './EmployeeCertifications.css';

const EmployeeCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const q = query(collection(db, 'certifications'), where('employeeId', '==', 'employee1'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCertifications(data);
      } catch (err) {
        console.error('Error fetching certs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCerts();
  }, []);

  const progress = certifications.length;
=======
import React, { useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import './EmployeeCertifications.css';

const completedModules = [
  {
    id: 1,
    title: 'Engine Basics',
    date: '2025-04-16',
    status: 'Completed',
    certificateLink: '#',
  },
  {
    id: 2,
    title: 'Auto Electrical',
    date: '2025-04-14',
    status: 'Completed',
    certificateLink: '#',
  },
  {
    id: 3,
    title: 'Hydraulics Overview',
    date: null,
    status: 'In Progress',
    certificateLink: null,
  },
];

const EmployeeCertifications = () => {
  const totalModules = completedModules.length;
  const completedCount = completedModules.filter(m => m.status === 'Completed').length;
  const progress = Math.round((completedCount / totalModules) * 100);
>>>>>>> feature

  return (
    <EmployeeLayout>
      <div className="employee-certifications">
        <h2>My Certifications</h2>

        <div className="progress-bar">
<<<<<<< HEAD
          <div className="progress-fill" style={{ width: `${progress * 10}%` }}></div>
        </div>
        <p>{certifications.length} certificates earned</p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr><th>Title</th><th>Date</th><th>Link</th></tr>
            </thead>
            <tbody>
              {certifications.map(cert => (
                <tr key={cert.id}>
                  <td>{cert.title}</td>
                  <td>{new Date(cert.issuedDate).toLocaleDateString()}</td>
                  <td>{cert.certificateLink ? (
                    <a href={cert.certificateLink} target="_blank" rel="noreferrer">View</a>
                  ) : 'Unavailable'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
=======
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">{completedCount} of {totalModules} modules completed ({progress}%)</p>

        <table className="cert-table">
          <thead>
            <tr>
              <th>Training Module</th>
              <th>Status</th>
              <th>Date</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {completedModules.map((mod) => (
              <tr key={mod.id}>
                <td>{mod.title}</td>
                <td>{mod.status}</td>
                <td>{mod.date ? mod.date : '-'}</td>
                <td>
                  {mod.status === 'Completed' ? (
                    <a href={mod.certificateLink} target="_blank" rel="noreferrer">
                      View Certificate
                    </a>
                  ) : (
                    'Not available'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
>>>>>>> feature
      </div>
    </EmployeeLayout>
  );
};

<<<<<<< HEAD
export default EmployeeCertifications;
=======
export default EmployeeCertifications;
>>>>>>> feature
