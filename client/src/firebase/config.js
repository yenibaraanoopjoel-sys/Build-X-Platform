import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Production Firebase Configuration for buildx-63e3f
const firebaseConfig = {
  apiKey: "AIzaSyCE5dVXgQ_8rrFUEZX46_zDGRMhPZ4hJ-w",
  authDomain: "buildx-63e3f.firebaseapp.com",
  projectId: "buildx-63e3f",
  storageBucket: "buildx-63e3f.firebasestorage.app",
  messagingSenderId: "247354238920",
  appId: "1:247354238920:web:9d0f12c0116d1a93ed02fd",
  measurementId: "G-QSP30C0L9X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("Failed to set persistent auth:", err);
});

// Google Auth Provider — request profile + email scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");
googleProvider.setCustomParameters({
  prompt: "select_account",
  // Allow sign-in from any Google account
  access_type: "offline",
});

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;
