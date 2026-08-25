import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Make stageTaskModal unmount properly using AnimatePresence
text = text.replace(
    '{editingStageId && (() => {',
    '{editingStageId && !editingStageTaskId && (() => {'
)

# Also fix `isTaskSelectionOpen` so it unmounts when `editingStageId` is active, instead of staying mounted and translating 100% down
text = text.replace(
    '{isTaskSelectionOpen && (',
    '{isTaskSelectionOpen && !editingStageId && ('
)

# And `isAddingGoal` overlay! Wait, `isAddingGoal` overlay is the whole screen background. We shouldn't unmount it, because it holds the dark background.
# Actually, the user says "a tela extra que estava aberta por trás vai sumir descer".
# If I unmount it, it will animate down and disappear!

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
