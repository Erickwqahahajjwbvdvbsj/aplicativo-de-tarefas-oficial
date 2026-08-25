import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Remove the "Adicionar tarefa" button block
text = re.sub(
    r'<div className="flex justify-start">.*?Adicionar tarefa.*?</button>\s*</div>',
    '',
    text,
    flags=re.DOTALL
)

# Remove the "stageTaskEditModal" which is the task edit screen
text = re.sub(
    r'<AnimatePresence>\s*\{editingStageTaskId && \(\(\) => \{.*?</AnimatePresence>',
    '',
    text,
    flags=re.DOTALL
)

# Remove the state `editingStageTaskId`
text = re.sub(
    r'const \[editingStageTaskId, setEditingStageTaskId\] = useState<string \| null>\(null\);\n',
    '',
    text
)

# Remove any other references to `editingStageTaskId`
# Such as animate={{ opacity: 1, y: editingStageTaskId ? "100%" : 0 }} -> actually wait, I already replaced that in my previous fixes to just `animate={{ opacity: 1, y: 0 }}` ? Let me check.

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
