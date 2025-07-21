// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "AIzaSyCU0HAaguuwKQzO6ebwsJkyW6VPPJuPRYg",
  authDomain: "spark-s-logistics.firebaseapp.com",
  projectId: "spark-s-logistics",
  messagingSenderId: "615694192378",
  appId: "1:615694192378:web:2373f47ee7c62181cf4343"
});

// Retrieve messaging instance
const messaging = firebase.messaging();

