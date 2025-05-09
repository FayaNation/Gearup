// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBj8LFBdZzKTgRdj0UdFQB9JLlxB8CQiWU",
  authDomain: "gearup-83650.firebaseapp.com",
  projectId: "gearup-83650",
  storageBucket: "gearup-83650.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abcdef",
  measurementId: "G-ABCDEFGHIJ"
};

// Initialize Firebase
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);

  // Initialize Firestore and get a reference to the service
  db = getFirestore(app);

  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);

  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { app, db, auth };
