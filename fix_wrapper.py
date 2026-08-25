import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_wrapper = r"""        \{editingStageId && \(\(\) => \{
          const stage = goalStages\.find\(s => s\.id === editingStageId\);
          const stageIdx = goalStages\.findIndex\(s => s\.id === editingStageId\);
          if \(\!stage\) return null;
          return \(
          <motion\.div key="stageTaskModal"
            initial=\{\{ opacity: 0, y: "100%" \}\}
            animate=\{\{ opacity: 1, y: 0 \}\}
            exit=\{\{ opacity: 0, y: "100%" \}\}
            transition=\{\{ type: "spring", damping: 25, stiffness: 200 \}\}
            className="absolute inset-0 bg-\[\#1f1f1f\] z-\[120\] flex flex-col overflow-hidden"
            onClick=\{\(e\) => e\.stopPropagation\(\)\}
          >"""

new_wrapper = """        {editingStageId && (() => {
          const stage = goalStages.find(s => s.id === editingStageId);
          const stageIdx = goalStages.findIndex(s => s.id === editingStageId);
          if (!stage) return null;
          return (
          <motion.div key="stageTaskModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 z-[150] flex flex-col justify-end overflow-hidden"
            onClick={() => setEditingStageId(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0, transition: { type: "spring", damping: 25, stiffness: 200 } }}
              exit={{ y: "100%", transition: { type: "spring", damping: 25, stiffness: 200 } }}
              className="w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[160] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >"""

text = re.sub(old_wrapper, new_wrapper, text, flags=re.MULTILINE | re.DOTALL)

old_bottom = r"""              <\/div>
            <\/div>
          <\/motion\.div>
          \);
        \}\)\(\)\}"""

new_bottom = """              </div>
            </div>
            </motion.div>
          </motion.div>
          );
        })()}"""

text = re.sub(old_bottom, new_bottom, text, flags=re.MULTILINE | re.DOTALL)

# Let's also fix the content padding so it doesn't have unnecessary space at the bottom
# Changing pb-12 to pb-6
old_content_class = r"""<div className="flex-1 overflow-y-auto no-scrollbar p-6">
              <div className="flex flex-col gap-5 pb-12">"""

new_content_class = """<div className="overflow-y-auto no-scrollbar p-6">
              <div className="flex flex-col gap-5 pb-2">"""

text = re.sub(old_content_class, new_content_class, text, flags=re.MULTILINE | re.DOTALL)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

