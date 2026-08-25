import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    content = f.read()

start_marker = "{/* Scrollable Content */}"
end_marker = """              </motion.div>
            </motion.div>
          );"""

new_content = """                {/* Scrollable Content */}
                <div className="flex-1 relative overflow-hidden flex -mx-6 px-6 pt-6 pb-12">
                  
                  {/* Timeline View */}
                  <motion.div
                    initial={false}
                    animate={{ x: goalDetailsView === 'timeline' ? '0%' : '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="w-full shrink-0 h-full overflow-y-auto no-scrollbar relative z-10"
                  >
                    <div className="flex flex-col relative pb-10">
                      {/* Vertical Timeline Line */}
                      {selectedGoal.stages && selectedGoal.stages.length > 0 && (
                        <div className="absolute left-[7px] top-[14px] bottom-0 w-0.5 bg-[#333333] z-0" />
                      )}
                      
                      {(!selectedGoal.stages || selectedGoal.stages.length === 0) && (
                         <div className="text-center text-[#73777d] text-[14px] py-8">Nenhuma etapa adicionada.</div>
                      )}

                      {selectedGoal.stages?.map((stage, idx) => (
                        <div key={stage.id} className="relative mb-8 last:mb-0">
                          {/* Timeline Dot & Stage Title */}
                          <div className="flex items-center gap-4 mb-2 relative z-10 bg-[#1f1f1f] py-1">
                            <div className="w-4 h-4 rounded-full bg-[#ff3838] flex items-center justify-center shrink-0 ring-4 ring-[#1f1f1f]" />
                            <span className="text-white font-bold text-[16px] leading-[22px]">Etapa {idx + 1}</span>
                          </div>
                          
                          {/* Stage Content */}
                          <div className="pl-8 flex flex-col gap-2">
                            {stage.title && <p className="text-white font-bold text-[15px] leading-[22px] whitespace-normal break-words">{stage.title}</p>}
                            {stage.description && <span className="text-[#a0a0a0] text-[14px] whitespace-normal break-words">{stage.description}</span>}
                            
                            {/* Tasks inside stage */}
                            {stage.tasks.length > 0 && (
                              <div className="flex flex-col gap-3 mt-3 pl-4 border-l-2 border-[#2c2c2c]">
                                {stage.tasks.map(t => (
                                   <div key={t.id} className="flex items-start gap-3 cursor-pointer group" onClick={(e) => {
                                      e.stopPropagation();
                                      const newStages = selectedGoal.stages?.map(s => s.id === stage.id ? { ...s, tasks: s.tasks.map(task => task.id === t.id ? { ...task, completed: !task.completed } : task) } : s) || [];
                                      updateGoal(selectedGoal.id, { stages: newStages });
                                      setSelectedGoal({ ...selectedGoal, stages: newStages });
                                   }}>
                                      <div className={`w-5 h-5 rounded-full border ${t.completed ? 'bg-[#ff3838] border-[#ff3838]' : 'border-[#F0F0F0] group-hover:bg-white/10'} flex items-center justify-center shrink-0 transition-colors mt-[1px]`}>
                                        <Check className={`w-3 h-3 text-white ${t.completed ? 'opacity-100' : 'opacity-0'} transition-opacity`} strokeWidth={3} />
                                      </div>
                                      <span className={`text-[15px] leading-[22px] flex-1 whitespace-normal break-words transition-colors ${t.completed ? 'text-[#73777d] line-through' : 'text-[#e8e8e9]'}`}>{t.title}</span>
                                   </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Details View */}
                  <motion.div
                    initial={false}
                    animate={{ x: goalDetailsView === 'timeline' ? '0%' : '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="w-full shrink-0 h-full overflow-y-auto no-scrollbar relative z-10 pl-12"
                  >
                     <div className="flex flex-col gap-6 pb-10">
                       <div className="flex flex-col gap-2">
                         <h3 className="text-[#73777d] text-[14px] font-bold uppercase tracking-wider">Descrição</h3>
                         <p className="text-white text-[15px] leading-[24px] whitespace-normal break-words">
                           {selectedGoal.description || "Nenhuma descrição adicionada."}
                         </p>
                       </div>

                       <div className="flex flex-col gap-2">
                         <h3 className="text-[#73777d] text-[14px] font-bold uppercase tracking-wider">Início</h3>
                         <p className="text-white text-[15px] leading-[24px]">
                           {selectedGoal.startDate ? `${selectedGoal.startDate}${selectedGoal.startTime ? ` às ${selectedGoal.startTime}` : ''}` : "Não definido"}
                         </p>
                       </div>

                       <div className="flex flex-col gap-2">
                         <h3 className="text-[#73777d] text-[14px] font-bold uppercase tracking-wider">Prazo Final</h3>
                         <p className="text-white text-[15px] leading-[24px]">
                           {selectedGoal.endDate ? `${selectedGoal.endDate}${selectedGoal.endTime ? ` às ${selectedGoal.endTime}` : ''}` : "Não definido"}
                         </p>
                       </div>
                     </div>
                  </motion.div>
                  
                  {/* Bottom gradient inside scroll wrapper */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1f1f1f] to-transparent pointer-events-none z-20" />
                </div>

                <div className="flex gap-3 shrink-0 mt-5 relative z-10">
                  <button
                    onClick={() => setGoalDetailsView(goalDetailsView === 'timeline' ? 'details' : 'timeline')}
                    className="flex-1 bg-transparent border border-[#cfcfcf] text-[#cfcfcf] rounded-[14px] h-[40px] font-normal text-[14px] active:scale-[0.98] transition flex items-center justify-center gap-2"
                  >
                    <ChevronRight className={`w-4 h-4 text-[#cfcfcf] transition-transform ${goalDetailsView === 'details' ? 'rotate-180' : ''}`} />
                    {goalDetailsView === 'timeline' ? 'Detalhes' : 'Jornada'}
                  </button>

                  <AnimatePresence mode="popLayout">
                    {goalDetailsView === 'details' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, width: 0 }}
                        animate={{ opacity: 1, scale: 1, width: 'auto' }}
                        exit={{ opacity: 0, scale: 0.8, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 shrink-0"
                      >
                        <button
                          onClick={() => {
                            setNewGoalTitle(selectedGoal.title);
                            setGoalStages(selectedGoal.stages || []);
                            setNewGoalStartDate(selectedGoal.startDate || '');
                            setNewGoalStartTime(selectedGoal.startTime || '');
                            setNewGoalEndDate(selectedGoal.endDate || '');
                            setNewGoalEndTime(selectedGoal.endTime || '');
                            setNewGoalDescription(selectedGoal.description || '');
                            setEditingGoalId(selectedGoal.id);
                            setSelectedGoal(null);
                            setIsAddModalOpen(true);
                          }}
                          className="px-4 bg-transparent border border-[#cfcfcf] text-[#cfcfcf] rounded-[14px] h-[40px] font-normal text-[14px] active:scale-[0.98] transition flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-4 h-4 text-[#cfcfcf]" />
                        </button>
                        <button
                          onClick={() => {
                            deleteGoal(selectedGoal.id);
                            setSelectedGoal(null);
                          }}
                          className="px-4 bg-transparent border border-[#ff3838] text-[#ff3838] rounded-[14px] h-[40px] font-normal text-[14px] active:scale-[0.98] transition flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 text-[#ff3838]" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          );"""

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_content + content[end_idx + len(end_marker):]
    with open("src/components/ScreenGoals.tsx", "w") as f:
        f.write(content)
    print("Replaced content successfully.")
else:
    print("Markers not found.")
