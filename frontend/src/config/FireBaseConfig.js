// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; 
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfJRazkh7ZF3QH8aVOwhM26npqs_hMwA0",
  authDomain: "bookstorefdm.firebaseapp.com",
  projectId: "bookstorefdm",
  storageBucket: "bookstorefdm.appspot.com",
  messagingSenderId: "939860591993",
  appId: "1:939860591993:web:bf896923d4ae0377b95ba8",
  measurementId: "G-92LT2EW1C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
export { auth, provider };