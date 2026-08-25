import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'const [isStageTaskModalOpen, setIsStageTaskModalOpen] = useState(false);',
    'const [managingTasksForStageId, setManagingTasksForStageId] = useState<string | null>(null);'
)

text = text.replace(
"""              if (editingStageId) {
                setEditingStageId(null);""",
"""              if (managingTasksForStageId) {
                setManagingTasksForStageId(null);
              } else if (editingStageId) {
                setEditingStageId(null);"""
)

text = text.replace(
"""editingStageId !== null ) ? "100%" : 0""",
"""editingStageId !== null || managingTasksForStageId !== null ) ? "100%" : 0"""
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
