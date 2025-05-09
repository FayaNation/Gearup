import React from "react";
import AdminLayout from "./AdminLayout";
import { FaCertificate } from "react-icons/fa";
import "./AdminReports.css";

const data = [
  {
    name: "Alex Morgan",
    course: "Engine Basics",
    status: "Completed",
    image: "/avatars/alex.jpg",
  },
  {
    name: "Jamie Lee",
    course: "Diagnostics",
    status: "In Progress",
    image: "",
  },
  {
    name: "Taylor Ray",
    course: "Auto Electrical",
    status: "Completed",
    image: "/avatars/taylor.jpg",
  },
];

const AdminReports = () => {
  const handleGenerate = (name) => {
    alert(`Certificate generated for ${name}`);
  };

  return (
    <AdminLayout>
      <div className="reports-container">
        <h2>Certifications & Reports</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Course</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((emp, index) => (
              <tr key={index}>
                <td>
                  <div className="emp-info">
                    {emp.image ? (
                      <img src={emp.image} className="avatar" alt={emp.name} />
                    ) : (
                      <div className="avatar initials">
                        {emp.name.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                    {emp.name}
                  </div>
                </td>
                <td>{emp.course}</td>
                <td>
                  <span
                    className={`status-badge ${
                      emp.status === "Completed"
                        ? "status-completed"
                        : "status-inprogress"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td>
                  {emp.status === "Completed" ? (
                    <button
                      className="cert-btn"
                      onClick={() => handleGenerate(emp.name)}
                      title="Generate Certificate"
                    >
                      <FaCertificate className="icon" />
                      Generate
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
