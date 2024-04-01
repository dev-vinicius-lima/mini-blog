import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7tIC8hRxEFRZzq1G-_cnrvcFjkFYcdQM",
  authDomain: "miniblog-934a3.firebaseapp.com",
  projectId: "miniblog-934a3",
  storageBucket: "miniblog-934a3.appspot.com",
  messagingSenderId: "680064763314",
  appId: "1:680064763314:web:a8dfd79271b8156c1350ab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
