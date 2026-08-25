const fs = require('fs');
let code = fs.readFileSync('src/components/AuthUI.tsx', 'utf8');

const regex = /<div>\s*<p className="font-semibold text-\[16px\] text-white">Assistente Zapt AI<\/p>\s*<p className="text-\[#c4c4c4\] text-\[15px\] leading-relaxed">Não quer digitar\? É só falar\. O Zapt AI transforma sua fala em uma prévia de tarefa que você pode revisar e editar antes de adicioná-la à sua lista\.<\/p>\s*<\/div>/;

code = code.replace(regex, '');

fs.writeFileSync('src/components/AuthUI.tsx', code);
console.log('AuthUI patched successfully.');
