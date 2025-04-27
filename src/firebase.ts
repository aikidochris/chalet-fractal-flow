// Firebase initialization (insert your config below)
// import { initializeApp } from 'firebase/app';
// import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCD-XcdchZtwZixoiXgW34DgWRiamN0-is",
  authDomain: "fractalkanban.firebaseapp.com",
  projectId: "fractalkanban",
  storageBucket: "fractalkanban.firebasestorage.app",
  messagingSenderId: "537335645269",
  appId: "1:537335645269:web:8c65e44cc1d337c42b00dc",
  measurementId: "G-F27H2JWRJC"
};
// For development, ensure Firestore rules allow public read/write:
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if true;
//     }
//   }
// }

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

/**
 * Ensure a root board exists in Firestore
 */
// export function initializeRootBoard() { /* no-op for dummy */ }

export {};
