import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    "const [editingStageId, setEditingStageId] = useState<string | null>(null);",
    "const [editingStageId, setEditingStageId] = useState<string | null>(null);\n  const [openStageMenuId, setOpenStageMenuId] = useState<string | null>(null);"
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
