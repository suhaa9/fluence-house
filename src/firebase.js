// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "fluence-house.firebaseapp.com",
  projectId: "fluence-house",
  storageBucket: "fluence-house.firebasestorage.app",
  messagingSenderId: "346553270890",
  appId: "1:346553270890:web:7b7d3353e3cb7e420a8013",
  measurementId: "G-FDTBMB74E5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
