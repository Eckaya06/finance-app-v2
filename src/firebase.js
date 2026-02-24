// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Senin Firebase yapılandırman
const firebaseConfig = {
  apiKey: "AIzaSyCwqHQIlMAx3UH60hbjizXVrk8w90nzCjI",
  authDomain: "financeapp-3029b.firebaseapp.com",
  projectId: "financeapp-3029b",
  storageBucket: "financeapp-3029b.firebasestorage.app",
  messagingSenderId: "392745400160",
  appId: "1:392745400160:web:8f1035f664efc48469d005",
  measurementId: "G-QKY01G20T0"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth ve Veritabanı servislerini dışa aktar (Diğer sayfalarda kullanmak için)
export const auth = getAuth(app);
export const db = getFirestore(app);