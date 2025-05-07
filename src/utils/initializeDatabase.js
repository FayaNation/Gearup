import { database } from "../config/firebase";
import { ref, set, get } from "firebase/database";

// Sample data for initial database setup
const sampleData = {
  courses: {
    course1: {
      title: "Introduction to Workplace Safety",
      description: "Learn the basics of workplace safety protocols and procedures.",
      category: "Safety",
      duration: "2 hours",
      level: "Beginner",
      imageUrl: "https://example.com/safety-course.jpg",
      modules: [
        { title: "Safety Basics", content: "Content for safety basics module" },
        { title: "Emergency Procedures", content: "Content for emergency procedures module" }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    course2: {
      title: "Advanced Equipment Operation",
      description: "Master the operation of specialized equipment in a safe and efficient manner.",
      category: "Equipment",
      duration: "4 hours",
      level: "Advanced",
      imageUrl: "https://example.com/equipment-course.jpg",
      modules: [
        { title: "Equipment Overview", content: "Content for equipment overview module" },
        { title: "Operational Procedures", content: "Content for operational procedures module" },
        { title: "Troubleshooting", content: "Content for troubleshooting module" }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    course3: {
      title: "Leadership Skills for Supervisors",
      description: "Develop essential leadership skills for effective team management.",
      category: "Leadership",
      duration: "6 hours",
      level: "Intermediate",
      imageUrl: "https://example.com/leadership-course.jpg",
      modules: [
        { title: "Communication Skills", content: "Content for communication skills module" },
        { title: "Team Building", content: "Content for team building module" },
        { title: "Conflict Resolution", content: "Content for conflict resolution module" }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  assessments: {
    assessment1: {
      title: "Workplace Safety Assessment",
      description: "Test your knowledge of workplace safety protocols.",
      courseId: "course1",
      questions: [
        {
          question: "What should you do in case of a fire?",
          options: ["Run", "Hide", "Follow evacuation procedures", "Call your supervisor"],
          correctAnswer: 2
        },
        {
          question: "Which of the following is NOT a proper safety precaution?",
          options: ["Wearing safety goggles", "Running in corridors", "Using proper lifting techniques", "Reporting hazards"],
          correctAnswer: 1
        }
      ],
      passingScore: 80,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    assessment2: {
      title: "Equipment Operation Assessment",
      description: "Evaluate your understanding of equipment operation procedures.",
      courseId: "course2",
      questions: [
        {
          question: "What is the first step before operating any equipment?",
          options: ["Turn it on", "Check for damage", "Read the manual", "Ask a colleague"],
          correctAnswer: 2
        },
        {
          question: "How often should equipment be inspected?",
          options: ["Never", "Once a year", "Before each use", "Only when it breaks"],
          correctAnswer: 2
        }
      ],
      passingScore: 90,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  employees: {
    employee1: {
      firstName: "hope",
      lastName: "kenosi",
      email: "kenosihope@gmail.com",
      department: "Operations",
      position: "Operator",
      hireDate: "2022-01-15",
      completedCourses: ["course1"],
      inProgressCourses: ["course2"],
      certifications: ["cert1"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    employee2: {
      firstName: "tsaone",
      lastName: "tsaone",
      email: "tsaon@gmail.com",
      department: "Management",
      position: "Supervisor",
      hireDate: "2021-06-10",
      completedCourses: ["course1", "course3"],
      inProgressCourses: ["course2"],
      certifications: ["cert1", "cert2"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  certifications: {
    cert1: {
      title: "Workplace Safety Certified",
      description: "Certification for completing workplace safety training.",
      issuedDate: "2025-02-20",
      expiryDate: "2026-02-20",
      courseId: "course1",
      employeeId: "employee1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    cert2: {
      title: "Leadership Excellence",
      description: "Certification for demonstrating leadership skills.",
      issuedDate: "2022-01-15",
      expiryDate: "2024-01-15",
      courseId: "course3",
      employeeId: "employee2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  reports: {
    report1: {
      title: "Monthly Training Progress",
      description: "Overview of employee training progress for the month.",
      generatedDate: new Date().toISOString(),
      data: {
        totalEmployees: 2,
        coursesCompleted: 3,
        certificationIssued: 2,
        departmentBreakdown: {
          Operations: 1,
          Management: 1
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
};

// Function to initialize the database with sample data
export const initializeDatabase = async () => {
  try {
    // Set the sample data to the database
    await set(ref(database), sampleData);
    console.log("Database initialized with sample data");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
};

// Function to check if the database is empty
export const isDatabaseEmpty = async () => {
  try {
    const snapshot = await get(ref(database));
    return !snapshot.exists();
  } catch (error) {
    console.error("Error checking if database is empty:", error);
    return true; // Assume empty if there's an error
  }
};

// Initialize a database if it's empty
export const initializeDatabaseIfEmpty = async () => {
  const empty = await isDatabaseEmpty();
  if (empty) {
    return await initializeDatabase();
  }
  console.log("Database already contains data, skipping initialization");
  return false;
};
