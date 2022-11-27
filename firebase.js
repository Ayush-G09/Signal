import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, onSnapshot, doc, getDoc, setDoc, addDoc} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBOoflS4ay8j_CgzriaKBDuIYW7psDzyu0",
    authDomain: "signal-ebec5.firebaseapp.com",
    projectId: "signal-ebec5",
    storageBucket: "signal-ebec5.appspot.com",
    messagingSenderId: "866396909339",
    appId: "1:866396909339:web:50544c0ce564d4c3216dbe"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth, doc, setDoc, getDoc, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, onSnapshot, signInWithEmailAndPassword, collection, addDoc, getDocs};