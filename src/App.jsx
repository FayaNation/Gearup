
import { Routes, Route } from 'react-router-dom';
import LandingPage from './Components/landingpage.jsx';
import AdminLogin from './Components/AdminLogin.jsx';
import EmployeeLogin from './Components/EmployeeLogin.jsx';

import AdminCourses from './Components/AdminCourses.jsx';
import AdminAssessments from './Components/AdminAssessments.jsx';
import AdminEmployees from './Components/AdminEmployees.jsx';
import AdminReports from './Components/AdminReports.jsx';
import EmployeeCourses from './Components/EmployeeCourses.jsx';
import EmployeeAssessments from './Components/EmployeeAssessments.jsx';
import EmployeeCertifications from './Components/EmployeeCertifications.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/employee-login" element={<EmployeeLogin />} />
      <Route path="/admin/courses" element={<AdminCourses />} />
      <Route path="/admin/assessments" element={<AdminAssessments />} /> {/* ✅ add this */}
      <Route path="/admin/employees" element={<AdminEmployees />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/employee/courses" element={<EmployeeCourses />} />
      <Route path="/employee/assessments" element={<EmployeeAssessments />} />
      <Route path="/employee/certifications" element={<EmployeeCertifications />} />
    </Routes>
  );
}

export default App;