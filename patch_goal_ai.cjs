const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoalAI.tsx', 'utf8');

// replace suggestions
code = code.replace(/const SUGGESTIONS = \[[^\]]+\];/, `const SUGGESTIONS = [
  "Quero uma jornada de 3 meses para aprender a programar.",
  "Preciso de um plano para emagrecer 5kg em 2 meses.",
  "Quero organizar meu casamento para o ano que vem.",
  "Preciso criar uma rotina de estudos para o vestibular.",
  "Quero planejar uma viagem para a Europa em 6 meses.",
  "Preciso de uma jornada para ler 10 livros este ano.",
  "Quero criar um projeto de aplicativo em 4 semanas.",
  "Preciso de um passo a passo para aprender inglês fluente.",
  "Quero um cronograma para treinar para uma maratona.",
  "Preciso estruturar a abertura da minha nova empresa."
];`);

// disable backend saving for now (visual only)
code = code.replace(/const response = await fetch\('\/api\/gemini\/parse-task'/g, `// Visual only for now\n          /* const response = await fetch('/api/gemini/parse-goal'`);
code = code.replace(/const data = await response\.json\(\);/g, `const data = { tasks: [] }; */\n          const data = { tasks: [] };`);

fs.writeFileSync('src/components/ScreenGoalAI.tsx', code);
console.log("Patched!");
