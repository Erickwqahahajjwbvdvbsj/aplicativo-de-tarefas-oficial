import re

with open("server.ts", "r") as f:
    text = f.read()

old_prompt = """      let promptText = `O usuário está gerenciando uma lista de tarefas por voz.
Ele pode pedir para adicionar, editar ou excluir tarefas.
Lista atual: ${JSON.stringify(currentTasks)}.

Sua saída deve ser a LISTA ATUALIZADA COMPLETA de tarefas, como um array de objetos.
Mantenha o \`id\` das tarefas existentes. Se criar uma nova, gere um \`id\` único (ex: string numérica).
Cada tarefa tem: id, title, date (YYYY-MM-DD), category (Trabalho, Pessoal, Estudos), priority (Alta, Média, Baixa).`;"""

new_prompt = """      let promptText = `O usuário está na tela de chat criando um rascunho de tarefas.
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

if old_prompt in text:
    text = text.replace(old_prompt, new_prompt)

with open("server.ts", "w") as f:
    f.write(text)
