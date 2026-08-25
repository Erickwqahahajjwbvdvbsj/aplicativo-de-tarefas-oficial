import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Remove the ternary operators since we are now unmounting them
text = text.replace(
    'animate={{ opacity: 1, y: editingStageTaskId ? "100%" : 0 }}',
    'animate={{ opacity: 1, y: 0 }}'
)

text = text.replace(
    'animate={{ opacity: 1, y: editingStageId ? "100%" : 0 }}',
    'animate={{ opacity: 1, y: 0 }}'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
