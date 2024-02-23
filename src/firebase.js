// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdU9CSPY9AKyfDyPrw25nEJQO8E4c8PsI",
  authDomain: "podcast-app-44917.firebaseapp.com",
  projectId: "podcast-app-44917",
  storageBucket: "podcast-app-44917.appspot.com",
  messagingSenderId: "876220741393",
  appId: "1:876220741393:web:c9287e7e6dcad9bc38feb0",
  measurementId: "G-YJHSXNGC4V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export {auth,db,storage};