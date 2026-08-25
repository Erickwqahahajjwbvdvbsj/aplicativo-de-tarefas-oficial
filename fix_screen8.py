import re

with open("src/components/ScreenAI.tsx", "r") as f:
    text = f.read()

old_set = "setDraftTasks(data.tasks || []);"
new_set = "setDraftTasks((data.tasks || []).slice(0, 20));"

if old_set in text:
    text = text.replace(old_set, new_set)

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(text)
