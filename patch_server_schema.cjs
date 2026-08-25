const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldSchemaStr = `                              properties: {
                                id: { type: Type.STRING },
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                startDate: { type: Type.STRING },
                                startTime: { type: Type.STRING },
                                endDate: { type: Type.STRING },
                                endTime: { type: Type.STRING },
                                tasks: {`;

const newSchemaStr = `                              properties: {
                                id: { type: Type.STRING },
                                title: { type: Type.STRING },
                                startDate: { type: Type.STRING },
                                startTime: { type: Type.STRING },
                                endDate: { type: Type.STRING },
                                endTime: { type: Type.STRING },
                                tasks: {`;

code = code.replace(oldSchemaStr, newSchemaStr);

const oldPropsTail = `                noSpeechDetected: { type: Type.BOOLEAN },
                limitExceeded: { type: Type.BOOLEAN }
            }
          }
        }
      });`;

const newPropsTail = `                noSpeechDetected: { type: Type.BOOLEAN },
                limitExceeded: { type: Type.BOOLEAN },
                unsupportedRequest: { type: Type.BOOLEAN }
            }
          }
        }
      });`;

code = code.replace(oldPropsTail, newPropsTail);

fs.writeFileSync('server.ts', code);
console.log('Schema updated.');
