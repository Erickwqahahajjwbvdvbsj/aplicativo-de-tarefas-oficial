import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'const tasksChanged = false;',
    'const tasksChanged = JSON.stringify(goalStages) !== JSON.stringify(originalGoal.stages);'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
