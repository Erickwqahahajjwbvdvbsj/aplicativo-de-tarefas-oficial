import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_modal = r"""          <motion.div key="isTaskSelectionOpenModal"
            initial=\{\{ opacity: 0, y: "100%" \}\}
            animate=\{\{ opacity: 1, y: 0 \}\}
            exit=\{\{ opacity: 0, y: "100%" \}\}
            transition=\{\{ type: "spring", damping: 25, stiffness: 200 \}\}
            className="absolute bottom-0 left-0 w-full h-\[70vh\] bg-\[\#1f1f1f\] shadow-\[0_-20px_40px_rgba\(0,0,0,0\.5\)\] rounded-t-\[30px\] pt-6 px-6 z-\[110\] border-t border-\[\#4f4f4f\] flex flex-col"
            onClick=\{\(e\) => e.stopPropagation\(\)\}
          >
            <div className="flex items-center justify-between pb-6 shrink-0 border-b border-white/\[0\.04\]">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-\[18px\]">Adicionar Etapas à Jornada<\/h3>
              <\/div>
              <div className="flex items-center gap-2">
                <button 
                  onClick=\{\(\) => \{
                    const newStage = \{ id: Date.now\(\).toString\(\), title: `Etapa \$\{goalStages.length \+ 1\}`, description: '', tasks: \[\] \};
                    setGoalStages\(\[\.\.\.goalStages, newStage\]\);
                  \}\}
                  className="w-8 h-8 rounded-full bg-\[\#2c2c2c\] hover:bg-\[\#ff3838\] text-white flex items-center justify-center transition-colors"
                >
                  <Plus className="w-5 h-5" />
                <\/button>
                <button onClick=\{\(\) => setIsTaskSelectionOpen\(false\)\} className="w-8 h-8 rounded-full bg-\[\#2c2c2c\] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                <\/button>
              <\/div>
            <\/div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-\[50vh\] no-scrollbar py-4">"""

new_modal = """          <motion.div key="isTaskSelectionOpenModal"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[110] border-t border-[#4f4f4f] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 shrink-0 border-b border-white/[0.04]">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-[18px]">Adicionar Etapas à Jornada</h3>
              </div>
              <button onClick={() => setIsTaskSelectionOpen(false)} className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar px-6 pt-4 pb-28 relative">"""

text = re.sub(old_modal, new_modal, text, flags=re.MULTILINE | re.DOTALL)

old_bottom = r"""                        <button onClick=\{\(\) => setEditingStageId\(stage.id\)\} className="flex items-center gap-1 text-\[\#ff3838\] text-\[12px\] font-medium mt-1 w-fit hover:opacity-80 transition-opacity">
                          <Plus className="w-3 h-3" /> Adicionar Tarefa
                        <\/button>
                     <\/div>
                  <\/div>
                \)\)
              \)\}
            <\/div>
          <\/motion.div>"""

new_bottom = """                        <button onClick={() => setEditingStageId(stage.id)} className="flex items-center gap-1 text-[#ff3838] text-[12px] font-medium mt-1 w-fit hover:opacity-80 transition-opacity">
                          <Plus className="w-3 h-3" /> Adicionar Tarefa
                        </button>
                     </div>
                  </div>
                ))
              )}
            </div>

            <div className="absolute bottom-6 right-6 z-20">
               <button 
                 onClick={() => {
                   const newStage = { id: Date.now().toString(), title: `Etapa ${goalStages.length + 1}`, description: '', tasks: [] };
                   setGoalStages([...goalStages, newStage]);
                 }}
                 className="w-14 h-14 rounded-full bg-[#ff3838] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(255,56,56,0.4)] hover:scale-105 active:scale-95 transition-all"
               >
                 <Plus className="w-7 h-7" />
               </button>
            </div>
          </motion.div>"""

text = re.sub(old_bottom, new_bottom, text, flags=re.MULTILINE | re.DOTALL)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

