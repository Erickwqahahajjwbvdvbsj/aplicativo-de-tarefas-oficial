const fs = require('fs');
let content = fs.readFileSync('src/hooks/useNotes.ts', 'utf8');
content = content.replace(/handleFirestoreError\(error, OperationType\.WRITE, \`notes\/\$\{newNoteId\}\`\);\s*\}\s*\}\s*\};\s*const updateNote = /g, `handleFirestoreError(error, OperationType.WRITE, \`notes/\${newNoteId}\`);\n      }\n    }\n    return newNote;\n  };\n\n  const updateNote = `);
fs.writeFileSync('src/hooks/useNotes.ts', content);
