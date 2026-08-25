import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'className="absolute right-0 top-7 w-[120px] bg-[#1f1f1f] rounded-[10px] shadow-lg border border-[#4f4f4f] overflow-hidden z-[100]"',
    'className="absolute right-0 top-6 w-[120px] bg-[#2c2c2c] rounded-[10px] shadow-lg border border-[#4f4f4f] overflow-hidden z-[100]"'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
