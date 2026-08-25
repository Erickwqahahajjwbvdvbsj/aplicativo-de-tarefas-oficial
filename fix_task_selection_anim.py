import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_anim = r"""        \{isTaskSelectionOpen && \(
          <motion\.div key="isTaskSelectionOpenModal"
            initial=\{\{ opacity: 0, y: "100%" \}\}
            animate=\{\{ opacity: 1, y: 0 \}\}
            exit=\{\{ opacity: 0, y: "100%" \}\}
            transition=\{\{ type: "spring", damping: 25, stiffness: 200 \}\}
            className="absolute bottom-0 left-0 w-full h-\[70vh\] bg-\[\#1f1f1f\] shadow-\[0_-20px_40px_rgba\(0,0,0,0\.5\)\] rounded-t-\[30px\] z-\[110\] border-t border-\[\#4f4f4f\] flex flex-col overflow-hidden max-h-\[90vh\]"
            onClick=\{\(e\) => e\.stopPropagation\(\)\}
          >"""

new_anim = """        {isTaskSelectionOpen && (
          <motion.div key="isTaskSelectionOpenModal"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: editingStageId ? "100%" : 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[110] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >"""

text = re.sub(old_anim, new_anim, text, flags=re.MULTILINE)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
