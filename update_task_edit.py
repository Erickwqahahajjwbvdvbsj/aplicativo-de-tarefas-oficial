import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_task_card = r"""                      <div key=\{t\.id\} className="bg-\[\#2c2c2c\] rounded-\[14px\] p-4 flex items-center justify-between gap-3 group">
                         <div className="flex items-center gap-3 overflow-hidden">
                             <div className="w-5 h-5 rounded-full border-2 border-\[\#555\] flex-shrink-0" \/>
                             <span className="text-white text-\[14px\] truncate">\{t\.title \|\| 'Nova tarefa\.\.\.'\}<\/span>
                         <\/div>"""

new_task_card = """                      <div key={t.id} className="bg-[#2c2c2c] rounded-[14px] p-4 flex items-center justify-between gap-3 group">
                         <div 
                           className="flex items-center gap-3 overflow-hidden flex-1 cursor-pointer"
                           onClick={() => setEditingStageTaskId(t.id)}
                         >
                             <div className="w-5 h-5 rounded-full border-2 border-[#555] flex-shrink-0" />
                             <span className="text-white text-[14px] truncate">{t.title || 'Nova tarefa...'}</span>
                         </div>"""

text = re.sub(old_task_card, new_task_card, text, flags=re.MULTILINE)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

