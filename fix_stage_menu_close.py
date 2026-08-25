import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    '            onClick={() => {\n              if (managingTasksForStageId) {',
    '            onClick={() => {\n              if (openStageMenuId) {\n                setOpenStageMenuId(null);\n              } else if (managingTasksForStageId) {'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
