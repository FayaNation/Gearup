import React from "react";
import AdminLayout from "./AdminLayout";
import { FaCertificate } from "react-icons/fa";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
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

const COLORS = ["#00C49F", "#FFBB28"];

const chartData = [
  {
    name: "Completed",
    value: data.filter((d) => d.status === "Completed").length,
  },
  {
    name: "In Progress",
    value: data.filter((d) => d.status === "In Progress").length,
  },
];

const AdminReports = () => {
  const handleGenerate = (name) => {
    alert(`Certificate generated for ${name}`);
  };

  return (
    <AdminLayout>
      <div className="reports-container">
        <h2>Certifications</h2>
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
                        {emp.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
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

        <div className="report-summary">
          <h3>Reports</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
