import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_modal_start = r"""          <motion\.div key="stageTaskModal"
            initial=\{\{ opacity: 0, y: "100%" \}\}
            animate=\{\{ opacity: 1, y: 0 \}\}
            exit=\{\{ opacity: 0, y: "100%" \}\}
            transition=\{\{ type: "spring", damping: 25, stiffness: 200 \}\}
            className="absolute bottom-0 left-0 w-full bg-\[\#1f1f1f\] shadow-\[0_-20px_40px_rgba\(0,0,0,0\.5\)\] rounded-t-\[30px\] z-\[120\] border-t border-\[\#4f4f4f\] flex flex-col overflow-hidden max-h-\[90vh\]"
            onClick=\{\(e\) => e\.stopPropagation\(\)\}
          >"""

new_modal_start = """          <motion.div key="stageTaskModalOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 z-[120] flex flex-col justify-end overflow-hidden"
            onClick={() => setEditingStageId(null)}
          >
            <motion.div key="stageTaskModal"
              initial={{ y: "100%" }}
              animate={{ y: 0, transition: { type: "spring", damping: 25, stiffness: 200 } }}
              exit={{ y: "100%", transition: { type: "spring", damping: 25, stiffness: 200 } }}
              className="w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[130] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >"""

text = re.sub(old_modal_start, new_modal_start, text, flags=re.MULTILINE | re.DOTALL)


old_modal_end = r"""              <\/div>
            <\/div>
          <\/motion\.div>
          \);
        \}\)\(\)\}"""

new_modal_end = """              </div>
            </div>
            </motion.div>
          </motion.div>
          );
        })()}"""

text = re.sub(old_modal_end, new_modal_end, text, flags=re.MULTILINE | re.DOTALL)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

