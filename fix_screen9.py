with open("src/components/ScreenAI.tsx", "r") as f:
    text = f.read()

old_save = """        addTask({
          title: task.title || 'Nova Tarefa',
          description: '',
          startTime: '',
          endTime: '',
          durationStr: '',
          duration: 0,
          category: task.category || 'Pessoal',
          date: task.date || '',
          priority: task.priority || 'Média',
          effort: '',
          location: '',
          reminderEnabled: false,
          reminderTime: 'No horário da tarefa',
          reminderCustomMinutes: '',
          subtasks: [],
          images: [],
          style: 'light',
          completed: false
        });"""

new_save = """        addTask({
          title: task.title || 'Nova Tarefa',
          description: task.description || '',
          startTime: task.startTime || '',
          endTime: task.endTime || '',
          durationStr: task.durationStr || '',
          duration: task.duration || 0,
          category: task.category || '',
          date: task.date || '',
          priority: task.priority || '',
          effort: task.effort || '',
          location: task.location || '',
          reminderEnabled: task.reminderEnabled || false,
          reminderTime: task.reminderTime || 'No horário da tarefa',
          reminderCustomMinutes: task.reminderCustomMinutes || '',
          subtasks: [],
          images: [],
          style: 'light',
          completed: false
        });"""

text = text.replace(old_save, new_save)

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(text)
