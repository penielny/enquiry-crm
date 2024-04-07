import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBI30z91i2gdNHyNM3qNAOdd_dqYadJvSk",
  authDomain: "scout-dev-3214c.firebaseapp.com",
  projectId: "scout-dev-3214c",
  storageBucket: "scout-dev-3214c.appspot.com",
  messagingSenderId: "1002761926276",
  appId: "1:1002761926276:web:696664620608459a62b4d1",
  measurementId: "G-DP5YSE6VGT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const firebase_auth = getAuth(app);
const firebase_storage = getStorage(app);

export { db, firebase_auth, firebase_storage };
