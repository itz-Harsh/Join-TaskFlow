
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApybzmobmi5AW8UJ1uOMXt7ybWhJZxKVI",
  authDomain: "join-taskflow.firebaseapp.com",
  projectId: "join-taskflow",
  storageBucket: "join-taskflow.firebasestorage.app",
  messagingSenderId: "1094805241887",
  appId: "1:1094805241887:web:3efda198a43f494580552a",
  measurementId: "G-QWVEPR9ZBK"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { app , auth };