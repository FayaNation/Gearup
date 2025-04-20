import { Routes, Route } from 'react-router-dom';
import LandingPage from './Components/landingpage';
import AdminLogin from './Components/adminlogin';
import EmployeeLogin from './Components/employeelogin';
//import AdminDashboard from './Components/AdminDashboard';
import AdminCourses from './Components/AdminCourses';
import AdminAssessments from './Components/AdminAssessments'; // ✅ import this
import AdminEmployees from './Components/AdminEmployees';
//import AdminEmployees from './Components/AdminReports';
import AdminReports from './Components/AdminReports';
import EmployeeCourses from './Components/EmployeeCourses';
import EmployeeAssessments from './Components/EmployeeAssessments';
import EmployeeCertifications from './Components/EmployeeCertifications';


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
