import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_stage = r"""                \{editingStageId && \(\(\) => \{"""
new_stage = """      <AnimatePresence>
        {editingStageId && (() => {"""

text = re.sub(old_stage, new_stage, text, flags=re.MULTILINE)

old_stage_end = r"""          <\/motion\.div>
          \);
        \}\)\(\)\}"""

new_stage_end = """          </motion.div>
          );
        })()}
      </AnimatePresence>"""

text = re.sub(old_stage_end, new_stage_end, text, flags=re.MULTILINE)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
