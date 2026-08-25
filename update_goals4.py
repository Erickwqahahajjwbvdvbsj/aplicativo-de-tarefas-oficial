import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Remove toggleTaskSelection
text = re.sub(r'  const toggleTaskSelection.*?  };\n', '', text, flags=re.MULTILINE | re.DOTALL)

# Fix hasChanges
text = re.sub(r'const tasksChanged = .*?;', 'const tasksChanged = false;', text, flags=re.MULTILINE | re.DOTALL)
text = re.sub(r'hasChanges = newGoalTitle\.trim\(\) !== \'\' \|\| newGoalDescription\.trim\(\) !== \'\' \|\| selectedTaskIds\.length > 0',
              r'hasChanges = newGoalTitle.trim() !== \'\' || newGoalDescription.trim() !== \'\' || goalStages.length > 0', text)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
