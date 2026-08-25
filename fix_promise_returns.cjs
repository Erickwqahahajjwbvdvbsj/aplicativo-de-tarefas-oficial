const fs = require('fs');

// Fix goals
let contentGoals = fs.readFileSync('src/hooks/useGoals.ts', 'utf8');
contentGoals = contentGoals.replace(/handleFirestoreError\(err, OperationType\.CREATE, \`goals\/\$\{goalId\}\`\);\s*\}\s*\};/,
  "handleFirestoreError(err, OperationType.CREATE, `goals/${goalId}`);\n    }\n    return newGoal;\n  };");
fs.writeFileSync('src/hooks/useGoals.ts', contentGoals);

// Fix tasks
let contentTasks = fs.readFileSync('src/hooks/useTasks.ts', 'utf8');
contentTasks = contentTasks.replace(/handleFirestoreError\(err, OperationType\.CREATE, \`tasks\/\$\{taskId\}\`\);\s*\}\s*\};/,
  "handleFirestoreError(err, OperationType.CREATE, `tasks/${taskId}`);\n    }\n    return newTask;\n  };");
fs.writeFileSync('src/hooks/useTasks.ts', contentTasks);
