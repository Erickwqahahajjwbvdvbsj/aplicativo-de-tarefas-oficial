import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_click = r"""            onClick=\{\(\) => \{
              if \(editingStageId\) \{
                setEditingStageId\(null\);
              \} else if \(isTaskSelectionOpen\) \{"""

new_click = """            onClick={() => {
              if (editingStageTaskId) {
                 const currentStage = goalStages.find(s => s.id === editingStageId);
                 if (currentStage) {
                    const currentTask = currentStage.tasks.find(t => t.id === editingStageTaskId);
                    if (currentTask && !currentTask.title.trim()) {
                       setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: s.tasks.filter(t => t.id !== editingStageTaskId) } : s));
                    }
                 }
                 setEditingStageTaskId(null);
              } else if (editingStageId) {
                setEditingStageId(null);
              } else if (isTaskSelectionOpen) {"""

text = re.sub(old_click, new_click, text, flags=re.MULTILINE)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
