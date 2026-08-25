import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

replacement = """               <div className="w-full h-[1px] bg-white/[0.04] mt-2" />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 pt-2 flex flex-col gap-3 no-scrollbar relative">
               <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#1f1f1f] to-transparent pointer-events-none z-20" />
               
               {stage.tasks.map(t => (
                  <div key={t.id} className="bg-[#2c2c2c] rounded-[14px] p-4 flex items-center justify-between gap-3 group relative z-10 shrink-0">
                     <div className="flex items-center gap-3 overflow-hidden flex-1">
                         <div className="w-5 h-5 rounded-full border-2 border-[#555] flex-shrink-0" />
                         <input
                           type="text"
                           value={t.title}
                           onChange={(e) => {
                               setGoalStages(goalStages.map(s => s.id === editingStageId ? { 
                                   ...s, 
                                   tasks: s.tasks.map(task => task.id === t.id ? { ...task, title: e.target.value } : task) 
                               } : s));
                           }}
                           className="bg-transparent border-none outline-none text-white text-[14px] flex-1 min-w-0 p-0"
                         />
                     </div>
                     <button onClick={() => {
                         setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: s.tasks.filter(task => task.id !== t.id) } : s))}
                     } className="text-[#73777d] hover:text-[#ff3838] flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               ))}
            </div>
            
            <div className="absolute bottom-6 right-6 z-20">
               <button
                  onClick={() => {
                     const newTask = { id: Date.now().toString(), title: 'Clique aqui para editar o título da tarefa', completed: false };
                     setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: [...s.tasks, newTask] } : s));
                 }}
                 className="w-14 h-14 rounded-full bg-[#ff3838] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
               >
                 <Plus className="w-7 h-7" />
               </button>
            </div>

            </motion.div>"""

# Find the block from `<div className="w-full h-[1px] bg-white/[0.04] mt-2 mb-2" />` up to `</motion.div>` inclusive inside `stageTaskModal`
pattern = re.compile(
    r'<div className="w-full h-\[1px\] bg-white/\[0\.04\] mt-2 mb-2" />.*?</motion\.div>',
    re.DOTALL
)

text = pattern.sub(replacement, text)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
