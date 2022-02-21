// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAD9tgNVWYdQuiTt1CroOCkxD62juWZ7VY",
  authDomain: "sell-my-car-43899.firebaseapp.com",
  projectId: "sell-my-car-43899",
  storageBucket: "sell-my-car-43899.appspot.com",
  messagingSenderId: "37729667744",
  appId: "1:37729667744:web:e8b859842ac5eb6fe1d7c5",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
