const fs = require('fs');

let content = fs.readFileSync('src/hooks/useTasks.ts', 'utf8');
content = content.replace(/\/\/ cleanDocData\.createdAt = new Date\(\)\.toISOString\(\);/g, "cleanDocData.createdAt = new Date().toISOString();");
fs.writeFileSync('src/hooks/useTasks.ts', content);

content = fs.readFileSync('src/hooks/useGoals.ts', 'utf8');
content = content.replace(/\/\/ cleanGoal\.createdAt = new Date\(\)\.toISOString\(\);/g, "cleanGoal.createdAt = new Date().toISOString();");
fs.writeFileSync('src/hooks/useGoals.ts', content);

content = fs.readFileSync('src/hooks/useNotes.ts', 'utf8');
content = content.replace(/\/\/ cleanPayload\.createdAt = new Date\(\)\.toISOString\(\);/g, "cleanPayload.createdAt = new Date().toISOString();");
content = content.replace(/\/\/ cleanPayload\.updatedAt = new Date\(\)\.toISOString\(\);/g, "cleanPayload.updatedAt = new Date().toISOString();");
fs.writeFileSync('src/hooks/useNotes.ts', content);
