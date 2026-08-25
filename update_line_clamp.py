import re

with open("src/components/ScreenHome.tsx", "r") as f:
    text = f.read()

text = text.replace('line-clamp-3 ', '')
text = text.replace('max-h-[150px]', 'max-h-[500px]')

with open("src/components/ScreenHome.tsx", "w") as f:
    f.write(text)

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace('line-clamp-3 ', '')
text = text.replace('max-h-[150px]', 'max-h-[500px]')

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

