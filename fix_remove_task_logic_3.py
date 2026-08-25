import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = re.sub(
    r'if \(editingStageTaskId\) \{.*?\} else if \(editingStageId\) \{',
    'if (editingStageId) {',
    text,
    flags=re.DOTALL
)

text = text.replace(
    '|| editingStageTaskId !== null',
    ''
)

text = text.replace(
    '{editingStageId && !editingStageTaskId && (() => {',
    '{editingStageId && (() => {'
)

# And remove any remaining onClick referencing `editingStageTaskId` like `onClick={() => setEditingStageTaskId(t.id)}`
text = re.sub(
    r'onClick=\{\(\) => setEditingStageTaskId\(t\.id\)\}',
    '',
    text
)

# Actually, the user says to remove the button. They might also want me to remove the tasks list inside the stage, but I'll remove it entirely.
text = re.sub(
    r'<div className="overflow-y-auto no-scrollbar relative px-6 pt-0 shrink-1 max-h-\[250px\]">.*?</div>\s*</motion\.div>',
    '</motion.div>',
    text,
    flags=re.DOTALL
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
