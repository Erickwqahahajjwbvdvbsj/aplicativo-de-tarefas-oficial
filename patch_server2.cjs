const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/import \{ GoogleGenAI, Type \} from "@google\/genai";\n/, '');
code = code.replace(/import \{ GoogleGenAI, Type \} from '@google\/genai';\n/, '');

fs.writeFileSync('server.ts', code);
