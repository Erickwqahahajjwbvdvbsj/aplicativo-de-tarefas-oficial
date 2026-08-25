const admin = require('firebase-admin');
admin.initializeApp({ projectId: "aplicativo-de-tarefas-2611d" });
const db = admin.firestore();

async function deleteQueryBatch(query, resolve) {
  const snapshot = await query.get();
  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}

async function run() {
  await new Promise((resolve) => deleteQueryBatch(db.collection('goals').limit(100), resolve));
  await new Promise((resolve) => deleteQueryBatch(db.collection('notes').limit(100), resolve));
  await new Promise((resolve) => deleteQueryBatch(db.collection('tasks').limit(100), resolve));
  console.log("Deleted.");
}
run().catch(console.error);
