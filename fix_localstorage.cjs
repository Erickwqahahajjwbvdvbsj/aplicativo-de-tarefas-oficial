const fs = require('fs');

let c = fs.readFileSync('src/hooks/useTasks.ts', 'utf8');
c = c.replace(/localStorage\.setItem\("@app_tasks_cache", JSON\.stringify\(newTasks\)\);/g, "localStorage.removeItem('@app_tasks_cache'); localStorage.setItem('@app_tasks_cache', JSON.stringify(newTasks));");
fs.writeFileSync('src/hooks/useTasks.ts', c);

let g = fs.readFileSync('src/hooks/useGoals.ts', 'utf8');
g = g.replace(/localStorage\.setItem\("@app_goals_cache", JSON\.stringify\(newGoals\)\);/g, "localStorage.removeItem('@app_goals_cache'); localStorage.setItem('@app_goals_cache', JSON.stringify(newGoals));");
fs.writeFileSync('src/hooks/useGoals.ts', g);

let n = fs.readFileSync('src/hooks/useNotes.ts', 'utf8');
n = n.replace(/localStorage\.setItem\("@app_notes_cache", JSON\.stringify\(sorted\)\);/g, "localStorage.removeItem('@app_notes_cache'); localStorage.setItem('@app_notes_cache', JSON.stringify(sorted));");
fs.writeFileSync('src/hooks/useNotes.ts', n);
