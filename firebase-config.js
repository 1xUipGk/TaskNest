// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6tkZjsM5I4OkG8SvCk6v5pyeM6nTzGT4",
    authDomain: "task-manager-87577.firebaseapp.com",
    projectId: "task-manager-87577",
    storageBucket: "task-manager-87577.firebasestorage.app",
    messagingSenderId: "949071438979",
    appId: "1:949071438979:web:d2a0056c95b9e02e90e7b6",
    measurementId: "G-HMZ54Z29EZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };