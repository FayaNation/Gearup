import { createContext, useContext, useState, useEffect } from 'react';
import { app, db, auth } from '../config/firebase';
import { initializeDatabase } from '../utils/initializeDatabase';

// Create the Firebase context
const FirebaseContext = createContext(null);

// Custom hook to use the Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

// Firebase provider component
export const FirebaseProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Initialize Firebase when the component mounts
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        console.log('Starting Firebase initialization...');

        if (!app || !db) {
          throw new Error('Firebase app or Firestore not initialized properly. Check your Firebase configuration.');
        }

        // Force initialize the database with sample data
        console.log('Initializing database with sample data...');
        const result = await initializeDatabase();

        if (result) {
          console.log('Database initialized successfully with sample data');
          setDbInitialized(true);
        } else {
          console.warn('Database initialization returned false. Database might already have data or there was an error.');
        }

        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing Firebase:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFirebase();
  }, []);

  // Value to be provided by the context
  const value = {
    app,
    db,
    auth,
    isInitialized,
    isLoading,
    error,
    dbInitialized
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;
