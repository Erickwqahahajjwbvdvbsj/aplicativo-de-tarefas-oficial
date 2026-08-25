import re

with open("src/components/ScreenRoadmap.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'className="absolute bottom-[104px] right-6 w-14 h-14 rounded-full bg-[#ff3838] flex items-center justify-center shadow-xl z-40"',
    'className="absolute bottom-[104px] right-6 w-14 h-14 rounded-[16px] bg-[#ff3838] flex items-center justify-center shadow-xl z-40"'
)

with open("src/components/ScreenRoadmap.tsx", "w") as f:
    f.write(text)


with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'className="absolute bottom-[104px] right-6 w-14 h-14 rounded-full bg-[#ff3838] flex items-center justify-center shadow-xl z-40"',
    'className="absolute bottom-[104px] right-6 w-14 h-14 rounded-[16px] bg-[#ff3838] flex items-center justify-center shadow-xl z-40"'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

