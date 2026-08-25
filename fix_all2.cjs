const fs = require('fs');

let content = fs.readFileSync('src/hooks/useTasks.ts', 'utf8');
content = content.replace(/cleanDocData\.createdAt = serverTimestamp\(\); \/\/ keep it as local string/g, "cleanDocData.createdAt = new Date().toISOString();");
fs.writeFileSync('src/hooks/useTasks.ts', content);

content = fs.readFileSync('src/hooks/useGoals.ts', 'utf8');
content = content.replace(/cleanGoal\.createdAt = serverTimestamp\(\);/g, "cleanGoal.createdAt = new Date().toISOString();");
fs.writeFileSync('src/hooks/useGoals.ts', content);

content = fs.readFileSync('src/hooks/useNotes.ts', 'utf8');
content = content.replace(/cleanPayload\.createdAt = serverTimestamp\(\);/g, "cleanPayload.createdAt = new Date().toISOString();");
content = content.replace(/cleanPayload\.updatedAt = serverTimestamp\(\);/g, "cleanPayload.updatedAt = new Date().toISOString();");
fs.writeFileSync('src/hooks/useNotes.ts', content);
