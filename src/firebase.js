import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase project settings. These values are public by design (they only
// identify the project); security comes from Firestore rules + Auth.
const firebaseConfig = {
  apiKey: "AIzaSyBJN8O9ytaBwJbSuMplH5S_MxmgdrEt_xE",
  authDomain: "best-driving-school-e6149.firebaseapp.com",
  projectId: "best-driving-school-e6149",
  storageBucket: "best-driving-school-e6149.firebasestorage.app",
  messagingSenderId: "125616069253",
  appId: "1:125616069253:web:cfce4095eb827167dde7ec",
};

// PERFORMANCE: this file only sets up Firebase Auth, which the navbar needs
// on every page. The Firestore database (the heavier library) lives in
// src/firestore.js so it is only downloaded on pages that actually use it
// (booking, dashboard, admin) instead of on every page.
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
