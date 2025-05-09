import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './AdminEmployees.css';
import { app } from '../firebase';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

const AdminEmployees = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', department: '', password: '' });
  const [editMode, setEditMode] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize Firestore
  const db = getFirestore(app);

  // Fetch employees and departments on component mount
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // Function to fetch employees from Firestore
  const fetchEmployees = async () => {
    try {
      const employeesSnapshot = await getDocs(collection(db, "employees"));
      const employeeList = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employees:", error);
      showMessageToUser("Error loading employees", "error");
    }
  };

  // Function to fetch departments from Firestore
  const fetchDepartments = async () => {
    try {
      const departmentsSnapshot = await getDocs(collection(db, "departments"));
      const departmentList = departmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setDepartments(departmentList);
    } catch (error) {
      console.error("Error fetching departments:", error);
      showMessageToUser("Error loading departments", "error");
    }
  };

  // Function to show messages to user
  const showMessageToUser = (msg, type = "success") => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  // Function to add employee to Firestore
  const handleAddEmployee = async () => {
    if (newEmp.name && newEmp.email && newEmp.department && newEmp.password) {
      try {
        await addDoc(collection(db, "employees"), {
          name: newEmp.name,
          email: newEmp.email,
          department: newEmp.department,
          password: newEmp.password
        });
        
        // Refresh employees list
        await fetchEmployees();
        
        // Reset form
        setNewEmp({ name: '', email: '', department: '', password: '' });
        
        // Show success message
        showMessageToUser("Employee added successfully!");
      } catch (error) {
        console.error("Error adding employee:", error);
        showMessageToUser("Error adding employee", "error");
      }
    } else {
      showMessageToUser("Please fill in all fields.", "error");
    }
  };

  // Function to delete employee from Firestore
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "employees", id));
      
      // Refresh employees list
      await fetchEmployees();
      
      showMessageToUser("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      showMessageToUser("Error deleting employee", "error");
    }
  };

  // Function to toggle edit mode for a specific employee
  const toggleEditMode = (id) => {
    setEditMode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Function to handle changes in edit fields
  const handleEditChange = (id, field, value) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    );
  };

  // Function to save changes for a specific employee
  const handleSaveEmployee = async (id) => {
    try {
      const employee = employees.find(emp => emp.id === id);
      
      await updateDoc(doc(db, "employees", id), {
        name: employee.name,
        email: employee.email,
        department: employee.department,
        password: employee.password
      });
      
      // Turn off edit mode
      toggleEditMode(id);
      
      showMessageToUser("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      showMessageToUser("Error updating employee", "error");
    }
  };

  // Function to save all changes at once
  const handleSaveAllChanges = async () => {
    try {
      // Create an array of promises to update all employees
      const updatePromises = employees.map(emp => 
        updateDoc(doc(db, "employees", emp.id), {
          name: emp.name,
          email: emp.email,
          department: emp.department,
          password: emp.password
        })
      );
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      // Reset all edit modes
      setEditMode({});
      
      showMessageToUser("All changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      showMessageToUser("Error saving changes", "error");
    }
  };

  const handleSort = () => {
    const sorted = [...employees].sort((a, b) => {
      const deptA = a.department.toLowerCase();
      const deptB = b.department.toLowerCase();
      return sortAsc ? deptA.localeCompare(deptB) : deptB.localeCompare(deptA);
    });
    setEmployees(sorted);
    setSortAsc(!sortAsc);
  };

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term)
    );
  });

  const renderTabContent = () => {
    if (activeTab === 'add') {
      return (
        <div className="add-employee">
          <h2>Add Employee</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={newEmp.name}
            onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmp.email}
            onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
          />
          <select
            value={newEmp.department}
            onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
          <input
            type="password"
            placeholder="Password"
            value={newEmp.password}
            onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })}
          />
          <button onClick={handleAddEmployee}>Add Employee</button>
        </div>
      );
    }

    if (activeTab === 'manage') {
      return (
        <div className="manage-employees">
          <h2>Manage & Edit Employees</h2>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, email or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th onClick={handleSort} className="sortable">
                  Department {sortAsc ? '↑' : '↓'}
                </th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    {editMode[emp.id] ? (
                      <input
                        type="text"
                        value={emp.name}
                        onChange={(e) => handleEditChange(emp.id, 'name', e.target.value)}
                      />
                    ) : (
                      emp.name
                    )}
                  </td>
                  <td>
                    {editMode[emp.id] ? (
                      <input
                        type="email"
                        value={emp.email}
                        onChange={(e) => handleEditChange(emp.id, 'email', e.target.value)}
                      />
                    ) : (
                      emp.email
                    )}
                  </td>
                  <td>
                    {editMode[emp.id] ? (
                      <select
                        value={emp.department}
                        onChange={(e) => handleEditChange(emp.id, 'department', e.target.value)}
                      >
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      emp.department
                    )}
                  </td>
                  <td>
                    {editMode[emp.id] ? (
                      <input
                        type="password"
                        value={emp.password || ''}
                        onChange={(e) => handleEditChange(emp.id, 'password', e.target.value)}
                      />
                    ) : (
                      '••••••••'
                    )}
                  </td>
                  <td>
                    {editMode[emp.id] ? (
                      <button onClick={() => handleSaveEmployee(emp.id)}>Save</button>
                    ) : (
                      <button onClick={() => toggleEditMode(emp.id)}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1.5rem' }}>
            <button className="save-btn" onClick={handleSaveAllChanges}>
              Save All Changes
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AdminLayout onMenuSelect={setActiveTab} activeMenu={activeTab}>
      <div className="employees-panel">
        {renderTabContent()}
        {showMessage && (
          <div className={`message-popup ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEmployees;