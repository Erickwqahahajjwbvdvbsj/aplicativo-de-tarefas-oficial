const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy, limit } = require('firebase/firestore');

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

async function run() {
  const snapshot = await getDocs(query(collection(db, 'debug_errors'), limit(30)));
  let found = false;
  snapshot.forEach(doc => {
    found = true;
    console.log(doc.id, "=>", JSON.stringify(doc.data(), null, 2));
  });
  if (!found) console.log("No debug errors found.");
}

run().catch(console.error);
