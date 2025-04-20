import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminEmployees.css';

const AdminEmployees = () => {
  const [activeTab, setActiveTab] = useState('add');

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Alex Morgan', email: 'alex@gearup.com', department: 'Mechanical' },
    { id: 2, name: 'Jamie Lee', email: 'jamie@gearup.com', department: 'Electrical' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const [newEmp, setNewEmp] = useState({ name: '', email: '', department: '' });
  const [editId, setEditId] = useState('');
  const [editInfo, setEditInfo] = useState({ name: '', email: '', department: '' });

  const handleAddEmployee = () => {
    if (newEmp.name && newEmp.email && newEmp.department) {
      const id = Date.now();
      setEmployees([...employees, { id, ...newEmp }]);
      setNewEmp({ name: '', email: '', department: '' });
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

  const handleEditSelection = (id) => {
    const selected = employees.find((e) => e.id === parseInt(id));
    setEditId(id);
    setEditInfo({ name: selected.name, email: selected.email, department: selected.department });
  };

  const handleSaveEdit = () => {
    setEmployees(
      employees.map((emp) =>
        emp.id === parseInt(editId) ? { ...emp, ...editInfo } : emp
      )
    );
    alert('Employee info updated ✅');
    setEditId('');
    setEditInfo({ name: '', email: '', department: '' });
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
          <button onClick={handleAddEmployee}>Add Employee</button>
        </div>
      );
    }

    if (activeTab === 'manage') {
      return (
        <div className="manage-employees">
          <h2>Manage Employees</h2>

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>
                    <button onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'edit') {
      return (
        <div className="edit-employee">
          <h2>Edit Employee Info</h2>

          <select value={editId} onChange={(e) => handleEditSelection(e.target.value)}>
            <option value="">Select an employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.department})
              </option>
            ))}
          </select>

          {editId && (
            <div className="edit-form">
              <input
                type="text"
                value={editInfo.name}
                onChange={(e) => setEditInfo({ ...editInfo, name: e.target.value })}
                placeholder="Name"
              />
              <input
                type="email"
                value={editInfo.email}
                onChange={(e) => setEditInfo({ ...editInfo, email: e.target.value })}
                placeholder="Email"
              />
              <input
                type="text"
                value={editInfo.department}
                onChange={(e) => setEditInfo({ ...editInfo, department: e.target.value })}
                placeholder="Department"
              />
              <button onClick={handleSaveEdit}>Save Changes</button>
            </div>
          )}
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
