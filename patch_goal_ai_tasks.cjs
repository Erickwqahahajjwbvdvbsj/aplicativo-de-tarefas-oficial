const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoalAI.tsx', 'utf8');

code = code.replace(/setDraftGoals\(\(data\.tasks \|\| \[\]\)\.slice\(0, 20\)\);/g, `setDraftGoals((data.goals || []).slice(0, 20));`);
code = code.replace(/if \(data\.limitExceeded \|\| \(data\.tasks && data\.tasks\.length > 20\)\) \{/g, `if (data.limitExceeded || (data.goals && data.goals.length > 20)) {`);
code = code.replace(/O assistente só consegue colocar 20 tarefas/g, `O assistente só consegue colocar 20 itens`);
code = code.replace(/estas 20 tarefas/g, `estes 20 itens`);

fs.writeFileSync('src/components/ScreenGoalAI.tsx', code);
console.log('Fixed tasks -> goals in ScreenGoalAI');
