import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_modal = r"""          <motion\.div key="stageTaskModal"
            initial=\{\{ opacity: 0, y: "100%" \}\}
            animate=\{\{ opacity: 1, y: 0 \}\}
            exit=\{\{ opacity: 0, y: "100%" \}\}
            transition=\{\{ type: "spring", damping: 25, stiffness: 200 \}\}
            className="absolute bottom-0 left-0 w-full bg-\[\#1f1f1f\] shadow-\[0_-20px_40px_rgba\(0,0,0,0\.5\)\] rounded-t-\[30px\] z-\[120\] border-t border-\[\#4f4f4f\] flex flex-col overflow-hidden max-h-\[90vh\]"
            onClick=\{\(e\) => e\.stopPropagation\(\)\}
          >
            <div className="flex items-center justify-between p-6 shrink-0 border-b border-white/\[0\.04\]">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-\[18px\]">Editar Etapa</h3>
              </div>
              <button onClick=\{\(\) => setEditingStageId\(null\)\} className="w-8 h-8 rounded-full bg-\[\#2c2c2c\] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <div className="p-6 pb-12">
              <div className="flex flex-col gap-5 pb-2">
                 <div className="flex items-center gap-2 border-b border-\[\#4f4f4f\] pb-2 focus-within:border-white transition-colors">
                    <span className="text-white font-bold text-\[16px\] shrink-0">Etapa \{stageIdx \+ 1\}:</span>
                    <input 
                       type="text" 
                       placeholder="Título da etapa \(opcional\)" 
                       value=\{stage\.title\}
                       onChange=\{e => setGoalStages\(goalStages\.map\(s => s\.id === editingStageId \? \{ \.\.\.s, title: e\.target\.value \} : s\)\)\}
                       className="bg-transparent border-none outline-none text-white text-\[16px\] font-medium placeholder-\[\#73777d\] w-full"
                    />
                 </div>
                 
                 <textarea 
                    placeholder="Adicione uma descrição para a etapa \(opcional\)\.\.\." 
                    value=\{stage\.description\}
                    onChange=\{e => setGoalStages\(goalStages\.map\(s => s\.id === editingStageId \? \{ \.\.\.s, description: e\.target\.value \} : s\)\)\}
                    className="w-full shrink-0 bg-\[\#2c2c2c\] border border-transparent rounded-\[14px\] px-5 py-4 text-\[14px\] text-\[\#e8e8e9\] h-\[100px\] resize-none outline-none focus:ring-0 focus:border-transparent placeholder-\[\#73777d\] no-scrollbar"
                 />

                 <div className="mt-2">
                    <h4 className="text-\[\#73777d\] text-\[14px\] mb-3">Tarefas da Etapa</h4>
                    <div className="flex flex-col gap-2">
                       \{stage\.tasks\.length === 0 \? \(
                         <div className="text-\[\#555\] text-\[13px\] bg-\[\#2c2c2c\] rounded-\[14px\] p-4 text-center">Nenhuma tarefa adicionada\.</div>
                       \) : \(
                         stage\.tasks\.map\(t => \(
                           <div key=\{t\.id\} className="bg-\[\#2c2c2c\] rounded-\[14px\] p-4 flex items-center justify-between gap-3">
                              <span className="text-white text-\[14px\] break-words whitespace-normal leading-tight">\{t\.title\}</span>
                              <button onClick=\{\(\) => setGoalStages\(goalStages\.map\(s => s\.id === editingStageId \? \{ \.\.\.s, tasks: s\.tasks\.filter\(task => task\.id \!\=\= t\.id\) \} : s\)\)\} className="text-\[\#73777d\] hover:text-\[\#ff3838\] shrink-0">
                                <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                         \)\)
                       \)\}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                       <input 
                         type="text" 
                         placeholder="Adicionar nova tarefa\.\.\."
                         value=\{newStageTaskTitle\}
                         onChange=\{e => setNewStageTaskTitle\(e\.target\.value\)\}
                         onKeyDown=\{\(e\) => \{
                            if \(e\.key === 'Enter' && newStageTaskTitle\.trim\(\)\) \{
                                setGoalStages\(goalStages\.map\(s => s\.id === editingStageId \? \{ \.\.\.s, tasks: \[\.\.\.s\.tasks, \{ id: Date\.now\(\)\.toString\(\), title: newStageTaskTitle\.trim\(\), completed: false \}\] \} : s\)\);
                                setNewStageTaskTitle\(""\);
                            \}
                         \}\}
                         className="flex-1 shrink-0 bg-\[\#2c2c2c\] border border-transparent rounded-\[14px\] px-4 py-3 text-\[14px\] text-\[\#e8e8e9\] outline-none focus:ring-0 focus:border-transparent placeholder-\[\#73777d\]"
                       />
                       <button
                         onClick=\{\(\) => \{
                            if \(newStageTaskTitle\.trim\(\)\) \{
                                setGoalStages\(goalStages\.map\(s => s\.id === editingStageId \? \{ \.\.\.s, tasks: \[\.\.\.s\.tasks, \{ id: Date\.now\(\)\.toString\(\), title: newStageTaskTitle\.trim\(\), completed: false \}\] \} : s\)\);
                                setNewStageTaskTitle\(""\);
                            \}
                         \}\}
                         className="w-\[46px\] h-\[46px\] shrink-0 rounded-\[14px\] bg-\[\#ff3838\] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                       >
                         <Plus className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </motion\.div>
          \);
        \}\)\(\)\}"""

