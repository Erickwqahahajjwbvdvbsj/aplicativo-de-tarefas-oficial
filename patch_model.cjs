const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/"gemini-3.1-flash-lite"/g, '"gemini-3.5-flash-lite"');
code = code.replace(/'gemini-3.1-flash-lite'/g, '"gemini-3.5-flash-lite"');

fs.writeFileSync('server.ts', code);
console.log('Model updated to gemini-3.5-flash-lite');
