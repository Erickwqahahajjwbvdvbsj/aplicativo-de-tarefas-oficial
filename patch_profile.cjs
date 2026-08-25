const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenProfile.tsx', 'utf8');

// 1. Remove the Zapt AI settings button from main menu
code = code.replace(/<CategoryButton title="Configurações do Zapt AI" onClick=\{\(\) => setActiveSubScreen\('settings'\)\} \/>\s*/, '');

// 2. Remove the activeSubScreen === 'settings' block
// We need to replace the block carefully. I'll use a regex matching `{activeSubScreen === 'settings' && (` up to `)}` before `{activeSubScreen === 'sensitiveData' && (`.
const settingsRegex = /\{activeSubScreen === 'settings' && \([\s\S]*?\}\)\}\s*\{activeSubScreen === 'sensitiveData' && \(/;
code = code.replace(settingsRegex, "{activeSubScreen === 'sensitiveData' && (");

fs.writeFileSync('src/components/ScreenProfile.tsx', code);
console.log('ScreenProfile patched successfully.');
