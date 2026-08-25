import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Modify handleCreateGoal
old_handleCreate = r"""  const handleCreateGoal = async \(\) => \{
    if \(newGoalTitle.trim\(\) && selectedTaskIds.length > 0 && newGoalStartDate !== '' && newGoalEndDate !== ''\) \{
      setIsSaving\(true\);
      try \{
        if \(editingGoalId\) \{
          await updateGoal\(editingGoalId, \{
            title: newGoalTitle.trim\(\),
            description: newGoalDescription.trim\(\),
            taskIds: selectedTaskIds,
            startDate: newGoalStartDate,
            startTime: newGoalStartTime,
            endDate: newGoalEndDate,
            endTime: newGoalEndTime,
          \}\);
        \} else \{
          await addGoal\(\{
            title: newGoalTitle.trim\(\),
            description: newGoalDescription.trim\(\),
            taskIds: selectedTaskIds,
            startDate: newGoalStartDate,
            startTime: newGoalStartTime,
            endDate: newGoalEndDate,
            endTime: newGoalEndTime,
          \}\);
        \}"""

new_handleCreate = """  const handleCreateGoal = async () => {
    if (newGoalTitle.trim() && goalStages.length > 0 && newGoalStartDate !== '' && newGoalEndDate !== '') {
      setIsSaving(true);
      try {
        if (editingGoalId) {
          await updateGoal(editingGoalId, {
            title: newGoalTitle.trim(),
            description: newGoalDescription.trim(),
            stages: goalStages,
            startDate: newGoalStartDate,
            startTime: newGoalStartTime,
            endDate: newGoalEndDate,
            endTime: newGoalEndTime,
          });
        } else {
          await addGoal({
            title: newGoalTitle.trim(),
            description: newGoalDescription.trim(),
            stages: goalStages,
            startDate: newGoalStartDate,
            startTime: newGoalStartTime,
            endDate: newGoalEndDate,
            endTime: newGoalEndTime,
          });
        }"""

text = re.sub(old_handleCreate, new_handleCreate, text, flags=re.MULTILINE | re.DOTALL)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
