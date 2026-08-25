import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

replacement_edit_stage = """          <motion.div key="stageTaskModal"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: managingTasksForStageId ? "100%" : 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[120] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh] pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 shrink-0 border-b border-white/[0.04]">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-[18px]">Editar Etapa</h3>
              </div>
              <button onClick={() => setEditingStageId(null)} className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <div className="p-6 shrink-0 flex flex-col gap-5">
               <input 
                  type="text" 
                  placeholder="Título da etapa" 
                  value={stage.title}
                  onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, title: e.target.value } : s))}
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d]"
               />
               <textarea 
                  placeholder="Adicione uma descrição para a etapa..." 
                  value={stage.description}
                  onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, description: e.target.value } : s))}
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-[#e8e8e9] h-[100px] resize-none outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d] no-scrollbar"
               />
               
               <div className="w-full h-[1px] bg-white/[0.04] mt-2" />
               
               <button
                  onClick={() => setManagingTasksForStageId(stage.id)}
                  className="w-full bg-[#2c2c2c] rounded-[14px] px-5 py-4 flex items-center justify-between group hover:bg-[#333333] transition-colors"
               >
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-[#1f1f1f] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckSquare className="w-4 h-4 text-[#ff3838]" />
                     </div>
                     <span className="text-[#e8e8e9] text-[15px] font-medium">Criar tarefas para essa etapa</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#73777d]" />
               </button>
            </div>

            </motion.div>"""

# Replace the whole block from `<motion.div key="stageTaskModal"` to `</motion.div>` inclusive
pattern = re.compile(
    r'<motion\.div key="stageTaskModal".*?</motion\.div>',
    re.DOTALL
)

text = pattern.sub(replacement_edit_stage, text, count=1)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
