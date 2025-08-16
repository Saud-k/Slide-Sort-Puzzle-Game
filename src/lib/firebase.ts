import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "slide-sort-puzzle",
  "appId": "1:177874718666:web:9db385bdc9e93f7c160933",
  "storageBucket": "slide-sort-puzzle.firebasestorage.app",
  "apiKey": "AIzaSyB15KbQN3bW3UScYbULODKoIWJdu13LiTk",
  "authDomain": "slide-sort-puzzle.firebaseapp.com",
  "messagingSenderId": "177874718666"
};

const apps = getApps();
const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
