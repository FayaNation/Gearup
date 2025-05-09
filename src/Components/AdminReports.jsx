<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { FaCertificate, FaSearch, FaDownload, FaFileDownload } from "react-icons/fa";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import "./AdminReports.css";
import { app } from '../firebase';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

const AdminReports = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Update filtered employees whenever employees or search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = employees.filter(
        emp => 
          emp.name.toLowerCase().includes(term) || 
          emp.department?.toLowerCase().includes(term) ||
          (courses.find(c => c.id === emp.courseId)?.name || "").toLowerCase().includes(term)
      );
      setFilteredEmployees(filtered);
    }
  }, [employees, searchTerm, courses]);

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

  // Function to generate and download a certificate for a specific employee
  const downloadSingleCertificate = (employee) => {
    try {
      // Find employee's course 
      const employeeCourse = courses.find(c => c.id === employee.courseId)?.name || "Training Course";
      
      // Create new PDF document in landscape mode
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add certificate background
      pdf.setFillColor(245, 245, 250);
      pdf.rect(0, 0, 297, 210, 'F');
      
      // Add certificate content
      pdf.setFontSize(32);
      pdf.setTextColor(0, 0, 128);
      pdf.text("Certificate of Completion", 148.5, 40, { align: "center" });
      
      // Add border
      pdf.setDrawColor(0, 0, 128);
      pdf.setLineWidth(1.5);
      pdf.rect(10, 10, 277, 190);
      
      // Add inner decorative border
      pdf.setDrawColor(0, 0, 128);
      pdf.setLineWidth(0.7);
      pdf.rect(15, 15, 267, 180);
      
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("This certifies that", 148.5, 70, { align: "center" });
      
      pdf.setFontSize(26);
      pdf.setTextColor(0, 0, 0);
      pdf.text(employee.name, 148.5, 90, { align: "center" });
      
      pdf.setFontSize(16);
      pdf.text("has successfully completed the course", 148.5, 110, { align: "center" });
      
      pdf.setFontSize(22);
      pdf.setTextColor(0, 0, 128);
      pdf.text(employeeCourse, 148.5, 130, { align: "center" });
      
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      const today = new Date();
      pdf.text(`Date: ${today.toLocaleDateString()}`, 148.5, 160, { align: "center" });
      
      pdf.setFontSize(14);
      pdf.text("GearUp Training Program", 148.5, 175, { align: "center" });
      
      // Add a signature line
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(90, 185, 207, 185);
      
      pdf.setFontSize(12);
      pdf.text("Training Director", 148.5, 195, { align: "center" });
      
      // Save the PDF
      pdf.save(`${employee.name.replace(/\s+/g, '_')}_certificate.pdf`);
      
      showMessageToUser(`Certificate for ${employee.name} downloaded successfully!`);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      showMessageToUser("Error downloading certificate", "error");
    }
  };
  
  // Function to generate and download all eligible certificates
  const handleGenerateAllCertificates = () => {
    try {
      const completedEmployees = employees.filter(emp => emp.status === "Completed");
      
      if (completedEmployees.length === 0) {
        showMessageToUser("No completed courses found to generate certificates", "error");
        return;
      }
      
      // Create a single PDF with all certificates
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      completedEmployees.forEach((employee, index) => {
        // Add a new page for each certificate except the first one
        if (index > 0) {
          pdf.addPage();
        }
        
        const employeeCourse = courses.find(c => c.id === employee.courseId)?.name || "Training Course";
        
        // Add fancy certificate background
        pdf.setFillColor(245, 245, 250);
        pdf.rect(0, 0, 297, 210, 'F');
        
        // Add certificate content
        pdf.setFontSize(32);
        pdf.setTextColor(0, 0, 128);
        pdf.text("Certificate of Completion", 148.5, 40, { align: "center" });
        
        // Add border
        pdf.setDrawColor(0, 0, 128);
        pdf.setLineWidth(1.5);
        pdf.rect(10, 10, 277, 190);
        
        // Add inner decorative border
        pdf.setDrawColor(0, 0, 128);
        pdf.setLineWidth(0.7);
        pdf.rect(15, 15, 267, 180);
        
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text("This certifies that", 148.5, 70, { align: "center" });
        
        pdf.setFontSize(26);
        pdf.setTextColor(0, 0, 0);
        pdf.text(employee.name, 148.5, 90, { align: "center" });
        
        pdf.setFontSize(16);
        pdf.text("has successfully completed the course", 148.5, 110, { align: "center" });
        
        pdf.setFontSize(22);
        pdf.setTextColor(0, 0, 128);
        pdf.text(employeeCourse, 148.5, 130, { align: "center" });
        
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        const today = new Date();
        pdf.text(`Date: ${today.toLocaleDateString()}`, 148.5, 160, { align: "center" });
        
        pdf.setFontSize(14);
        pdf.text("GearUp Training Program", 148.5, 175, { align: "center" });
        
        // Add a signature line
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(90, 185, 207, 185);
        
        pdf.setFontSize(12);
        pdf.text("Training Director", 148.5, 195, { align: "center" });
      });
      
      // Save the PDF with all certificates
      pdf.save("all_certificates.pdf");
      
      showMessageToUser(`Generated ${completedEmployees.length} certificates successfully!`);
    } catch (error) {
      console.error("Error generating all certificates:", error);
      showMessageToUser("Error generating certificates", "error");
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
  
  // Function to handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Function to download comprehensive report as PDF
  const handleDownloadReport = () => {
    try {
      // Create PDF with landscape orientation for better tables
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 128);
      pdf.text("GearUp Training Program - Comprehensive Report", 148.5, 15, { align: "center" });
      
      // Date
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 148.5, 25, { align: "center" });
      
      // Summary Statistics
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Summary Statistics", 14, 40);
      
      pdf.setFontSize(12);
      pdf.text(`Total Employees: ${employees.length}`, 14, 50);
      pdf.text(`Total Departments: ${departments.length}`, 14, 57);
      pdf.text(`Total Courses: ${courses.length}`, 14, 64);
      pdf.text(`Completed Courses: ${employees.filter(e => e.status === "Completed").length}`, 14, 71);
      pdf.text(`In Progress Courses: ${employees.filter(e => e.status === "In Progress").length}`, 14, 78);
      pdf.text(`Not Started Courses: ${employees.filter(e => e.status === "Not Started").length}`, 14, 85);
      
      // Department Statistics
      pdf.setFontSize(16);
      pdf.text("Department Statistics", 14, 100);
      
      // Department table
      const deptData = getDepartmentChartData();
      const deptTableData = deptData.map(d => [d.name, d.value.toString()]);
      
      pdf.autoTable({
        startY: 105,
        head: [['Department', 'Number of Employees']],
        body: deptTableData,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 128] }
      });
      
      // Employee Status Table
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text("Employee Status Details", 14, 20);
      
      const employeeTableData = employees.map(emp => [
        emp.name,
        emp.department,
        courses.find(c => c.id === emp.courseId)?.name || "Not Assigned",
        emp.status
      ]);
      
      pdf.autoTable({
        startY: 25,
        head: [['Employee Name', 'Department', 'Course', 'Status']],
        body: employeeTableData,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 128] },
        styles: { overflow: 'linebreak' },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 50 },
          2: { cellWidth: 80 },
          3: { cellWidth: 30 }
        }
      });
      
      // Save the PDF
      pdf.save("training_program_report.pdf");
      
      showMessageToUser("Report downloaded successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      showMessageToUser("Error generating report", "error");
    }
