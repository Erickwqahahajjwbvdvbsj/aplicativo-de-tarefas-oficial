import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    '{isTaskSelectionOpen && (',
    '{isTaskSelectionOpen && !editingStageId && ('
)

text = text.replace(
    'animate={{ opacity: 1, y: editingStageId ? "100%" : 0 }}',
    'animate={{ opacity: 1, y: 0 }}'
)

text = text.replace(
    '{editingStageId && (() => {',
    '{editingStageId && !editingStageTaskId && (() => {'
)

text = text.replace(
    'animate={{ opacity: 1, y: editingStageTaskId ? "100%" : 0 }}',
    'animate={{ opacity: 1, y: 0 }}'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
