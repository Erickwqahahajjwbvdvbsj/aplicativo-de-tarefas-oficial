const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldStr = `2. ETAPA (Stage): Dentro de uma Jornada. Pode ter 'title', 'description', 'startDate', 'startTime', 'endDate', 'endTime' e 'tasks' (tarefas).
3. TAREFA (Task): Dentro de uma Etapa. Pode ter 'title' e 'description'.

REGRAS DE EXTRAÇÃO E INTELIGÊNCIA:
1. INTENÇÃO CLARA: Compreenda comandos orgânicos. Exemplo: "Crie um objetivo para viajar pra Europa, a primeira etapa é passaporte, e a tarefa é agendar no site". Você deve criar: Jornada(Europa) -> Etapa(Passaporte) -> Tarefa(Agendar no site).
2. TÍTULOS E DESCRIÇÕES: Seja conciso nos títulos (máx 100 caracteres) com a primeira letra maiúscula. Se o usuário falar uma explicação mais longa, coloque o resumo no 'title' e os detalhes na 'description' (tanto para jornada, etapa ou tarefa). O usuário também pode pedir para "mudar o título" ou "adicionar descrição".
3. EDIÇÃO AVANÇADA: Se o usuário pedir "Mude o título da tarefa X para Y", "Adicione a descrição Z na etapa W", encontre o item exato na lista atual e modifique.
4. DATAS E HORÁRIOS:`;

const newStr = `2. ETAPA (Stage): Dentro de uma Jornada. Pode ter APENAS 'title', 'startDate', 'startTime', 'endDate', 'endTime' e 'tasks' (tarefas). IMPORTANTE: ETAPAS NÃO POSSUEM CAMPO DE DESCRIÇÃO.
3. TAREFA (Task): Dentro de uma Etapa. Pode ter 'title' e 'description'.

REGRAS DE EXTRAÇÃO E INTELIGÊNCIA:
1. INTENÇÃO CLARA: Compreenda comandos orgânicos. Exemplo: "Crie um objetivo para viajar pra Europa, a primeira etapa é passaporte, e a tarefa é agendar no site". Você deve criar: Jornada(Europa) -> Etapa(Passaporte) -> Tarefa(Agendar no site).
2. TÍTULOS E DESCRIÇÕES: Seja conciso nos títulos (máx 100 caracteres) com a primeira letra maiúscula. Se o usuário falar uma explicação mais longa, coloque o resumo no 'title' e os detalhes na 'description' (APENAS para jornada ou tarefa). NUNCA coloque descrição em uma etapa.
3. EDIÇÃO AVANÇADA: Se o usuário pedir "Mude o título da tarefa X para Y", encontre o item exato na lista atual e modifique.
4. DATAS E HORÁRIOS:`;

code = code.replace(oldStr, newStr);

const oldStr2 = `8. NÃO INVENTE: Não crie jornadas ou tarefas que não foram pedidas, preencha a estrutura rigorosamente com o que o usuário quer.`;
const newStr2 = `8. NÃO INVENTE: Não crie jornadas ou tarefas que não foram pedidas, preencha a estrutura rigorosamente com o que o usuário quer.
9. CAPACIDADES LIMITADAS: Se o usuário pedir algo fora das suas capacidades (ex: "adicione uma imagem", "toque uma música", "grave um vídeo"), defina 'unsupportedRequest: true' na resposta JSON, e extraia apenas a parte textual útil se houver.`;

code = code.replace(oldStr2, newStr2);
fs.writeFileSync('server.ts', code);
console.log('Server rules updated.');
