const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, limit, orderBy } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBNaiZyZY4MtHaErtEzzacNoMUT3XCaghc",
  authDomain: "aplicativo-de-tarefas-2611d.firebaseapp.com",
  projectId: "aplicativo-de-tarefas-2611d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const snapshot = await getDocs(query(collection(db, 'debug_errors'), limit(20)));
  snapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data().error, doc.data().path);
  });
  console.log("Done");
  process.exit(0);
}
run();
