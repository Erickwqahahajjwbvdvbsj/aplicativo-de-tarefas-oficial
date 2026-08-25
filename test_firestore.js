const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, updateDoc } = require('firebase/firestore');

// We don't have the config here easily without the browser...
