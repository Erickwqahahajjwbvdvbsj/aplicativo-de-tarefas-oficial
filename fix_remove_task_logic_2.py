import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Replace references
text = text.replace(
"""              if (editingStageTaskId) {
                const currentStage = goalStages.find(s => s.id === editingStageId);
                if (currentStage) {
                    const currentTask = currentStage.tasks.find(t => t.id === editingStageTaskId);
                    if (currentTask && !currentTask.title.trim()) {
                       setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: s.tasks.filter(t => t.id !== editingStageTaskId) } : s));
                    }
                 }
                 setEditingStageTaskId(null);
              } else if (editingStageId) {""", "              if (editingStageId) {")

text = text.replace(
"""              if (editingStageTaskId) {
                const currentStage = goalStages.find(s => s.id === editingStageId);
                if (currentStage) {
                    const currentTask = currentStage.tasks.find(t => t.id === editingStageTaskId);
                    if (currentTask && !currentTask.title.trim()) {
                       setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: s.tasks.filter(t => t.id !== editingStageTaskId) } : s));
                    }
                 }
              } else if (editingStageId) {""", "              if (editingStageId) {")

# Just to be safe, I'll regex the back handler part.
