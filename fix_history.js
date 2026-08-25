const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenTaskHistory.tsx', 'utf8');

code = code.replace(/import \{ useGoals \} from '\.\.\/hooks\/useGoals';\n/, '');
code = code.replace(/  const \{ goals \} = useGoals\(\);\n/, '');
code = code.replace(/  const goalTaskIds = new Set<string>\(\);\n/, '');
code = code.replace(/  goals\.forEach\(g => \(g\.taskIds \|\| \[\]\)\.forEach\(tid => goalTaskIds\.add\(tid\)\)\);\n\n/, '');
code = code.replace(/return diffDays <= 7 \|\| goalTaskIds\.has\(task\.id\);/, 'return diffDays <= 7;');

fs.writeFileSync('src/components/ScreenTaskHistory.tsx', code);
