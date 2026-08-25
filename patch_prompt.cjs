const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldPrompt = `      let promptText = \`O usuário está na tela de chat criando um rascunho de Jornadas (Goals) e Etapas (Stages) com tarefas.
Ele pode pedir para ADICIONAR, EDITAR ou EXCLUIR jornadas no rascunho. O usuário não tem acesso às jornadas que já estão no banco de dados.
A lista atual de jornadas no rascunho é: \${JSON.stringify(currentGoals)}.

INFORMAÇÃO IMPORTANTE DE CONTEXTO:
- Data atual (hoje): \${currentDateString} (Ano atual: \${currentYear}). Considere ESTA data rigorosamente ao interpretar "hoje", "amanhã", dias da semana ou datas específicas ditas pelo usuário.

Regras de Estrutura:
1. Uma Jornada (Goal) pode ter um título, descrição, startDate, startTime, endDate, endTime e stages (etapas).
2. Cada Etapa (Stage) pode ter título, descrição, startDate, startTime, endDate, endTime, e tasks (tarefas).
3. Cada Tarefa (Task) dentro de uma etapa tem apenas título e descrição opcionais, mas essencialmente título.
4. Se o usuário pedir para criar uma Jornada sem detalhar etapas, crie a Jornada com stages vazios []. 
5. Se o usuário pedir para criar uma Jornada, etapas e tarefas de uma vez, obedeça à estrutura hierárquica (Jornada > Etapas > Tarefas).

Regras de Comandos:
1. Se o usuário quiser ADICIONAR, adicione a Jornada à lista.
2. Se quiser EDITAR (ex: adicionar uma etapa a uma jornada recém citada), encontre a jornada correta e modifique-a.
3. Se quiser EXCLUIR, retire a jornada ou a etapa correspondente.
4. Gere um 'id' único (ex: timestamp numérico string) para cada Jornada, cada Etapa e cada Tarefa recém criada.
5. Analise a intenção para gerar um título curto e apropriado.

Datas e Horas:
- Formato de data ('startDate', 'endDate'): YYYY-MM-DD
- Formato de hora ('startTime', 'endTime'): HH:MM
- Se especificar prazos para a Jornada ou para a Etapa, adicione nos respectivos níveis.

CRÍTICO (ANTI-ALUCINAÇÃO): Se o áudio contiver apenas ruído de fundo, estática ou falas ininteligíveis, você DEVE retornar 'noSpeechDetected: true' e manter a lista INTACTA.

Sua saída deve ser SEMPRE a LISTA ATUALIZADA COMPLETA de jornadas finais, mesmo se você só editou uma.\`;`;

const newPrompt = `      let promptText = \`O usuário está interagindo com um assistente de voz/texto para criar e gerenciar um rascunho de Jornadas (Goals) e Etapas (Stages) com tarefas.
Ele pode usar termos variados como "Objetivo", "Jornada", "Projeto" ou "Meta" — todos devem ser tratados como uma Jornada (Goal).
Ele pode pedir para CRIAR, ADICIONAR, EDITAR, ATUALIZAR, REMOVER ou EXCLUIR jornadas, etapas ou tarefas no rascunho atual.
A lista atual de jornadas no rascunho é: \${JSON.stringify(currentGoals)}. (Se estiver vazia, ele quer criar do zero).

INFORMAÇÃO IMPORTANTE DE CONTEXTO:
- Data atual (hoje): \${currentDateString} (Ano atual: \${currentYear}). Use esta data como base para interpretar "hoje", "amanhã", dias da semana ou datas relativas.

REGRAS ESTRUTURAIS E HIERARQUIA:
1. JORNADA (Goal): O nível mais alto. Pode ter 'title', 'description', 'startDate', 'startTime', 'endDate', 'endTime' e 'stages' (etapas).
2. ETAPA (Stage): Dentro de uma Jornada. Pode ter 'title', 'description', 'startDate', 'startTime', 'endDate', 'endTime' e 'tasks' (tarefas).
3. TAREFA (Task): Dentro de uma Etapa. Pode ter 'title' e 'description'.

REGRAS DE EXTRAÇÃO E INTELIGÊNCIA:
1. INTENÇÃO CLARA: Compreenda comandos orgânicos. Exemplo: "Crie um objetivo para viajar pra Europa, a primeira etapa é passaporte, e a tarefa é agendar no site". Você deve criar: Jornada(Europa) -> Etapa(Passaporte) -> Tarefa(Agendar no site).
2. TÍTULOS E DESCRIÇÕES: Seja conciso nos títulos (máx 100 caracteres) com a primeira letra maiúscula. Se o usuário falar uma explicação mais longa, coloque o resumo no 'title' e os detalhes na 'description' (tanto para jornada, etapa ou tarefa). O usuário também pode pedir para "mudar o título" ou "adicionar descrição".
3. EDIÇÃO AVANÇADA: Se o usuário pedir "Mude o título da tarefa X para Y", "Adicione a descrição Z na etapa W", encontre o item exato na lista atual e modifique.
4. DATAS E HORÁRIOS:
   - Data ('startDate', 'endDate'): formato YYYY-MM-DD. Se disser "para o dia 15", calcule o YYYY-MM-DD exato.
   - Hora ('startTime', 'endTime'): formato HH:MM (NUNCA com segundos). Ex: "às 14h" = "14:00".
   - Prazos ("prazo final até", "termina em"): Preencha 'endDate' e/ou 'endTime' (na jornada ou etapa aplicável).
   - Início ("começa dia X", "início às"): Preencha 'startDate' e/ou 'startTime'.
5. IDS ÚNICOS: Sempre que criar uma nova Jornada, Etapa ou Tarefa, gere um 'id' único (ex: string de timestamp numérico longo).
6. MODIFICAÇÃO DIRECIONADA: Se o usuário falar "adicione uma tarefa X na etapa Y", coloque dentro de 'tasks' daquela etapa. Se a etapa não existir, crie a etapa antes.
7. CRÍTICO (ANTI-ALUCINAÇÃO): Se o áudio contiver apenas ruído, silêncio ou texto ininteligível sem nenhuma intenção, retorne 'noSpeechDetected: true' e mantenha a lista INTACTA.
8. NÃO INVENTE: Não crie jornadas ou tarefas que não foram pedidas, preencha a estrutura rigorosamente com o que o usuário quer.

SAÍDA:
Retorne SEMPRE a LISTA COMPLETA e ATUALIZADA de jornadas (goals) no formato JSON final, seguindo rigorosamente o esquema. Se a lista resultante ficar vazia, retorne [].\`;`;

code = code.replace(oldPrompt, newPrompt);
fs.writeFileSync('server.ts', code);
console.log('Prompt updated successfully.');
