// Import the functions you need from the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "focusmate-b5480.firebaseapp.com",
  projectId: "focusmate-b5480",
  storageBucket: "focusmate-b5480.firebasestorage.app",
  messagingSenderId: "110023921591",
  appId: "1:110023921591:web:219d625408429472b2a232",
  measurementId: "G-64PMPQ1DST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Set up the Google provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
