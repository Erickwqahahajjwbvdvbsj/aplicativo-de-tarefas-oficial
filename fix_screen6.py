import re

with open("src/components/ScreenAI.tsx", "r") as f:
    text = f.read()

# Fix the save button styles
text = text.replace("aiState === 'ready'\n               ? 'bg-[#ff3838]", "draftTasks.length > 0\n               ? 'bg-[#ff3838]")
text = text.replace("aiState === 'ready' \n               ? 'bg-[#ff3838]", "draftTasks.length > 0 \n               ? 'bg-[#ff3838]")
text = text.replace("            aiState === 'ready'", "            draftTasks.length > 0")

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(text)
