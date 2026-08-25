const fs = require('fs');
let content = fs.readFileSync('src/hooks/useNotes.ts', 'utf8');
content = content.replace(/if \(!isOnlyPinToggle\) \{\s*cleanPayload\.updatedAt = serverTimestamp\(\);\s*\}\s*if \(!isOnlyPinToggle\) \{\s*cleanPayload\.updatedAt = serverTimestamp\(\);\s*\}/g, `if (!isOnlyPinToggle) {\n          cleanPayload.updatedAt = serverTimestamp();\n        }`);
fs.writeFileSync('src/hooks/useNotes.ts', content);
