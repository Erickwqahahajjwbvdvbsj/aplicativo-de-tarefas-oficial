import re
import sys

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Replace selectedTaskIds with goalStages
text = re.sub(r'const \[selectedTaskIds, setSelectedTaskIds\] = useState<string\[\]>\(\[\]\);',
    r'const [goalStages, setGoalStages] = useState<GoalStage[]>([]);\n  const [creationStep, setCreationStep] = useState<1 | 2>(1);\n  const [editingStageId, setEditingStageId] = useState<string | null>(null);\n  const [isStageTaskModalOpen, setIsStageTaskModalOpen] = useState(false);\n  const [newStageTaskTitle, setNewStageTaskTitle] = useState("");', text)

# Remove selectedTaskIds references in reset block
text = re.sub(r'setSelectedTaskIds\(\[\]\);', 'setGoalStages([]);\n                  setCreationStep(1);\n                  setEditingStageId(null);', text)

# Fix edit initialization
text = re.sub(r'setSelectedTaskIds\(selectedGoal.taskIds\);', 'setGoalStages(selectedGoal.stages || []);\n                      setCreationStep(1);', text)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

