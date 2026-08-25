import re

with open("server.ts", "r") as f:
    text = f.read()

old_prompt = """      let promptText = `O usuário está na tela de chat criando um rascunho de tarefas.
Ele pode pedir para ADICIONAR, EDITAR ou EXCLUIR tarefas que já estão na lista.
A lista atual de tarefas no rascunho é: ${JSON.stringify(currentTasks)}.

Regras:
1. Se o usuário quiser ADICIONAR uma tarefa, adicione-a à lista.
2. Se o usuário quiser EDITAR uma tarefa existente (ex: mudar o nome, data ou prioridade), encontre a tarefa mais parecida na lista atual e modifique-a. Mantenha o MESMO 'id'.
3. Se o usuário quiser EXCLUIR/REMOVER uma tarefa, retire-a da lista.
4. O limite é de 20 tarefas na lista.
5. Se for criar uma nova tarefa, gere um 'id' único (ex: timestamp ou string numérica).

Sua saída deve ser SEMPRE a LISTA ATUALIZADA COMPLETA das tarefas finais.
Cada tarefa deve conter: id, title, date (YYYY-MM-DD ou vazio), category ('Trabalho', 'Pessoal', 'Estudos' ou vazio), priority ('Alta', 'Média', 'Baixa' ou vazio).`;"""

new_prompt = """      let promptText = `O usuário está na tela de chat criando um rascunho de tarefas.
Ele pode pedir para ADICIONAR, EDITAR ou EXCLUIR tarefas que já estão no rascunho. O usuário não tem acesso às tarefas que já estão no banco de dados.
A lista atual de tarefas no rascunho é: ${JSON.stringify(currentTasks)}.

Regras:
1. Se o usuário quiser ADICIONAR uma tarefa, adicione-a à lista.
2. Se o usuário quiser EDITAR uma tarefa existente no rascunho (ex: mudar o nome, data, prioridade, categoria, descrição), encontre a tarefa mais parecida na lista atual e modifique-a. Mantenha o MESMO 'id'.
3. Se o usuário quiser EXCLUIR/REMOVER uma tarefa do rascunho, retire-a da lista.
4. O limite é de 20 tarefas no rascunho.
5. Se for criar uma nova tarefa, gere um 'id' único (ex: timestamp numérico).
6. Se o usuário pedir para criar uma tarefa MAS NÃO ESPECIFICAR O TÍTULO (ex: "adicione uma tarefa", "crie um lembrete"), o título DEVE SER OBRIGATORIAMENTE "Nova tarefa". Ele poderá editar o título depois.
7. A tarefa pode ter os seguintes campos opcionais: description, startTime, endTime, durationStr, duration (em minutos, número), category, date (YYYY-MM-DD), priority, effort, location, reminderEnabled (boolean), reminderTime, reminderCustomMinutes.
8. PREENCHA APENAS OS CAMPOS QUE O USUÁRIO EXPLICITAMENTE PEDIR. Para os campos não mencionados, deixe-os vazios ("" ou omitidos, ou false/0). Não assuma prioridade, categoria, etc se não for pedido.

Sua saída deve ser SEMPRE a LISTA ATUALIZADA COMPLETA das tarefas finais.`;"""

text = text.replace(old_prompt, new_prompt)

old_schema = """                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  date: { type: Type.STRING },
                  category: { type: Type.STRING },
                  priority: { type: Type.STRING }
                },
                required: ["id", "title"]"""

new_schema = """                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  startTime: { type: Type.STRING },
                  endTime: { type: Type.STRING },
                  durationStr: { type: Type.STRING },
                  duration: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                  date: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  effort: { type: Type.STRING },
                  location: { type: Type.STRING },
                  reminderEnabled: { type: Type.BOOLEAN },
                  reminderTime: { type: Type.STRING },
                  reminderCustomMinutes: { type: Type.STRING }
                },
                required: ["id", "title"]"""

text = text.replace(old_schema, new_schema)

with open("server.ts", "w") as f:
    f.write(text)
