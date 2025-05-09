import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminEmployees.css';

const AdminEmployees = () => {
  const [activeTab, setActiveTab] = useState('add');

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Alex Morgan', email: 'alex@gearup.com', department: 'Mechanical', password: '' },
    { id: 2, name: 'Jamie Lee', email: 'jamie@gearup.com', department: 'Electrical', password: '' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const [newEmp, setNewEmp] = useState({ name: '', email: '', department: '', password: '' });

  const handleAddEmployee = () => {
    if (newEmp.name && newEmp.email && newEmp.department && newEmp.password) {
      const id = Date.now();
      setEmployees([...employees, { id, ...newEmp }]);
      setNewEmp({ name: '', email: '', department: '', password: '' });
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
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
      emp.email.toLowerCase().includes(term)
    );
  });

  const handleEditChange = (id, field, value) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    );
  };

  const handleSaveAllChanges = () => {
    alert('All changes saved successfully ✅');
  };

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
          <input
            type="text"
            placeholder="Department"
            value={newEmp.department}
            onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
          />
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
              placeholder="Search by name or email..."
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
                    <input
                      type="text"
                      value={emp.name}
                      onChange={(e) => handleEditChange(emp.id, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={emp.email}
                      onChange={(e) => handleEditChange(emp.id, 'email', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={emp.department}
                      onChange={(e) => handleEditChange(emp.id, 'department', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="password"
                      value={emp.password || ''}
                      onChange={(e) => handleEditChange(emp.id, 'password', e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1.5rem' }}>
            <button className="save-btn" onClick={handleSaveAllChanges}>
              Save Changes
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AdminLayout onMenuSelect={setActiveTab} activeMenu={activeTab}>
      <div className="employees-panel">{renderTabContent()}</div>
    </AdminLayout>
  );
};

export default AdminEmployees;
