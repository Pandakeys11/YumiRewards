// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
// Your web app's Firebase configuration \n

const firebaseConfig = {
  apiKey: "AIzaSyAN-37ysgFJlncUZAVH7k79HPSqUZy4FKA",
  authDomain: "yumi-pop.firebaseapp.com",
  databaseURL: "https://yumi-pop-default-rtdb.firebaseio.com",
  projectId: "yumi-pop",
  storageBucket: "yumi-pop.firebasestorage.app",
  messagingSenderId: "328717127716",
  appId: "1:328717127716:web:9c7b5beefda761f8ae48b1",
  measurementId: "G-HHDJD3F9VY"
 };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Analytics
const analytics = getAnalytics(app);

export { db, auth, storage, analytics }; 