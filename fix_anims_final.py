import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Make sure the task modal goes down when the edit task modal is open
text = text.replace(
    '<motion.div key="stageTaskModal"\n            initial={{ opacity: 0, y: "100%" }}\n            animate={{ opacity: 1, y: editingStageTaskId ? "100%" : 0 }}\n            exit={{ opacity: 0, y: "100%" }}\n            transition={{ type: "spring", damping: 25, stiffness: 200 }}\n            className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[120] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh] pb-6"',
    '<motion.div key="stageTaskModal"\n            initial={{ opacity: 0, y: "100%" }}\n            animate={{ opacity: 1, y: editingStageTaskId ? "100%" : 0 }}\n            exit={{ opacity: 0, y: "100%" }}\n            transition={{ type: "spring", damping: 25, stiffness: 200 }}\n            className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[120] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh] pb-6"'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
