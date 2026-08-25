import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_progress = r"""            const goalTasks = allTasks.filter\(t => goal.taskIds.includes\(t.id\)\);
            const completedCount = goalTasks.filter\(t => t.completed\).length;
            const totalCount = goalTasks.length;"""

new_progress = """            const allStagesTasks = goal.stages?.flatMap(s => s.tasks) || [];
            const completedCount = allStagesTasks.filter(t => t.completed).length;
            const totalCount = allStagesTasks.length;"""

text = re.sub(old_progress, new_progress, text, flags=re.MULTILINE | re.DOTALL)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

