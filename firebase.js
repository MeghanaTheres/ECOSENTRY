import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAI8-zrevwTB_98acHq0aSHFdQuU7930hc",
    authDomain: "ecosentry-9a3eb.firebaseapp.com",
    projectId: "ecosentry-9a3eb",
    storageBucket: "ecosentry-9a3eb.appspot.com",
    messagingSenderId: "459021556704",
    appId: "1:459021556704:web:0baf8a2ce8089ef0e06985"
  };

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();