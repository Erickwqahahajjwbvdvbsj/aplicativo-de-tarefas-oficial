const fs = require('fs');

function fixGoals() {
  let content = fs.readFileSync('src/hooks/useGoals.ts', 'utf8');
  content = content.replace(/const removeUndefined = \([\s\S]*?return newObj;\s*\}\s*return obj;\s*\};\s*const finalDocData = removeUndefined\(newGoal\);\s*finalDocData\.createdAt = serverTimestamp\(\);\s*await setDoc\(doc\(db, 'goals', goalId\), finalDocData\);/, 
    `const cleanGoal = JSON.parse(JSON.stringify(newGoal));\n      cleanGoal.createdAt = serverTimestamp();\n      await setDoc(doc(db, 'goals', goalId), cleanGoal);`);
  
  content = content.replace(/const removeUndefined = \([\s\S]*?return newObj;\s*\}\s*return obj;\s*\};\s*await setDoc\(doc\(db, 'goals', id\), removeUndefined\(payload\), \{ merge: true \}\);/,
    `const cleanPayload = JSON.parse(JSON.stringify(payload));\n      await setDoc(doc(db, 'goals', id), cleanPayload, { merge: true });`);
  
  fs.writeFileSync('src/hooks/useGoals.ts', content);
}

function fixNotes() {
  let content = fs.readFileSync('src/hooks/useNotes.ts', 'utf8');
  content = content.replace(/const payload = \{\s*title: newNote\.title,\s*content: newNote\.content,\s*isPinned: false,\s*ownerId: currentUser\.uid,\s*createdAt: serverTimestamp\(\),\s*updatedAt: serverTimestamp\(\),\s*\};\s*const removeUndefined = \([\s\S]*?return newObj;\s*\}\s*return obj;\s*\};\s*await setDoc\(doc\(db, "notes", newNoteId\), removeUndefined\(payload\)\);/,
    `const payload = { title: newNote.title, content: newNote.content, isPinned: false, ownerId: currentUser.uid };\n        const cleanPayload = JSON.parse(JSON.stringify(payload));\n        cleanPayload.createdAt = serverTimestamp();\n        cleanPayload.updatedAt = serverTimestamp();\n        await setDoc(doc(db, "notes", newNoteId), cleanPayload);`);
    
  content = content.replace(/const removeUndefined = \([\s\S]*?return newObj;\s*\}\s*return obj;\s*\};\s*await setDoc\(doc\(db, "notes", id\), removeUndefined\(payload\), \{ merge: true \}\);/,
    `const cleanPayload = JSON.parse(JSON.stringify(payload));\n        if (!isOnlyPinToggle) {\n          cleanPayload.updatedAt = serverTimestamp();\n        }\n        await setDoc(doc(db, "notes", id), cleanPayload, { merge: true });`);
  
  // also fix the previous one which had `if (!isOnlyPinToggle)` before removeUndefined
  content = content.replace(/if \(!isOnlyPinToggle\) \{\s*payload\.updatedAt = serverTimestamp\(\);\s*\}\s*const cleanPayload = JSON\.parse\(JSON\.stringify\(payload\)\);/g, `const cleanPayload = JSON.parse(JSON.stringify(payload));\n        if (!isOnlyPinToggle) {\n          cleanPayload.updatedAt = serverTimestamp();\n        }`);

  fs.writeFileSync('src/hooks/useNotes.ts', content);
}

function fixTasks() {
  let content = fs.readFileSync('src/hooks/useTasks.ts', 'utf8');
  content = content.replace(/const removeUndefined = \([\s\S]*?return newObj;\s*\}\s*return obj;\s*\};\s*const finalDocData = removeUndefined\(docData\);\s*finalDocData\.createdAt = serverTimestamp\(\);\s*await setDoc\(doc\(db, 'tasks', taskId\), finalDocData\);/,
    `const cleanDocData = JSON.parse(JSON.stringify(docData));\n        cleanDocData.createdAt = serverTimestamp();\n        await setDoc(doc(db, 'tasks', taskId), cleanDocData);`);
    
  content = content.replace(/const removeUndefined = \([\s\S]*?return newObj;\s*\}\s*return obj;\s*\};\s*finalUpdates = removeUndefined\(finalUpdates\);\s*\/\/ Keep images as base64 in Firestore directly\s*\/\/ finalUpdates\.images remains unchanged\s*await setDoc\(doc\(db, 'tasks', id\), finalUpdates, \{ merge: true \}\);/,
    `const cleanUpdates = JSON.parse(JSON.stringify(finalUpdates));\n        await setDoc(doc(db, 'tasks', id), cleanUpdates, { merge: true });`);
    
  fs.writeFileSync('src/hooks/useTasks.ts', content);
}

fixGoals();
fixNotes();
fixTasks();
