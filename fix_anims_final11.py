import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# OH!!! Wait!! The user sent a screenshot that shows "Título da sua jornada: limite 100 caracteres" AT THE BOTTOM.
# Let's check `isAddingGoal` animation!
text = text.replace(
    'animate={{ opacity: 1, y: 0 }}\n            exit={{ opacity: 0, y: "100%" }}\n            transition={{ type: "spring", damping: 25, stiffness: 200 }}\n            className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[100] border-t border-[#4f4f4f] flex flex-col overflow-hidden"',
    'animate={{ opacity: 1, y: isTaskSelectionOpen ? "100%" : 0 }}\n            exit={{ opacity: 0, y: "100%" }}\n            transition={{ type: "spring", damping: 25, stiffness: 200 }}\n            className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[100] border-t border-[#4f4f4f] flex flex-col overflow-hidden"'
)
with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
