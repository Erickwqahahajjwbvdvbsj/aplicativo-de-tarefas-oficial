const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Find start of parse-task route
const taskStart = code.indexOf('app.post("/api/gemini/parse-task"');
if (taskStart !== -1) {
  // Find the next route start
  const goalStart = code.indexOf('app.post("/api/gemini/parse-goal"', taskStart);
  if (goalStart !== -1) {
    const endOfGoalRoute = code.indexOf('if (process.env.NODE_ENV !== "production")', goalStart);
    if (endOfGoalRoute !== -1) {
      code = code.substring(0, taskStart) + code.substring(endOfGoalRoute);
    }
  }
}

// Remove GoogleGenAI import
code = code.replace(/import \{ GoogleGenAI, Type \} from '@google\/genai';\n/, '');

fs.writeFileSync('server.ts', code);
console.log('Server routes removed.');
