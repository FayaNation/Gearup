import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { FaCertificate } from "react-icons/fa";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import "./AdminReports.css";
import { app } from '../firebase';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import jsPDF from 'jspdf';

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

const AdminReports = () => {
  const [employees, setEmployees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // Initialize Firestore
  const db = getFirestore(app);

  // Fetch data from Firebase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchEmployees();
        await fetchCourses();
        await fetchDepartments();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        showMessageToUser("Error loading data", "error");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to fetch employees from Firestore
  const fetchEmployees = async () => {
    try {
      const employeesSnapshot = await getDocs(collection(db, "employees"));
      const employeeList = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        status: doc.data().status || "Not Started" // Default status if not present
      }));
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  };

  // Function to fetch courses from Firestore
  const fetchCourses = async () => {
    try {
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const courseList = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(courseList);
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  };

  // Function to fetch departments from Firestore
  const fetchDepartments = async () => {
    try {
      const departmentsSnapshot = await getDocs(collection(db, "departments"));
      const departmentList = departmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDepartments(departmentList);
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  };

  // Function to show messages to user
  const showMessageToUser = (msg, type = "success") => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  // Function to update employee status
  const handleUpdateStatus = async (employeeId, newStatus) => {
    try {
      await updateDoc(doc(db, "employees", employeeId), {
        status: newStatus
      });
      
      // Refresh employee list
      await fetchEmployees();
      
      showMessageToUser(`Status updated to ${newStatus}`);
      setShowDialog(false);
    } catch (error) {
      console.error("Error updating status:", error);
      showMessageToUser("Error updating status", "error");
    }
  };

  // Function to generate certificate PDF
  const handleGenerate = async (employee) => {
    try {
      // Find employee's course 
      const employeeCourse = courses.find(c => c.id === employee.courseId)?.name || "Training Course";
      
      // Create new PDF document
      const pdf = new jsPDF();
      
      // Add certificate content
      pdf.setFontSize(30);
      pdf.setTextColor(0, 0, 128);
      pdf.text("Certificate of Completion", 105, 30, { align: "center" });
      
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("This certifies that", 105, 60, { align: "center" });
      
      pdf.setFontSize(24);
      pdf.setTextColor(0, 0, 0);
      pdf.text(employee.name, 105, 80, { align: "center" });
      
      pdf.setFontSize(16);
      pdf.text("has successfully completed the course", 105, 100, { align: "center" });
      
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 128);
      pdf.text(employeeCourse, 105, 120, { align: "center" });
      
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      const today = new Date();
      pdf.text(`Date: ${today.toLocaleDateString()}`, 105, 150, { align: "center" });
      
      pdf.setFontSize(12);
      pdf.text("GearUp Training Program", 105, 170, { align: "center" });
      
      // Save the PDF
      pdf.save(`${employee.name.replace(/\s+/g, '_')}_certificate.pdf`);
      
      showMessageToUser(`Certificate generated for ${employee.name}`);
    } catch (error) {
      console.error("Error generating certificate:", error);
      showMessageToUser("Error generating certificate", "error");
    }
  };

  // Open dialog to update employee status
  const openStatusDialog = (employee) => {
    setSelectedEmployee(employee);
    setShowDialog(true);
  };

  // Prepare chart data
  const statusChartData = [
    {
      name: "Completed",
      value: employees.filter((e) => e.status === "Completed").length,
    },
    {
      name: "In Progress",
      value: employees.filter((e) => e.status === "In Progress").length,
    },
    {
      name: "Not Started",
      value: employees.filter((e) => e.status === "Not Started").length,
    },
  ];

  // Department distribution chart
  const getDepartmentChartData = () => {
    const deptCounts = {};
    
    employees.forEach(emp => {
      if (!deptCounts[emp.department]) {
        deptCounts[emp.department] = 0;
      }
      deptCounts[emp.department]++;
    });
    
    return Object.keys(deptCounts).map(dept => ({
      name: dept,
      value: deptCounts[dept]
    }));
  };

  return (
    <AdminLayout>
      <div className="reports-container">
        <h2>Certifications</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="emp-info">
                        <div className="avatar initials">
                          {emp.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        {emp.name}
                      </div>
                    </td>
                    <td>{emp.department}</td>
                    <td>{courses.find(c => c.id === emp.courseId)?.name || "Not Assigned"}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          emp.status === "Completed"
                            ? "status-completed"
                            : emp.status === "In Progress"
                            ? "status-inprogress"
                            : "status-notstarted"
                        }`}
                        onClick={() => openStatusDialog(emp)}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      {emp.status === "Completed" ? (
                        <button
                          className="cert-btn"
                          onClick={() => handleGenerate(emp)}
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

            <div className="reports-dashboard">
              <h3>Training Progress Dashboard</h3>
              
              <div className="reports-grid">
                <div className="report-card">
                  <h4>Course Completion Status</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="report-card">
                  <h4>Department Distribution</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={getDepartmentChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="report-summary">
                <div className="summary-card">
                  <h5>Total Employees</h5>
                  <div className="summary-value">{employees.length}</div>
                </div>
                <div className="summary-card">
                  <h5>Departments</h5>
                  <div className="summary-value">{departments.length}</div>
                </div>
                <div className="summary-card">
                  <h5>Courses</h5>
                  <div className="summary-value">{courses.length}</div>
                </div>
                <div className="summary-card">
                  <h5>Completions</h5>
                  <div className="summary-value">
                    {employees.filter(e => e.status === "Completed").length}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Status Update Dialog */}
        {showDialog && (
          <div className="dialog-overlay">
            <div className="dialog">
              <h3>Update Status</h3>
              <p>Update status for {selectedEmployee?.name}</p>
              <div className="dialog-buttons">
                <button onClick={() => handleUpdateStatus(selectedEmployee.id, "Not Started")}>
                  Not Started
                </button>
                <button onClick={() => handleUpdateStatus(selectedEmployee.id, "In Progress")}>
                  In Progress
                </button>
                <button onClick={() => handleUpdateStatus(selectedEmployee.id, "Completed")}>
                  Completed
                </button>
                <button className="cancel-btn" onClick={() => setShowDialog(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message Popup */}
        {showMessage && (
          <div className={`message-popup ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;