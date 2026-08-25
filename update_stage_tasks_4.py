import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# First, extract the managingTasksForStageId block
# It starts at `<AnimatePresence>\n        {managingTasksForStageId &&`
# and ends at the corresponding `</AnimatePresence>`

pattern_to_remove = re.compile(
    r'<AnimatePresence>\s*\{managingTasksForStageId && \(\(\) => \{.*?\n\s*\}\)\(\)\}\n\s*</AnimatePresence>',
    re.DOTALL
)

match = pattern_to_remove.search(text)
if match:
    block_to_move = match.group(0)
    text = pattern_to_remove.sub('', text)
    
    # Now find the end of stageTaskModal which ends with `</AnimatePresence>`
    # We want to append `block_to_move` after that AnimatePresence
    # Let's match `<motion.div key="stageTaskModal".*?</AnimatePresence>`
    
    pattern_stage_task = re.compile(
        r'(<motion\.div key="stageTaskModal".*?</AnimatePresence>)',
        re.DOTALL
    )
    
    text = pattern_stage_task.sub(r'\1\n      ' + block_to_move, text)
    
    with open("src/components/ScreenGoals.tsx", "w") as f:
        f.write(text)
    print("Moved successfully")
else:
    print("Could not find the block to remove")
