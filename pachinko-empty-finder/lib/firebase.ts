// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlrDyvWPXpLZNaodUO2K_dmU9PWz8ES84",
  authDomain: "jackpot-odyssey-cdbc3.firebaseapp.com",
  projectId: "jackpot-odyssey-cdbc3",
  storageBucket: "jackpot-odyssey-cdbc3.firebasestorage.app",
  messagingSenderId: "995429900771",
  appId: "1:995429900771:web:f33cb5301922b5fb3440d6",
  measurementId: "G-EBZ455838F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);