import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_form = r"""              <div className="flex flex-col gap-4 pb-0 no-scrollbar">.*?<\/AnimatePresence>\n              <\/div>"""

new_form = """              <div className="relative overflow-hidden min-h-[300px]">
                <AnimatePresence initial={false} mode="wait">
                  {creationStep === 1 ? (
                    <motion.div 
                      key="step1"
                      initial={{ x: "-100%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "-100%", opacity: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="flex flex-col gap-4 pb-0 no-scrollbar w-full"
                    >
                      <input
                        type="text"
                        maxLength={100}
                        placeholder="Título da sua jornada: limite 100 caracteres"
                        className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d]"
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                      />
                      
                      <textarea
                        placeholder="Adicione uma descrição para a jornada..."
                        className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-[#e8e8e9] h-[100px] resize-none outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d] no-scrollbar"
                        value={newGoalDescription}
                        onChange={(e) => setNewGoalDescription(e.target.value)}
                      />

                      <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory shrink-0 pb-2 -mx-6 px-6 scroll-px-6">
                        <button 
                           onClick={() => {
                              setIsStartPickerOpen(!isStartPickerOpen);
                              setIsStartDatePickerOpen(false);
                              setIsStartTimePickerOpen(false);
                              setIsEndDatePickerOpen(false);
                              setIsEndPickerOpen(false);
                              setIsEndTimePickerOpen(false);
                           }}
                           className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                        >
                           <span className="truncate mr-2">{newGoalStartDate || newGoalStartTime ? <span className="text-white">{`${newGoalStartDate ? new Date(newGoalStartDate + 'T12:00:00').toLocaleDateString('pt-BR') : ''}${(newGoalStartDate && newGoalStartTime) ? ' às ' : ''}${newGoalStartTime || ''}`}</span> : <span className="text-[#73777d]">Início da Jornada</span>}</span>
                           <ChevronRight className={`w-4 h-4 shrink-0 text-[#73777d] transition-transform ${isStartPickerOpen ? "rotate-90" : ""}`} />
                        </button>
                        <button 
                           onClick={() => {
                              setIsEndPickerOpen(!isEndPickerOpen);
                              setIsEndDatePickerOpen(false);
                              setIsEndTimePickerOpen(false);
                              setIsStartDatePickerOpen(false);
                              setIsStartPickerOpen(false);
                           }}
                           className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                        >
                           <span className="truncate mr-2">{newGoalEndDate || newGoalEndTime ? <span className="text-white">{`${newGoalEndDate ? new Date(newGoalEndDate + 'T12:00:00').toLocaleDateString('pt-BR') : ''}${(newGoalEndDate && newGoalEndTime) ? ' às ' : ''}${newGoalEndTime || ''}`}</span> : <span className="text-[#73777d]">Prazo Final</span>}</span>
                           <ChevronRight className={`w-4 h-4 shrink-0 text-[#73777d] transition-transform ${isEndPickerOpen ? "rotate-90" : ""}`} />
                        </button>
                      </div>

                      <AnimatePresence>
                      {newGoalTitle.trim() !== '' && newGoalStartDate !== '' && newGoalEndDate !== '' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, height: 0, marginTop: -16 }}
                          animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 0 }}
                          exit={{ opacity: 0, y: 10, height: 0, marginTop: -16 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <button
                            onClick={() => setCreationStep(2)}
                            className="w-full bg-[#ff3838] hover:bg-[#ff3838]/90 text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors mt-2"
                          >
                            Prosseguir <ChevronRight className="w-5 h-5" />
                          </button>
                        </motion.div>
                      )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="step2"
                      initial={{ x: "100%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "100%", opacity: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="flex flex-col gap-4 pb-0 no-scrollbar w-full min-h-[300px]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setCreationStep(1)} className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <h3 className="text-white font-bold text-[18px]">Adicionar Etapas à Jornada</h3>
                        </div>
                        <button 
                          onClick={() => {
                            const newStage = { id: Date.now().toString(), title: `Etapa ${goalStages.length + 1}`, description: '', tasks: [] };
                            setGoalStages([...goalStages, newStage]);
                          }}
                          className="w-8 h-8 rounded-full bg-[#2c2c2c] hover:bg-[#ff3838] text-white flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-3 overflow-y-auto max-h-[40vh] no-scrollbar">
                        {goalStages.length === 0 ? (
                          <div className="text-center text-[#73777d] text-[14px] py-8">Nenhuma etapa adicionada.</div>
                        ) : (
                          goalStages.map((stage, idx) => (
                            <div key={stage.id} className="bg-[#2c2c2c] rounded-[14px] p-4 flex flex-col gap-2">
                               <div className="flex items-center justify-between">
                                  <span className="text-[#a0a0a0] text-[12px] font-bold uppercase tracking-wider">Etapa {idx + 1}</span>
                                  <button onClick={() => setGoalStages(goalStages.filter(s => s.id !== stage.id))} className="text-[#73777d] hover:text-[#ff3838] transition-colors"><Trash2 className="w-4 h-4" /></button>
                               </div>
                               <input 
                                  type="text" 
                                  placeholder="Título da etapa" 
                                  value={stage.title}
                                  onChange={e => setGoalStages(goalStages.map(s => s.id === stage.id ? { ...s, title: e.target.value } : s))}
                                  className="bg-transparent border-none outline-none text-white text-[16px] font-medium placeholder-[#73777d] w-full"
                               />
                               <textarea 
                                  placeholder="Descrição da etapa (opcional)" 
                                  value={stage.description}
                                  onChange={e => setGoalStages(goalStages.map(s => s.id === stage.id ? { ...s, description: e.target.value } : s))}
                                  className="bg-transparent border-none outline-none text-[#a0a0a0] text-[14px] placeholder-[#555] w-full resize-none h-[40px] no-scrollbar"
                               />
                               <div className="flex flex-col gap-1 mt-2">
                                  {stage.tasks.map(t => (
                                    <div key={t.id} className="flex items-center justify-between">
                                       <span className="text-[#e8e8e9] text-[14px]">• {t.title}</span>
                                       <button onClick={() => setGoalStages(goalStages.map(s => s.id === stage.id ? { ...s, tasks: s.tasks.filter(task => task.id !== t.id) } : s))} className="text-[#73777d] hover:text-[#ff3838]"><X className="w-3 h-3" /></button>
                                    </div>
                                  ))}
                                  <button onClick={() => setEditingStageId(stage.id)} className="flex items-center gap-1 text-[#ff3838] text-[12px] font-medium mt-1 w-fit hover:opacity-80 transition-opacity">
                                    <Plus className="w-3 h-3" /> Adicionar Tarefa
                                  </button>
                               </div>
                            </div>
                          ))
                        )}
                      </div>

                      <AnimatePresence>
                      {goalStages.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, height: 0, marginTop: -16 }}
                          animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 0 }}
                          exit={{ opacity: 0, y: 10, height: 0, marginTop: -16 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mt-2"
                        >
                          <button
                             onClick={handleCreateGoal}
                             disabled={isSaving}
                             className="w-full bg-[#ff3838] hover:bg-[#ff3838]/90 text-white font-bold py-4 rounded-[14px] flex items-center justify-center transition-colors"
                          >
                             {editingGoalId ? 'Salvar Alterações' : 'Salvar minha jornada'}
                          </button>
                        </motion.div>
                      )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>"""

text = re.sub(old_form, new_form, text, flags=re.MULTILINE | re.DOTALL)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)

