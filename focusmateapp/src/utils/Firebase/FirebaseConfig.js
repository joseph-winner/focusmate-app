// Suggested code may be subject to a license. Learn more: ~LicenseLog:713182451.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3074404924.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:58815292.
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config object
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "focusmate-b5480.firebaseapp.com",
  projectId: "focusmate-b5480",
  storageBucket: "focusmate-b5480.firebasestorage.app",
  messagingSenderId: "110023921591",
  appId: "1:110023921591:web:219d625408429472b2a232",
  measurementId: "G-64PMPQ1DST"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, onAuthStateChanged, db };

