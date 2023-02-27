import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { App } from 'vue'

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
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)
const db = getFirestore()

const FirebasePlugin = {
  install: (app: App) => {
    app.config.globalProperties.$firebase = firebaseApp
  }
}
export { firebaseApp, auth, db, FirebasePlugin }

