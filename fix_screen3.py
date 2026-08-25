with open("src/components/ScreenAI.tsx", "r") as f:
    text = f.read()

# Replace parsedTask with draftTasks
text = text.replace("const [parsedTask, setParsedTask] = useState<any>(null);", "const [draftTasks, setDraftTasks] = useState<any[]>([]);")
text = text.replace("if (parsedTask) {", "if (draftTasks.length > 0) {")
text = text.replace("setParsedTask(null);", "setDraftTasks([]);")

# Save all tasks
old_save = """    if (draftTasks.length > 0) {
      addTask({
        title: parsedTask.title || 'Nova Tarefa',
        description: '',
        startTime: '',
        duration: 0,
        category: parsedTask.category || 'Pessoal',
        date: parsedTask.date || '',
        priority: parsedTask.priority || 'Média',
        effort: '',
        location: '',
        subtasks: [],
        images: [],
        style: 'light',
        completed: false
      });
      setAiState('idle');
      setDraftTasks([]);
      setTranscript('');
      onNavigate('home');
    }"""

new_save = """    if (draftTasks.length > 0) {
      draftTasks.forEach(task => {
        addTask({
          title: task.title || 'Nova Tarefa',
          description: '',
          startTime: '',
          duration: 0,
          category: task.category || 'Pessoal',
          date: task.date || '',
          priority: task.priority || 'Média',
          effort: '',
          location: '',
          subtasks: [],
          images: [],
          style: 'light',
          completed: false
        });
      });
      setAiState('idle');
      setDraftTasks([]);
      setTranscript('');
      onNavigate('home');
    }"""
text = text.replace(old_save, new_save)

# API call
old_api = """          const response = await fetch('/api/gemini/parse-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64Audio, mimeType: audioBlob.type })
          });
          if (!response.ok) throw new Error("Erro na API");
          
          const data = await response.json();
          setParsedTask(data);"""

new_api = """          const response = await fetch('/api/gemini/parse-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64Audio, mimeType: audioBlob.type, currentTasks: draftTasks })
          });
          if (!response.ok) throw new Error("Erro na API");
          
          const data = await response.json();
          setDraftTasks(data.tasks || []);"""
text = text.replace(old_api, new_api)

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(text)
