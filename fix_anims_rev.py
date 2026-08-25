import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    '{isTaskSelectionOpen && !editingStageId && (',
    '{isTaskSelectionOpen && ('
)

text = text.replace(
    '{editingStageId && !editingStageTaskId && (() => {',
    '{editingStageId && (() => {'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
