with open("src/components/ScreenAI.tsx", "r") as f:
    text = f.read()

old_add_task = """      addTask({
        title: parsedTask.title || 'Nova Tarefa',
        category: parsedTask.category || 'Pessoal',
        date: parsedTask.date || undefined,
        priority: parsedTask.priority || 'Média',
        completed: false
      });"""

new_add_task = """      addTask({
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
      });"""

if old_add_task in text:
    text = text.replace(old_add_task, new_add_task)
else:
    print("Could not find the addTask call!")
    
with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(text)
