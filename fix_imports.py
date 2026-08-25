import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace("import { useGoals, Goal }", "import { useGoals, Goal, GoalStage }")

# Also let's fix line 496 `goalTasks`
# It's inside the edit goal or goal details UI.
# Let's find line 496.

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
