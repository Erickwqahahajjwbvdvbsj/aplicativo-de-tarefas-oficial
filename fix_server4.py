import re

with open("server.ts", "r") as f:
    text = f.read()

old_schema = """        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
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
                required: ["id", "title"]
            }
          }
        }
      });

      let parsed = JSON.parse(response.text || "[]");
      if (!Array.isArray(parsed)) parsed = [parsed];
      res.json({ tasks: parsed });"""

new_schema = """        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                tasks: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
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
                        required: ["id", "title"]
                    }
                },
                noSpeechDetected: { 
                    type: Type.BOOLEAN, 
                    description: "Retorne true APENAS se o áudio estiver completamente vazio/ininteligível ou se não houver NENHUMA intenção ou comando relacionado a tarefas no texto." 
                }
            },
            required: ["tasks"]
          }
        }
      });

      let parsed = JSON.parse(response.text || "{}");
      let tasks = Array.isArray(parsed.tasks) ? parsed.tasks : (Array.isArray(parsed) ? parsed : []);
      res.json({ tasks, noSpeechDetected: !!parsed.noSpeechDetected });"""

text = text.replace(old_schema, new_schema)

with open("server.ts", "w") as f:
    f.write(text)
