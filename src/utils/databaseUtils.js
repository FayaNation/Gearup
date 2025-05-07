import { 
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, 
  query, where, serverTimestamp 
} from "firebase/firestore";
import { db } from "../config/firebase";

// Collection references
const coursesCollection = collection(db, 'courses');
const assessmentsCollection = collection(db, 'assessments');
const employeesCollection = collection(db, 'employees');
const certificationsCollection = collection(db, 'certifications');
const reportsCollection = collection(db, 'reports');

// Helper function to convert Firestore data to a more usable format
const convertFirestoreData = (snapshot) => {
  if (snapshot.empty) return {};

  const data = {};
  snapshot.forEach(doc => {
    data[doc.id] = doc.data();
  });
  return data;
};

// Courses CRUD operations
export const createCourse = async (courseData) => {
  try {
    const docRef = await addDoc(coursesCollection, {
      ...courseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

export const getCourses = async () => {
  try {
    const snapshot = await getDocs(coursesCollection);
    return convertFirestoreData(snapshot);
  } catch (error) {
    console.error("Error getting courses:", error);
    return {};
  }
};

export const getCourseById = async (courseId) => {
  try {
    const docRef = doc(db, 'courses', courseId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting course by ID:", error);
    return null;
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const docRef = doc(db, 'courses', courseId);
    await updateDoc(docRef, {
      ...courseData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const docRef = doc(db, 'courses', courseId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

// Assessments CRUD operations
export const createAssessment = async (assessmentData) => {
  try {
    const docRef = await addDoc(assessmentsCollection, {
      ...assessmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating assessment:", error);
    throw error;
  }
};

export const getAssessments = async () => {
  try {
    const snapshot = await getDocs(assessmentsCollection);
    return convertFirestoreData(snapshot);
  } catch (error) {
    console.error("Error getting assessments:", error);
    return {};
  }
};

export const getAssessmentById = async (assessmentId) => {
  try {
    const docRef = doc(db, 'assessments', assessmentId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting assessment by ID:", error);
    return null;
  }
};

export const updateAssessment = async (assessmentId, assessmentData) => {
  try {
    const docRef = doc(db, 'assessments', assessmentId);
    await updateDoc(docRef, {
      ...assessmentData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating assessment:", error);
    throw error;
  }
};

export const deleteAssessment = async (assessmentId) => {
  try {
    const docRef = doc(db, 'assessments', assessmentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting assessment:", error);
    throw error;
  }
};

// Employees CRUD operations
export const createEmployee = async (employeeData) => {
  try {
    const docRef = await addDoc(employeesCollection, {
      ...employeeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

export const getEmployees = async () => {
  try {
    const snapshot = await getDocs(employeesCollection);
    return convertFirestoreData(snapshot);
  } catch (error) {
    console.error("Error getting employees:", error);
    return {};
  }
};

export const getEmployeeById = async (employeeId) => {
  try {
    const docRef = doc(db, 'employees', employeeId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting employee by ID:", error);
    return null;
  }
};

export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const docRef = doc(db, 'employees', employeeId);
    await updateDoc(docRef, {
      ...employeeData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const docRef = doc(db, 'employees', employeeId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

// Certifications CRUD operations
export const createCertification = async (certificationData) => {
  try {
    const docRef = await addDoc(certificationsCollection, {
      ...certificationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating certification:", error);
    throw error;
  }
};

export const getCertifications = async () => {
  try {
    const snapshot = await getDocs(certificationsCollection);
    return convertFirestoreData(snapshot);
  } catch (error) {
    console.error("Error getting certifications:", error);
    return {};
  }
};

export const getCertificationById = async (certificationId) => {
  try {
    const docRef = doc(db, 'certifications', certificationId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting certification by ID:", error);
    return null;
  }
};

export const updateCertification = async (certificationId, certificationData) => {
  try {
    const docRef = doc(db, 'certifications', certificationId);
    await updateDoc(docRef, {
      ...certificationData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating certification:", error);
    throw error;
  }
};

export const deleteCertification = async (certificationId) => {
  try {
    const docRef = doc(db, 'certifications', certificationId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting certification:", error);
    throw error;
  }
};

// Reports CRUD operations
export const createReport = async (reportData) => {
  try {
    const docRef = await addDoc(reportsCollection, {
      ...reportData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
};

export const getReports = async () => {
  try {
    const snapshot = await getDocs(reportsCollection);
    return convertFirestoreData(snapshot);
  } catch (error) {
    console.error("Error getting reports:", error);
    return {};
  }
};

// Query functions
export const getCoursesByCategory = async (category) => {
  try {
    const q = query(coursesCollection, where('category', '==', category));
    const snapshot = await getDocs(q);
    return convertFirestoreData(snapshot);
  } catch (error) {
    console.error("Error getting courses by category:", error);
    return {};
  }
};

export const getEmployeesByDepartment = async (department) => {
  try {
    const q = query(employeesCollection, where('department', '==', department));
    const snapshot = await getDocs(q);
    return convertFirestoreData(snapshot);
  } catch (error) {
    console.error("Error getting employees by department:", error);
    return {};
  }
};

export const getAssessmentsByCourse = async (courseId) => {
  try {
    const q = query(assessmentsCollection, where('courseId', '==', courseId));
    const snapshot = await getDocs(q);
    return convertFirestoreData(snapshot);
  } catch (error) {
    console.error("Error getting assessments by course:", error);
    return {};
  }
};

export const getCertificationsByEmployee = async (employeeId) => {
  try {
    const q = query(certificationsCollection, where('employeeId', '==', employeeId));
    const snapshot = await getDocs(q);
    return convertFirestoreData(snapshot);
  } catch (error) {
    console.error("Error getting certifications by employee:", error);
    return {};
  }
};
