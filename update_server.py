import sys

with open("server.ts", "r") as f:
    content = f.read()

old_api_code = """      let promptText = "Extraia o título da tarefa, a data sugerida (se houver, no formato YYYY-MM-DD), a categoria ('Trabalho', 'Pessoal', 'Estudos') e a prioridade ('Alta', 'Média', 'Baixa', ou vazia).";

      if (audio) {
        contents = [
          { inlineData: { data: audio, mimeType: mimeType || "audio/webm" } },
          promptText
        ];
      } else if (text) {
        contents = [ `Texto: "${text}"`, promptText ];
      } else {
        return res.status(400).json({ error: "Missing text or audio in request body" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "O título resumido e claro da tarefa." },
              date: { type: Type.STRING, description: "A data da tarefa no formato YYYY-MM-DD, se mencionada." },
              category: { type: Type.STRING, description: "Categoria: Trabalho, Pessoal, Estudos. Padrão: vazio" },
              priority: { type: Type.STRING, description: "Prioridade: Alta, Média, Baixa. Padrão: Média" }
            },
            required: ["title"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);"""

new_api_code = """      const { currentTasks = [] } = req.body;
      
      let promptText = `O usuário está gerenciando uma lista de tarefas por voz.
Ele pode pedir para adicionar, editar ou excluir tarefas.
Lista atual: ${JSON.stringify(currentTasks)}.

Sua saída deve ser a LISTA ATUALIZADA COMPLETA de tarefas, como um array de objetos.
Mantenha o \`id\` das tarefas existentes. Se criar uma nova, gere um \`id\` único (ex: string numérica).
Cada tarefa tem: id, title, date (YYYY-MM-DD), category (Trabalho, Pessoal, Estudos), priority (Alta, Média, Baixa).`;

      if (audio) {
        contents = [
          { inlineData: { data: audio, mimeType: mimeType || "audio/webm" } },
          promptText
        ];
      } else if (text) {
        contents = [ `Texto: "${text}"`, promptText ];
      } else {
        return res.status(400).json({ error: "Missing text or audio in request body" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  date: { type: Type.STRING },
                  category: { type: Type.STRING },
                  priority: { type: Type.STRING }
                },
                required: ["id", "title"]
            }
          }
        }
      });

      let parsed = JSON.parse(response.text || "[]");
      if (!Array.isArray(parsed)) parsed = [parsed];
      res.json({ tasks: parsed });"""

if old_api_code in content:
    content = content.replace(old_api_code, new_api_code)
else:
    print("Could not find old_api_code in server.ts")

with open("server.ts", "w") as f:
    f.write(content)
