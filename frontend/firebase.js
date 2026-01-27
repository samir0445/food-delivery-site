
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "food-delivery-2e5d8.firebaseapp.com",
  projectId: "food-delivery-2e5d8",
  storageBucket: "food-delivery-2e5d8.firebasestorage.app",
  messagingSenderId: "439540677220",
  appId: "1:439540677220:web:1b780b9f93d9c11ce57d71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app ,auth};