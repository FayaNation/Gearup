import React, { useEffect, useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import './EmployeeCertifications.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

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

  return (
    <EmployeeLayout>
      <div className="employee-certifications">
        <h2>My Certifications</h2>

        <div className="progress-bar">
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
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeCertifications;