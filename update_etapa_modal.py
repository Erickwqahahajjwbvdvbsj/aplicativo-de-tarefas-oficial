import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Make modal 70vh
text = text.replace(
    'className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[120] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh] pb-6"',
    'className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[120] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh] pb-6"'
)

replacement = """               <textarea 
                  placeholder="Adicione uma descrição para a etapa..." 
                  value={stage.description}
                  onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, description: e.target.value } : s))}
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-[#e8e8e9] h-[100px] resize-none outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d] no-scrollbar"
               />
               
               <div className="w-full h-[1px] bg-white/[0.04] mt-2 mb-2" />
               
               <div className="flex justify-between items-center mt-2 mb-2">
                 <span className="text-white font-medium text-[16px]">Tarefas</span>
                 <button 
                   onClick={() => {
                       const newTask = { id: Date.now().toString(), title: 'Clique aqui para editar o título da tarefa', completed: false };
                       setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: [...s.tasks, newTask] } : s));
                   }}
                   className="w-8 h-8 rounded-full bg-[#3c3c3c] flex items-center justify-center hover:bg-[#4c4c4c] transition-colors"
                 >
                   <Plus className="w-5 h-5 text-white" />
                 </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-3 no-scrollbar relative">
               {stage.tasks.map(t => (
                  <div key={t.id} className="bg-[#2c2c2c] rounded-[14px] p-4 flex items-center justify-between gap-3 group">
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
                           className="bg-transparent border-none outline-none text-white text-[14px] flex-1 min-w-0"
                         />
                     </div>
                     <button onClick={() => {
                         setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: s.tasks.filter(task => task.id !== t.id) } : s))}
                     } className="text-[#73777d] hover:text-[#ff3838] flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               ))}
               <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#1f1f1f] to-transparent pointer-events-none z-20" />
            </div>

            </motion.div>"""

# Find the textarea block to replace
pattern = re.compile(
    r'<textarea\s+placeholder="Adicione uma descrição para a etapa\.\.\."\s+value=\{stage\.description\}.*?/>\s*</div>\s*</motion\.div>',
    re.DOTALL
)

text = pattern.sub(replacement, text)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
