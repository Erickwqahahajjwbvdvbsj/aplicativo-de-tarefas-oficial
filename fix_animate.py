import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace("      {/* End Date Picker Bottom Sheet */}\n      <AnimatePresence>\n        \n      <AnimatePresence>", "      {/* End Date Picker Bottom Sheet */}\n      <AnimatePresence>")

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
