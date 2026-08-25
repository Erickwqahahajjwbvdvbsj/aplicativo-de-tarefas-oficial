const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  `- Hora ('startTime', 'endTime'): formato HH:MM (NUNCA com segundos). Ex: "às 14h" = "14:00".`,
  `- Hora ('startTime', 'endTime'): formato HH:MM (NUNCA com segundos). Ex: "às 14h" = "14:00".
   - PROIBIÇÃO CRÍTICA SOBRE DATAS: NUNCA crie, suponha ou preencha qualquer data ('startDate', 'endDate') ou horário ('startTime', 'endTime') se o usuário NÃO tiver expressamente pedido. Se ele pedir apenas "Crie uma jornada XYZ", deixe todos os campos de data e hora VAZIOS/INEXISTENTES.`
);

fs.writeFileSync('server.ts', code);
console.log('Prompt dates updated.');
