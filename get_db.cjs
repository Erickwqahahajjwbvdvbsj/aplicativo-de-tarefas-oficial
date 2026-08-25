const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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
  try {
    const goalsSnapshot = await getDocs(collection(db, 'goals'));
    console.log("Goals in DB:", goalsSnapshot.size);
  } catch (e) {
    console.error("Direct fetch failed:", e);
  }
}

run().catch(console.error);
