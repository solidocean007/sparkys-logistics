// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Move values to environment variables for safety
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Property 'env' does not exist on type 'ImportMeta'.
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Export Auth and Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

// Optional: initialize analytics only if supported
export const analytics = (await isSupported()) ? getAnalytics(app) : null;
