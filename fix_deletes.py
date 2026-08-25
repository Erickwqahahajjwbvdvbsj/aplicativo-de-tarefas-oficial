import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Fix 1: around line 378
old_del1 = r"""                                      deleteGoal\(goal.id\);
                                      goal.taskIds.forEach\(tId => \{
                                        const task = tasks.find\(t => t.id === tId\);
                                        if \(task && task.completed && task.completedAt\) \{
                                          const completedDate = new Date\(task.completedAt\);
                                          const diffTime = Math.abs\(new Date\(\).getTime\(\) - completedDate.getTime\(\)\);
                                          const diffDays = Math.ceil\(diffTime \/ \(1000 \* 60 \* 60 \* 24\)\);
                                          if \(diffDays > 7\) \{
                                            deleteTask\(tId\);
                                          \}
                                        \}
                                      \}\);"""

new_del1 = """                                      deleteGoal(goal.id);"""
text = re.sub(old_del1, new_del1, text, flags=re.MULTILINE | re.DOTALL)

# Fix 2: around line 544
old_del2 = r"""                                            selectedGoal.taskIds.forEach\(tId => \{
                        const task = tasks.find\(t => t.id === tId\);
                        if \(task && task.completed\) \{
                          deleteTask\(tId\);
                        \}
                      \}\);
                      deleteGoal\(selectedGoal.id\);"""

new_del2 = """                      deleteGoal(selectedGoal.id);"""
text = re.sub(old_del2, new_del2, text, flags=re.MULTILINE | re.DOTALL)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

