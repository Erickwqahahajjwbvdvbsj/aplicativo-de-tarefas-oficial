import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_btn = """                              <button
                  onClick={() => setManagingTasksForStageId(stage.id)}
                  className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
               >
                  <span className="truncate mr-2">
                      {stage.tasks.length > 0 ? <span className="text-white">{stage.tasks.length} tarefa{stage.tasks.length !== 1 ? 's' : ''} adicionada{stage.tasks.length !== 1 ? 's' : ''}</span> : <span className="text-[#73777d]">Criar tarefas para essa etapa</span>}
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0 text-[#73777d]" />
               </button>"""

new_btn = """                              <button
                  onClick={() => setManagingTasksForStageId(stage.id)}
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-left outline-none focus:ring-0 focus:border-transparent transition-colors hover:bg-[#3a3a3a] block"
               >
                  {stage.tasks.length > 0 ? <span className="text-white">{stage.tasks.length} tarefa{stage.tasks.length !== 1 ? 's' : ''} adicionada{stage.tasks.length !== 1 ? 's' : ''}</span> : <span className="text-[#73777d]">Criar tarefas para essa etapa</span>}
               </button>"""

text = text.replace(old_btn, new_btn)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
