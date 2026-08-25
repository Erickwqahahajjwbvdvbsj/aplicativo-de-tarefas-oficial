const admin = require('firebase-admin');

admin.initializeApp({
  projectId: "aplicativo-de-tarefas-2611d"
});

const db = admin.firestore();

async function run() {
  const notes = await db.collection('notes').limit(10).get();
  console.log("Notes: " + notes.size);
  notes.forEach(doc => {
    console.log(doc.id, "=>", doc.data());
  });
}

run().catch(console.error);
