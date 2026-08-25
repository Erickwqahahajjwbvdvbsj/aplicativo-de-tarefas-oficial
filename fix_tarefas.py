import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_tarefas = r"""                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-\[\#73777d\] text-\[14px\] font-normal mb-1">Tarefas deste objetivo<\/h3>
                    \{goalTasks\.map\(\(task\) => \(.*?\}\)\)\}
                  <\/div>"""

new_tarefas = """                  {/* ETAPAS DA JORNADA */}
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-[#73777d] text-[14px] font-normal mb-1">Etapas da Jornada</h3>
                    <div className="flex flex-col gap-3">
                      {selectedGoal.stages?.map((stage, idx) => (
                        <div key={stage.id} className="flex flex-col bg-[#2c2c2c] rounded-[14px] p-4 gap-2">
                           <span className="text-white font-bold text-[16px]">Etapa {idx + 1}: {stage.title}</span>
                           {stage.description && <span className="text-[#a0a0a0] text-[14px]">{stage.description}</span>}
                           <div className="flex flex-col gap-1 mt-2">
                              {stage.tasks.map(t => (
                                 <div key={t.id} className="flex items-center gap-2 cursor-pointer" onClick={(e) => {
                                    e.stopPropagation();
                                    const newStages = selectedGoal.stages?.map(s => s.id === stage.id ? { ...s, tasks: s.tasks.map(task => task.id === t.id ? { ...task, completed: !task.completed } : task) } : s) || [];
                                    updateGoal(selectedGoal.id, { stages: newStages });
                                    setSelectedGoal({ ...selectedGoal, stages: newStages });
                                 }}>
                                    <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${t.completed ? 'text-green-500' : 'text-[#73777d]'}`} />
                                    <span className={`text-[14px] transition-colors ${t.completed ? 'text-[#73777d] line-through' : 'text-white'}`}>{t.title}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>"""

text = re.sub(old_tarefas, new_tarefas, text, flags=re.MULTILINE | re.DOTALL)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

