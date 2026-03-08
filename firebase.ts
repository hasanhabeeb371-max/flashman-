import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWH5fbTONUNYF7S3omAC-QNvQ2tCB4iCU",
  authDomain: "flash-man-ca6ee.firebaseapp.com",
  projectId: "flash-man-ca6ee",
  storageBucket: "flash-man-ca6ee.firebasestorage.app",
  messagingSenderId: "479173397327",
  appId: "1:479173397327:web:1e86111f0d1841b014533a",
  measurementId: "G-M1TQ5HKEKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
