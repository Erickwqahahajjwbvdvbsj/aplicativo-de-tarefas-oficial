import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Replace the "Criar tarefas para essa etapa" button
old_button = """               <button
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
               </button>"""

new_button = """               <button
                  onClick={() => setManagingTasksForStageId(stage.id)}
                  className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
               >
                  <span className="truncate mr-2">
                      {stage.tasks.length > 0 ? <span className="text-white">{stage.tasks.length} tarefa{stage.tasks.length !== 1 ? 's' : ''} adicionada{stage.tasks.length !== 1 ? 's' : ''}</span> : <span className="text-[#73777d]">Criar tarefas para essa etapa</span>}
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0 text-[#73777d]" />
               </button>"""

text = text.replace(old_button, new_button)

# Replace the tasks map in managingTasksModal
old_task_card = """                  <div key={t.id} className="bg-[#2c2c2c] rounded-[14px] p-4 flex items-center justify-between gap-3 group relative z-10 shrink-0">
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
                  </div>"""

new_task_card = """                  <div key={t.id} className="bg-[#282828] rounded-[14px] py-4 pl-4 pr-5 flex items-start justify-start relative z-10 shrink-0">
                     <div className="w-[22px] h-[22px] rounded-full border border-[#F0F0F0] flex items-center justify-center shrink-0 mr-3 mt-0.5"></div>
                     <div className="flex flex-col justify-start flex-1 min-w-0">
                         <textarea
                           value={t.title}
                           onChange={(e) => {
                               e.target.style.height = 'auto';
                               e.target.style.height = e.target.scrollHeight + 'px';
                               setGoalStages(goalStages.map(s => s.id === managingTasksForStageId ? { 
                                   ...s, 
                                   tasks: s.tasks.map(task => task.id === t.id ? { ...task, title: e.target.value } : task) 
                               } : s));
                           }}
                           className="bg-transparent border-none outline-none text-white font-roboto font-normal text-[15px] leading-[22px] w-full resize-none overflow-hidden p-0 m-0"
                           rows={1}
                         />
                     </div>
                  </div>"""

text = text.replace(old_task_card, new_task_card)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
