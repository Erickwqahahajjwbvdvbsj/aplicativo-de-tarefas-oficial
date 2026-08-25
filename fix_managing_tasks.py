import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Replace the first occurrence (line ~595)
old_close_1 = """              } else if (managingTasksForStageId) {
                setManagingTasksForStageId(null);
              } else if (editingStageId) {"""
new_close_1 = """              } else if (managingTasksForStageId) {
                setGoalStages(goalStages.map(s => s.id === managingTasksForStageId ? { ...s, tasks: s.tasks.filter(t => t.title.trim() !== '') } : s));
                setManagingTasksForStageId(null);
              } else if (editingStageId) {"""

# Replace the second occurrence (line ~1082)
old_close_2 = """              <button onClick={() => setManagingTasksForStageId(null)} className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-white transition-colors">"""
new_close_2 = """              <button onClick={() => {
                  setGoalStages(goalStages.map(s => s.id === managingTasksForStageId ? { ...s, tasks: s.tasks.filter(t => t.title.trim() !== '') } : s));
                  setManagingTasksForStageId(null);
              }} className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-white transition-colors">"""

text = text.replace(old_close_1, new_close_1)
text = text.replace(old_close_2, new_close_2)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
