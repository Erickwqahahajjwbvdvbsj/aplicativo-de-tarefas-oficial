import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_task_end = r"""          <\/motion\.div>
          \);
        \}\)\(\)\}
        
        \{isEndPickerOpen && \("""

new_task_end = """          </motion.div>
          );
        })()}
      </AnimatePresence>
        
        {isEndPickerOpen && ("""

text = re.sub(old_task_end, new_task_end, text, flags=re.MULTILINE)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
