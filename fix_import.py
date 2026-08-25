import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    "import { ChevronDown",
    "import { MoreVertical, ChevronDown"
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
