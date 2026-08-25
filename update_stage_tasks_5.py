import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace('<div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#1f1f1f] to-transparent pointer-events-none z-20" />', '')

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
