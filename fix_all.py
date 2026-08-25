import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# 1. Replace the list of goal stages
old_stages_list = r"""                goalStages\.map\(\(stage, idx\) => \(
                  <div key=\{stage\.id\} className="bg-\[\#2c2c2c\] rounded-\[14px\] p-4 flex flex-col gap-2">
                     <div className="flex items-center justify-between">
                        <span className="text-\[\#a0a0a0\] text-\[12px\] font-bold uppercase tracking-wider">Etapa \{idx \+ 1\}<\/span>
                        <button onClick=\{\(\) => setGoalStages\(goalStages\.filter\(s => s\.id !== stage\.id\)\)\} className="text-\[\#73777d\] hover:text-\[\#ff3838\] transition-colors"><Trash2 className="w-4 h-4" \/><\/button>
                     <\/div>
                     <input 
                        type="text" 
                        placeholder="Título da etapa" 
                        value=\{stage\.title\}
                        onChange=\{e => setGoalStages\(goalStages\.map\(s => s\.id === stage\.id \? \{ \.\.\.s, title: e\.target\.value \} : s\)\)\}
                        className="bg-transparent border-none outline-none text-white text-\[16px\] font-medium placeholder-\[\#73777d\] w-full"
                     \/>
                     <textarea 
                        placeholder="Descrição da etapa \(opcional\)" 
                        value=\{stage\.description\}
                        onChange=\{e => setGoalStages\(goalStages\.map\(s => s\.id === stage\.id \? \{ \.\.\.s, description: e\.target\.value \} : s\)\)\}
                        className="bg-transparent border-none outline-none text-\[\#a0a0a0\] text-\[14px\] placeholder-\[\#555\] w-full resize-none h-\[40px\] no-scrollbar"
                     \/>
                     <div className="flex flex-col gap-1 mt-2">
                        \{stage\.tasks\.map\(t => \(
                          <div key=\{t\.id\} className="flex items-center justify-between">
                             <span className="text-\[\#e8e8e9\] text-\[14px\]">• \{t\.title\}<\/span>
                             <button onClick=\{\(\) => setGoalStages\(goalStages\.map\(s => s\.id === stage\.id \? \{ \.\.\.s, tasks: s\.tasks\.filter\(task => task\.id !== t\.id\) \} : s\)\)\} className="text-\[\#73777d\] hover:text-\[\#ff3838\]"><X className="w-3 h-3" \/><\/button>
                          <\/div>
                        \)\)\}
                        <button onClick=\{\(\) => setEditingStageId\(stage\.id\)\} className="flex items-center gap-1 text-\[\#ff3838\] text-\[12px\] font-medium mt-1 w-fit hover:opacity-80 transition-opacity">
                          <Plus className="w-3 h-3" \/> Adicionar Tarefa
                        <\/button>
                     <\/div>
                  <\/div>
                \)\)"""

new_stages_list = """                goalStages.map((stage, idx) => (
                  <div key={stage.id} className="bg-[#2c2c2c] rounded-[14px] p-4 flex items-center justify-between gap-2">
                     <div className="flex flex-col gap-1 pr-2 flex-1 min-w-0">
                        <span className="text-white font-bold text-[16px] truncate">Etapa {idx + 1}:{stage.title ? ` ${stage.title}` : ''}</span>
                        {stage.tasks.length > 0 && <span className="text-[#a0a0a0] text-[12px]">{stage.tasks.length} tarefa{stage.tasks.length !== 1 ? 's' : ''}</span>}
                     </div>
                     <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setEditingStageId(stage.id)} className="w-9 h-9 rounded-full bg-[#1f1f1f] flex items-center justify-center text-[#73777d] hover:text-white transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setGoalStages(goalStages.filter(s => s.id !== stage.id))} className="w-9 h-9 rounded-full bg-[#1f1f1f] flex items-center justify-center text-[#73777d] hover:text-[#ff3838] transition-colors">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                ))"""

text = re.sub(old_stages_list, new_stages_list, text, flags=re.MULTILINE | re.DOTALL)

# 2. Replace floating button
old_floating_button = r"""            <div className="absolute bottom-6 right-6 z-20">
               <button 
                 onClick=\{\(\) => \{
                   const newStage = \{ id: Date.now\(\)\.toString\(\), title: `Etapa \$\{goalStages\.length \+ 1\}`, description: '', tasks: \[\] \};
                   setGoalStages\(\[\.\.\.goalStages, newStage\]\);
                 \}\}
                 className="w-14 h-14 rounded-full bg-\[\#ff3838\] text-white flex items-center justify-center shadow-\[0_4px_20px_rgba\(255,56,56,0\.4\)\] hover:scale-105 active:scale-95 transition-all"
               >
                 <Plus className="w-7 h-7" \/>
               <\/button>
            <\/div>"""

new_floating_button = """            <div className="absolute bottom-6 right-6 z-20">
               <button 
                 onClick={() => {
                   const newStage = { id: Date.now().toString(), title: '', description: '', tasks: [] };
                   setGoalStages([...goalStages, newStage]);
                 }}
                 className="w-14 h-14 rounded-full bg-[#ff3838] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
               >
                 <Plus className="w-7 h-7" />
               </button>
            </div>"""

text = re.sub(old_floating_button, new_floating_button, text, flags=re.MULTILINE | re.DOTALL)

