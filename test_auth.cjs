const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, limit } = require('firebase/firestore');
const { getAuth, signInAnonymously } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyBNaiZyZY4MtHaErtEzzacNoMUT3XCaghc",
  authDomain: "aplicativo-de-tarefas-2611d.firebaseapp.com",
  projectId: "aplicativo-de-tarefas-2611d",
  storageBucket: "aplicativo-de-tarefas-2611d.firebasestorage.app",
  messagingSenderId: "570359073778",
  appId: "1:570359073778:web:cf80d2f20a8c4436ffb96b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function run() {
  await signInAnonymously(auth);
  const snapshot = await getDocs(query(collection(db, 'debug_errors'), limit(20)));
  snapshot.forEach(doc => {
    console.log(doc.id, "=>", JSON.stringify(doc.data(), null, 2));
  });
}

run().catch(console.error);
