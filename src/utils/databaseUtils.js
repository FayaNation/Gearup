import { ref, set, get, push, update, remove, query, orderByChild, equalTo } from "firebase/database";
import { database } from "../config/firebase";

// Database references
const coursesRef = ref(database, 'courses');
const assessmentsRef = ref(database, 'assessments');
const employeesRef = ref(database, 'employees');
const certificationsRef = ref(database, 'certifications');
const reportsRef = ref(database, 'reports');

// Courses CRUD operations
export const createCourse = async (courseData) => {
  const newCourseRef = push(coursesRef);
  await set(newCourseRef, {
    ...courseData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return newCourseRef.key;
};

export const getCourses = async () => {
  const snapshot = await get(coursesRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const getCourseById = async (courseId) => {
  const courseRef = ref(database, `courses/${courseId}`);
  const snapshot = await get(courseRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};

export const updateCourse = async (courseId, courseData) => {
  const courseRef = ref(database, `courses/${courseId}`);
  await update(courseRef, {
    ...courseData,
    updatedAt: new Date().toISOString()
  });
};

export const deleteCourse = async (courseId) => {
  const courseRef = ref(database, `courses/${courseId}`);
  await remove(courseRef);
};

// Assessments CRUD operations
export const createAssessment = async (assessmentData) => {
  const newAssessmentRef = push(assessmentsRef);
  await set(newAssessmentRef, {
    ...assessmentData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return newAssessmentRef.key;
};

export const getAssessments = async () => {
  const snapshot = await get(assessmentsRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const getAssessmentById = async (assessmentId) => {
  const assessmentRef = ref(database, `assessments/${assessmentId}`);
  const snapshot = await get(assessmentRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};

export const updateAssessment = async (assessmentId, assessmentData) => {
  const assessmentRef = ref(database, `assessments/${assessmentId}`);
  await update(assessmentRef, {
    ...assessmentData,
    updatedAt: new Date().toISOString()
  });
};

export const deleteAssessment = async (assessmentId) => {
  const assessmentRef = ref(database, `assessments/${assessmentId}`);
  await remove(assessmentRef);
};

// Employees CRUD operations
export const createEmployee = async (employeeData) => {
  const newEmployeeRef = push(employeesRef);
  await set(newEmployeeRef, {
    ...employeeData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return newEmployeeRef.key;
};

export const getEmployees = async () => {
  const snapshot = await get(employeesRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const getEmployeeById = async (employeeId) => {
  const employeeRef = ref(database, `employees/${employeeId}`);
  const snapshot = await get(employeeRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};

export const updateEmployee = async (employeeId, employeeData) => {
  const employeeRef = ref(database, `employees/${employeeId}`);
  await update(employeeRef, {
    ...employeeData,
    updatedAt: new Date().toISOString()
  });
};

export const deleteEmployee = async (employeeId) => {
  const employeeRef = ref(database, `employees/${employeeId}`);
  await remove(employeeRef);
};

// Certifications CRUD operations
export const createCertification = async (certificationData) => {
  const newCertificationRef = push(certificationsRef);
  await set(newCertificationRef, {
    ...certificationData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return newCertificationRef.key;
};

export const getCertifications = async () => {
  const snapshot = await get(certificationsRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const getCertificationById = async (certificationId) => {
  const certificationRef = ref(database, `certifications/${certificationId}`);
  const snapshot = await get(certificationRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};

export const updateCertification = async (certificationId, certificationData) => {
  const certificationRef = ref(database, `certifications/${certificationId}`);
  await update(certificationRef, {
    ...certificationData,
    updatedAt: new Date().toISOString()
  });
};

export const deleteCertification = async (certificationId) => {
  const certificationRef = ref(database, `certifications/${certificationId}`);
  await remove(certificationRef);
};

// Reports CRUD operations
export const createReport = async (reportData) => {
  const newReportRef = push(reportsRef);
  await set(newReportRef, {
    ...reportData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return newReportRef.key;
};

export const getReports = async () => {
  const snapshot = await get(reportsRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

// Query functions
export const getCoursesByCategory = async (category) => {
  const q = query(coursesRef, orderByChild('category'), equalTo(category));
  const snapshot = await get(q);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const getEmployeesByDepartment = async (department) => {
  const q = query(employeesRef, orderByChild('department'), equalTo(department));
  const snapshot = await get(q);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const getAssessmentsByCourse = async (courseId) => {
  const q = query(assessmentsRef, orderByChild('courseId'), equalTo(courseId));
  const snapshot = await get(q);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const getCertificationsByEmployee = async (employeeId) => {
  const q = query(certificationsRef, orderByChild('employeeId'), equalTo(employeeId));
  const snapshot = await get(q);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};