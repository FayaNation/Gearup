// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxCZY42z5gHADgSuZHr_-XGBHD9dCTG8U",
  authDomain: "gearup-2608b.firebaseapp.com",
  projectId: "gearup-2608b",
  storageBucket: "gearup-2608b.firebasestorage.app",
  messagingSenderId: "732815947780",
  appId: "1:732815947780:web:d8bebe658c5c1fbd311d51",
  measurementId: "G-HHW1V0CC57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app };