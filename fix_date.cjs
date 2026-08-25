const fs = require('fs');

let t = fs.readFileSync('src/hooks/useTasks.ts', 'utf8');
t = t.replace(/cleanDocData\.createdAt = serverTimestamp\(\);/g, `// cleanDocData.createdAt = serverTimestamp(); // keep it as local string`);
fs.writeFileSync('src/hooks/useTasks.ts', t);

let g = fs.readFileSync('src/hooks/useGoals.ts', 'utf8');
g = g.replace(/cleanGoal\.createdAt = serverTimestamp\(\);/g, `// cleanGoal.createdAt = serverTimestamp();`);
fs.writeFileSync('src/hooks/useGoals.ts', g);

let n = fs.readFileSync('src/hooks/useNotes.ts', 'utf8');
n = n.replace(/cleanPayload\.createdAt = serverTimestamp\(\);/g, `// cleanPayload.createdAt = serverTimestamp();`);
n = n.replace(/cleanPayload\.updatedAt = serverTimestamp\(\);/g, `// cleanPayload.updatedAt = serverTimestamp();`);
fs.writeFileSync('src/hooks/useNotes.ts', n);
