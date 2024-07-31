const firebaseConfig = {
    apiKey: "AIzaSyAI8-zrevwTB_98acHq0aSHFdQuU7930hc",
    authDomain: "ecosentry-9a3eb.firebaseapp.com",
    projectId: "ecosentry-9a3eb",
    storageBucket: "ecosentry-9a3eb.appspot.com",
    messagingSenderId: "459021556704",
    appId: "1:459021556704:web:0baf8a2ce8089ef0e06985"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();