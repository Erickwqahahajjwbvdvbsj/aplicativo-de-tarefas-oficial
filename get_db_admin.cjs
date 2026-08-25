const admin = require('firebase-admin');

admin.initializeApp({
  projectId: "aplicativo-de-tarefas-2611d"
});

const db = admin.firestore;

async function run() {
  const snapshot = await db().collection('goals').limit(10).get();
  console.log("Found goals: " + snapshot.size);
}

run().catch(console.error);
