import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Match the old Task Selection Bottom Sheet
old_task_selection = r"""      \{\/\* Task Selection Bottom Sheet \*\/\}
      <AnimatePresence>
        \{isTaskSelectionOpen && \(
          <motion\.div key="isTaskSelectionOpenModal".*?<\/motion\.div>
        \)\}
      <\/AnimatePresence>"""

text = re.sub(old_task_selection, '', text, flags=re.MULTILINE | re.DOTALL)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
