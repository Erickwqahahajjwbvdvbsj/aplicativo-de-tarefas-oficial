import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# I will append the editingStageId modal to the end of the AnimatePresence blocks, just before the first `isEndPickerOpen` modal.

old_end_picker = r"""        \{isEndPickerOpen && \("""

new_stage_task_modal = """        {editingStageId && (
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
              className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] p-6 z-[160] border-t border-[#4f4f4f]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-[20px]">Nova Tarefa da Etapa</h3>
                <button onClick={() => setEditingStageId(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Título da tarefa..."
                  value={newStageTaskTitle}
                  onChange={e => setNewStageTaskTitle(e.target.value)}
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d]"
                  autoFocus
                />
                <button 
                  onClick={() => {
                     if (newStageTaskTitle.trim()) {
                        setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: [...s.tasks, { id: Date.now().toString(), title: newStageTaskTitle.trim(), completed: false }] } : s));
                        setNewStageTaskTitle("");
                        setEditingStageId(null);
                     }
                  }}
                  className="w-full py-4 rounded-[14px] text-white text-[14px] font-bold bg-[#ff3838] hover:bg-[#ff3838]/90 transition-colors"
                >
                  Adicionar Tarefa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {isEndPickerOpen && ("""

text = re.sub(old_end_picker, new_stage_task_modal, text)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

