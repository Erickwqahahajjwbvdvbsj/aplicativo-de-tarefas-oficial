const fs = require('fs');

let c = fs.readFileSync('src/hooks/useTasks.ts', 'utf8');
c = c.replace(/localStorage\.setItem\('@app_tasks_cache'/g, "// localStorage.setItem('@app_tasks_cache'");
c = c.replace(/localStorage\.removeItem\('@app_tasks_cache'/g, "// localStorage.removeItem('@app_tasks_cache'");
fs.writeFileSync('src/hooks/useTasks.ts', c);

let g = fs.readFileSync('src/hooks/useGoals.ts', 'utf8');
g = g.replace(/localStorage\.setItem\('@app_goals_cache'/g, "// localStorage.setItem('@app_goals_cache'");
g = g.replace(/localStorage\.removeItem\('@app_goals_cache'/g, "// localStorage.removeItem('@app_goals_cache'");
fs.writeFileSync('src/hooks/useGoals.ts', g);

let n = fs.readFileSync('src/hooks/useNotes.ts', 'utf8');
n = n.replace(/localStorage\.setItem\('@app_notes_cache'/g, "// localStorage.setItem('@app_notes_cache'");
n = n.replace(/localStorage\.removeItem\('@app_notes_cache'/g, "// localStorage.removeItem('@app_notes_cache'");
fs.writeFileSync('src/hooks/useNotes.ts', n);