=======
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
>>>>>>> feature
  };

  return (
    <AdminLayout>
      <div className="reports-container">
<<<<<<< HEAD
        <h2>Certifications</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="reports-actions">
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Search employees, departments, or courses..." 
                  value={searchTerm} 
                  onChange={handleSearch}
                />
                <FaSearch className="search-icon" />
              </div>
              <div className="download-buttons">
                <button className="download-btn" onClick={handleGenerateAllCertificates}>
                  <FaCertificate className="btn-icon" />
                  Download All Certificates
                </button>
                <button className="download-btn" onClick={handleDownloadReport}>
                  <FaFileDownload className="btn-icon" />
                  Download Full Report
                </button>
              </div>
            </div>

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
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="emp-info">
                        <div className="avatar initials">
                          {emp.name
                            ?.split(" ")
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
                      {/* Show download button only for completed employees */}
                      {emp.status === "Completed" ? (
                        <button 
                          className="cert-btn" 
                          onClick={() => downloadSingleCertificate(emp)}
                        >
                          <FaDownload className="icon" />
                          Download
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
      
      {/* Styles */}
      <style jsx>{`
        .reports-actions {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          align-items: center;
        }
        
        .search-container {
          position: relative;
          width: 40%;
        }
        
        .search-container input {
          width: 100%;
          padding: 10px 15px 10px 40px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }
        
        .download-buttons {
          display: flex;
          gap: 10px;
        }
        
        .download-btn {
          display: flex;
          align-items: center;
          background-color: #4a6ff3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        
        .download-btn:hover {
          background-color: #3a5fd3;
        }
        
        .btn-icon {
          margin-right: 8px;
        }
        
        .cert-btn {
          display: flex;
          align-items: center;
          background-color: #4a6ff3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.3s;
        }
        
        .cert-btn:hover {
          background-color: #3a5fd3;
        }
        
        .icon {
          margin-right: 4px;
        }
      `}</style>
=======
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
>>>>>>> feature
    </AdminLayout>
  );
};

<<<<<<< HEAD
export default AdminReports;
=======
export default AdminReports;
>>>>>>> feature
