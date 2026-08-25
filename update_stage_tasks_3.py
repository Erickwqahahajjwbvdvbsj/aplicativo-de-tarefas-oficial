import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

new_modal = """
      <AnimatePresence>
        {managingTasksForStageId && (() => {
          const stage = goalStages.find(s => s.id === managingTasksForStageId);
          if (!stage) return null;
          return (
          <motion.div key="managingTasksModal"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[130] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh] pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 shrink-0 border-b border-white/[0.04]">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-[18px]">Tarefas da Etapa</h3>
              </div>
              <button onClick={() => setManagingTasksForStageId(null)} className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4 flex flex-col gap-3 no-scrollbar relative">
               <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#1f1f1f] to-transparent pointer-events-none z-20" />
               
               {stage.tasks.length === 0 ? (
                  <div className="text-center text-[#73777d] text-[14px] py-8">Nenhuma tarefa adicionada.</div>
               ) : (
                 stage.tasks.map(t => (
                  <div key={t.id} className="bg-[#2c2c2c] rounded-[14px] p-4 flex items-center justify-between gap-3 group relative z-10 shrink-0">
                     <div className="flex items-center gap-3 overflow-hidden flex-1">
                         <div className="w-5 h-5 rounded-full border-2 border-[#555] flex-shrink-0" />
                         <input
                           type="text"
                           value={t.title}
                           onChange={(e) => {
                               setGoalStages(goalStages.map(s => s.id === managingTasksForStageId ? { 
                                   ...s, 
                                   tasks: s.tasks.map(task => task.id === t.id ? { ...task, title: e.target.value } : task) 
                               } : s));
                           }}
                           className="bg-transparent border-none outline-none text-white text-[14px] flex-1 min-w-0 p-0"
                         />
                     </div>
                     <button onClick={() => {
                         setGoalStages(goalStages.map(s => s.id === managingTasksForStageId ? { ...s, tasks: s.tasks.filter(task => task.id !== t.id) } : s))}
                     } className="text-[#73777d] hover:text-[#ff3838] flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                 ))
               )}
            </div>
            
            <div className="absolute bottom-6 right-6 z-20">
               <button
                  onClick={() => {
                     const newTask = { id: Date.now().toString(), title: 'Clique aqui para editar o título da tarefa', completed: false };
                     setGoalStages(goalStages.map(s => s.id === managingTasksForStageId ? { ...s, tasks: [...s.tasks, newTask] } : s));
                 }}
                 className="w-14 h-14 rounded-full bg-[#ff3838] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
               >
                 <Plus className="w-7 h-7" />
               </button>
            </div>
          </motion.div>
          );
        })()}
      </AnimatePresence>
"""

text = text.replace(
    '        })()}\n      </AnimatePresence>',
    '        })()}\n      </AnimatePresence>' + new_modal,
    1 # replace first occurrence only, which is the end of editingStageId AnimatePresence
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
