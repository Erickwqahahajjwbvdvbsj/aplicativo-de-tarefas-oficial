import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Replace pb-24 with pb-4
text = text.replace(
    'className="flex-1 overflow-y-auto px-6 pb-24 pt-4 flex flex-col gap-3 no-scrollbar relative"',
    'className="flex-1 overflow-y-auto px-6 pb-0 pt-4 flex flex-col gap-3 no-scrollbar relative"'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
