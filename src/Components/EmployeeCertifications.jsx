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

  return (
    <EmployeeLayout>
      <div className="employee-certifications">
        <h2>My Certifications</h2>

        <div className="progress-bar">
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
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeCertifications;