# 3. Replace editingStageId modal
old_editing_modal = r"""        \{editingStageId && \(
          <motion\.div key="stageTaskModal"
            initial=\{\{ opacity: 0 \}\}
            animate=\{\{ opacity: 1 \}\}
            exit=\{\{ opacity: 0 \}\}
            transition=\{\{ duration: 0\.2 \}\}
            className="absolute inset-0 bg-black\/80 z-\[150\] flex flex-col justify-end overflow-hidden"
            onClick=\{\(\) => setEditingStageId\(null\)\}
          >
            <motion\.div
              initial=\{\{ y: "100%" \}\}
              animate=\{\{ y: 0, transition: \{ type: "spring", damping: 25, stiffness: 200 \} \}\}
              exit=\{\{ y: "100%", transition: \{ type: "spring", damping: 25, stiffness: 200 \} \}\}
              className="absolute bottom-0 left-0 w-full bg-\[\#1f1f1f\] shadow-\[0_-20px_40px_rgba\(0,0,0,0\.5\)\] rounded-t-\[30px\] p-6 z-\[160\] border-t border-\[\#4f4f4f\]"
              onClick=\{\(e\) => e\.stopPropagation\(\)\}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-\[20px\]">Nova Tarefa da Etapa<\/h3>
                <button onClick=\{\(\) => setEditingStageId\(null\)\} className="w-8 h-8 flex items-center justify-center rounded-full bg-\[\#2c2c2c\] text-gray-400 hover:text-white">
                  <ChevronRight className="w-4 h-4 rotate-90" \/>
                <\/button>
              <\/div>
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Título da tarefa\.\.\."
                  value=\{newStageTaskTitle\}
                  onChange=\{e => setNewStageTaskTitle\(e\.target\.value\)\}
                  className="w-full shrink-0 bg-\[\#2c2c2c\] border border-transparent rounded-\[14px\] px-5 py-4 text-\[14px\] text-\[\#e8e8e9\] outline-none focus:ring-0 focus:border-transparent placeholder-\[\#73777d\]"
                  autoFocus
                \/>
                <button 
                  onClick=\{\(\) => \{
                    if \(newStageTaskTitle\.trim\(\)\) \{
                       setGoalStages\(goalStages\.map\(s => s\.id === editingStageId \? \{ \.\.\.s, tasks: \[\.\.\.s\.tasks, \{ id: Date\.now\(\)\.toString\(\), title: newStageTaskTitle\.trim\(\), completed: false \}\] \} : s\)\);
                       setNewStageTaskTitle\(""\);
                       setEditingStageId\(null\);
                    \}
                  \}\}
                  className="w-full py-4 rounded-\[14px\] text-white text-\[14px\] font-bold bg-\[\#ff3838\] hover:bg-\[\#ff3838\]\/90 transition-colors"
                >
                  Adicionar Tarefa
                <\/button>
              <\/div>
            <\/motion\.div>
          <\/motion\.div>
        \)\}"""

new_editing_modal = """        {editingStageId && (() => {
          const stage = goalStages.find(s => s.id === editingStageId);
          const stageIdx = goalStages.findIndex(s => s.id === editingStageId);
          if (!stage) return null;
          return (
          <motion.div key="stageTaskModal"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-[#1f1f1f] z-[120] flex flex-col overflow-hidden"
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

            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              <div className="flex flex-col gap-5 pb-12">
                 <div className="flex items-center gap-2 border-b border-[#4f4f4f] pb-2 focus-within:border-white transition-colors">
                    <span className="text-white font-bold text-[16px] shrink-0">Etapa {stageIdx + 1}:</span>
                    <input 
                       type="text" 
                       placeholder="Título da etapa (opcional)" 
                       value={stage.title}
                       onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, title: e.target.value } : s))}
                       className="bg-transparent border-none outline-none text-white text-[16px] font-medium placeholder-[#73777d] w-full"
                    />
                 </div>
                 
                 <textarea 
                    placeholder="Adicione uma descrição para a etapa (opcional)..." 
                    value={stage.description}
                    onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, description: e.target.value } : s))}
                    className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-[#e8e8e9] h-[100px] resize-none outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d] no-scrollbar"
                 />

                 <div className="mt-2">
                    <h4 className="text-[#73777d] text-[14px] mb-3">Tarefas da Etapa</h4>
                    <div className="flex flex-col gap-2">
                       {stage.tasks.length === 0 ? (
                         <div className="text-[#555] text-[13px] bg-[#2c2c2c] rounded-[14px] p-4 text-center">Nenhuma tarefa adicionada.</div>
                       ) : (
                         stage.tasks.map(t => (
                           <div key={t.id} className="bg-[#2c2c2c] rounded-[14px] p-4 flex items-center justify-between gap-3">
                              <span className="text-white text-[14px] break-words whitespace-normal leading-tight">{t.title}</span>
                              <button onClick={() => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: s.tasks.filter(task => task.id !== t.id) } : s))} className="text-[#73777d] hover:text-[#ff3838] shrink-0">
                                <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                         ))
                       )}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                       <input 
                         type="text" 
                         placeholder="Adicionar nova tarefa..."
                         value={newStageTaskTitle}
                         onChange={e => setNewStageTaskTitle(e.target.value)}
                         onKeyDown={(e) => {
                            if (e.key === 'Enter' && newStageTaskTitle.trim()) {
                                setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: [...s.tasks, { id: Date.now().toString(), title: newStageTaskTitle.trim(), completed: false }] } : s));
                                setNewStageTaskTitle("");
                            }
                         }}
                         className="flex-1 shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-4 py-3 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d]"
                       />
                       <button
                         onClick={() => {
                            if (newStageTaskTitle.trim()) {
                                setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: [...s.tasks, { id: Date.now().toString(), title: newStageTaskTitle.trim(), completed: false }] } : s));
                                setNewStageTaskTitle("");
                            }
                         }}
                         className="w-[46px] h-[46px] shrink-0 rounded-[14px] bg-[#ff3838] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                       >
                         <Plus className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
          );
        })()}"""

text = re.sub(old_editing_modal, new_editing_modal, text, flags=re.MULTILINE | re.DOTALL)


with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

