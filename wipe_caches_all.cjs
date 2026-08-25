const fs = require('fs');

let c = fs.readFileSync('src/hooks/useTasks.ts', 'utf8');
c = c.replace(/const stored = localStorage\.getItem\('@app_tasks_cache'\);/g, "const stored = null; // localStorage.getItem('@app_tasks_cache');");
fs.writeFileSync('src/hooks/useTasks.ts', c);

let g = fs.readFileSync('src/hooks/useGoals.ts', 'utf8');
g = g.replace(/const stored = localStorage\.getItem\('@app_goals_cache'\);/g, "const stored = null; // localStorage.getItem('@app_goals_cache');");
fs.writeFileSync('src/hooks/useGoals.ts', g);

let n = fs.readFileSync('src/hooks/useNotes.ts', 'utf8');
n = n.replace(/const stored = localStorage\.getItem\('@app_notes_cache'\);/g, "const stored = null; // localStorage.getItem('@app_notes_cache');");
fs.writeFileSync('src/hooks/useNotes.ts', n);
