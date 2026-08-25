import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_task = r"""        \{editingStageTaskId && \(\(\) => \{"""
new_task = """      <AnimatePresence>
        {editingStageTaskId && (() => {"""

text = re.sub(old_task, new_task, text, flags=re.MULTILINE)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
