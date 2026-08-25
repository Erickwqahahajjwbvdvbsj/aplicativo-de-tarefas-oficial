const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBNaiZyZY4MtHaErtEzzacNoMUT3XCaghc",
  authDomain: "aplicativo-de-tarefas-2611d.firebaseapp.com",
  projectId: "aplicativo-de-tarefas-2611d",
  storageBucket: "aplicativo-de-tarefas-2611d.firebasestorage.app",
  messagingSenderId: "570359073778",
  appId: "1:570359073778:web:cf80d2f20a8c4436ffb96b",
  measurementId: "G-P0ZE7ZTPV1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const snapshot = await getDocs(collection(db, 'debug_errors'));
  snapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data());
  });
}

run().catch(console.error);
