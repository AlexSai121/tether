import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
      apiKey: "AIzaSyBz7vLpLi4LRwjOywtnTS_u79zjA_Uwkko",
      authDomain: "tether-46a38.firebaseapp.com",
      projectId: "tether-46a38",
      storageBucket: "tether-46a38.firebasestorage.app",
      messagingSenderId: "1039776564204",
      appId: "1:1039776564204:web:fd91159c72be24671a76c9",
      measurementId: "G-LRB62MH1B5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
