const fs = require('fs');

let c = fs.readFileSync('src/hooks/useTasks.ts', 'utf8');
c = c.replace(/const cleanDocData = JSON\.parse\(JSON\.stringify\(docData\)\);\s*cleanDocData\.createdAt = new Date\(\)\.toISOString\(\);\s*await setDoc/g, "const cleanDocData = JSON.parse(JSON.stringify(docData));\n        await setDoc");
fs.writeFileSync('src/hooks/useTasks.ts', c);

let g = fs.readFileSync('src/hooks/useGoals.ts', 'utf8');
g = g.replace(/const cleanGoal = JSON\.parse\(JSON\.stringify\(newGoal\)\);\s*cleanGoal\.createdAt = new Date\(\)\.toISOString\(\);\s*await setDoc/g, "const cleanGoal = JSON.parse(JSON.stringify(newGoal));\n      await setDoc");
fs.writeFileSync('src/hooks/useGoals.ts', g);

let n = fs.readFileSync('src/hooks/useNotes.ts', 'utf8');
n = n.replace(/const cleanPayload = JSON\.parse\(JSON\.stringify\(payload\)\);\s*cleanPayload\.createdAt = new Date\(\)\.toISOString\(\);\s*cleanPayload\.updatedAt = new Date\(\)\.toISOString\(\);\s*await setDoc/g, "const cleanPayload = JSON.parse(JSON.stringify(payload));\n        await setDoc");
fs.writeFileSync('src/hooks/useNotes.ts', n);
