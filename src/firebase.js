// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyB7f_kZzWfi1fWYKYigyhZC3kEuqXLRmvY",
    authDomain: "gearup-9febe.firebaseapp.com",
    projectId: "gearup-9febe",
    storageBucket: "gearup-9febe.firebasestorage.app",
    messagingSenderId: "1001111526201",
    appId: "1:1001111526201:web:1dc0d3301b85a87d18e6e8"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage,auth };