new_modal = """          <motion.div key="stageTaskModal"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: editingStageTaskId ? "100%" : 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[120] border-t border-[#4f4f4f] flex flex-col overflow-hidden h-[90vh]"
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

            <div className="px-6 pt-6 pb-4 border-b border-[#4f4f4f] shrink-0">
               <input 
                  type="text" 
                  placeholder="Título da etapa" 
                  value={stage.title}
                  onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, title: e.target.value } : s))}
                  className="w-full bg-transparent border-none outline-none text-white text-[24px] font-bold placeholder-[#73777d]"
               />
               <textarea 
                  placeholder="Descrição da etapa (opcional)..." 
                  value={stage.description}
                  onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, description: e.target.value } : s))}
                  className="w-full h-[80px] bg-transparent border-none outline-none text-[#a0a0a0] text-[14px] placeholder-[#555] resize-none mt-4 no-scrollbar"
               />
               <div className="flex justify-start mt-2">
                 <button 
                    onClick={() => {
                       const newTask = { id: Date.now().toString(), title: '', completed: false };
                       setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: [...s.tasks, newTask] } : s));
                       setEditingStageTaskId(newTask.id);
                    }}
                    className="text-[#ff3838] text-[14px] font-medium hover:opacity-80 transition-opacity"
                 >
                    Adicionar tarefa
                 </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar relative p-6 pt-4 pb-20">
                <div className="flex flex-col gap-2">
                   {stage.tasks.map(t => (
                      <div key={t.id} className="bg-[#2c2c2c] rounded-[14px] p-4 flex items-center justify-between gap-3 group">
                         <div className="flex items-center gap-3 overflow-hidden">
                             <div className="w-5 h-5 rounded-full border-2 border-[#555] flex-shrink-0" />
                             <span className="text-white text-[14px] truncate">{t.title || 'Nova tarefa...'}</span>
                         </div>
                         <button onClick={() => {
                             setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: s.tasks.filter(task => task.id !== t.id) } : s))}
                         } className="text-[#73777d] hover:text-[#ff3838] flex-shrink-0">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   ))}
                </div>
                
                {/* Fade out top border */}
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#1f1f1f] to-transparent pointer-events-none z-20" />
                {/* Fade out bottom border */}
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#1f1f1f] to-transparent pointer-events-none z-20" />
            </div>
          </motion.div>
          );
        })()}

        {editingStageTaskId && (() => {
          const stage = goalStages.find(s => s.id === editingStageId);
          if (!stage) return null;
          const task = stage.tasks.find(t => t.id === editingStageTaskId);
          if (!task) return null;
          
          return (
          <motion.div key="stageTaskEditModal"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[130] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 shrink-0 border-b border-white/[0.04]">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-[18px]">Título da Tarefa</h3>
              </div>
              <button onClick={() => {
                 if (!task.title.trim()) {
                    setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: s.tasks.filter(t => t.id !== editingStageTaskId) } : s));
                 }
                 setEditingStageTaskId(null);
              }} className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>
            
            <div className="p-6 pb-12">
                <input 
                  type="text" 
                  placeholder="Digite o título da tarefa..."
                  value={task.title}
                  onChange={e => {
                      setGoalStages(goalStages.map(s => s.id === editingStageId ? { 
                         ...s, 
                         tasks: s.tasks.map(t => t.id === editingStageTaskId ? { ...t, title: e.target.value } : t)
                      } : s));
                  }}
                  className="w-full bg-transparent border-none outline-none text-white text-[20px] font-bold placeholder-[#73777d]"
                  autoFocus
                />
            </div>
          </motion.div>
          );
        })()}"""

text = re.sub(old_modal, new_modal, text, flags=re.MULTILINE | re.DOTALL)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
