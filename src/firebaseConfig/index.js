// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmJIWAiKCQAa3uMEMLNfiIGaA5frxY_9E",
  authDomain: "xcs-algo-markets.firebaseapp.com",
  projectId: "xcs-algo-markets",
  storageBucket: "xcs-algo-markets.appspot.com",
  messagingSenderId: "596387173929",
  appId: "1:596387173929:web:2e4ee755dcb6d3f7dc6e38",
  measurementId: "G-FL6S5Y3NK9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage, analytics };
