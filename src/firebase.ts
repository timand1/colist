import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIVMveu2uWMXO5hCz9N6oDnzf6naA86y8",
  authDomain: "listify-e8f72.firebaseapp.com",
  projectId: "listify-e8f72",
  storageBucket: "listify-e8f72.appspot.com",
  messagingSenderId: "1042874805577",
  appId: "1:1042874805577:web:b1a7463953eee434d63e98",
  measurementId: "G-QK26NN12QF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage();
export const db = getFirestore()