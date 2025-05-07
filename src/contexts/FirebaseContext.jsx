import { createContext, useContext, useState, useEffect } from 'react';
import { app, database, auth } from '../config/firebase';
import { initializeDatabaseIfEmpty } from '../utils/initializeDatabase';

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

  // Initialize Firebase when the component mounts
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Initialize the database if it's empty
        await initializeDatabaseIfEmpty();
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
    database,
    auth,
    isInitialized,
    isLoading,
    error
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;