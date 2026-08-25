import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_click = r"""            onClick=\{\(\) => \{
              if \(isTaskSelectionOpen\) \{
                setIsTaskSelectionOpen\(false\);
              \} else if \(isStartPickerOpen\) \{"""

new_click = """            onClick={() => {
              if (editingStageId) {
                setEditingStageId(null);
              } else if (isTaskSelectionOpen) {
                setIsTaskSelectionOpen(false);
              } else if (isStartPickerOpen) {"""

text = re.sub(old_click, new_click, text, flags=re.MULTILINE)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
