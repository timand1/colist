import { createApp } from 'vue'
import './style.scss'
import router from './router'
import App from './App.vue'
// import { initializeApp } from 'firebase/app'
// import { getAuth } from 'firebase/auth'
// import { getFirestore } from 'firebase/firestore'
// const firebaseConfig = {
//     apiKey: import.meta.env.API_KEY,
//     authDomain: import.meta.env.AUTH_DOMAIN,
//     projectId: import.meta.env.PROJECT_ID,
//     storageBucket: import.meta.env.STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
//     appId: import.meta.env.APP_ID,
//     measurementId: import.meta.env.MEASUREMENT_ID,
//   };
import { FirebasePlugin } from './firebase'

createApp(App)
  .use(router)
  .use(FirebasePlugin)
  .mount('#app')