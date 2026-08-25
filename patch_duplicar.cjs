const fs = require('fs');

function patchFile(file) {
  let code = fs.readFileSync(file, 'utf8');

  // We are replacing the addTask call inside the Duplicar button
  const regex = /addTask\(\{\s*title: selectedTask\.title \|\| "",\s*description: selectedTask\.description \|\| "",\s*startTime: selectedTask\.startTime \|\| "",\s*endTime: selectedTask\.endTime \|\| "",\s*endDate: selectedTask\.endDate \|\| "",\s*durationStr: selectedTask\.durationStr \|\| "",\s*duration: selectedTask\.duration \|\| 0,\s*priority: selectedTask\.priority \|\| "",\s*category: selectedTask\.category \|\| "",\s*date: selectedTask\.date \|\| "",\s*effort: selectedTask\.effort \|\| "",\s*location: selectedTask\.location \|\| "",\s*reminderEnabled: selectedTask\.reminderEnabled \|\| false,\s*reminderTime: selectedTask\.reminderTime \|\| "No horário da tarefa",\s*reminderCustomMinutes: selectedTask\.reminderCustomMinutes \|\| "",\s*subtasks: selectedTask\.subtasks \|\| \[\],\s*images: selectedTask\.images \|\| \[\],\s*style: selectedTask\.style \|\| "light",\s*completed: false,\s*\}\);/g;

  const replacement = `addTask({
                            title: selectedTask.title || "",
                            description: selectedTask.description || "",
                            priority: selectedTask.priority || "",
                            category: selectedTask.category || "",
                            effort: selectedTask.effort || "",
                            completed: false,
                        });`;

  code = code.replace(regex, replacement);
  fs.writeFileSync(file, code);
}

patchFile('src/components/ScreenHome.tsx');
patchFile('src/components/ScreenRoadmap.tsx');
