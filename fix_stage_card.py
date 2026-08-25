import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_card = """                goalStages.map((stage, idx) => (
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

new_card = """                goalStages.map((stage, idx) => (
                  <div key={stage.id} 
                       className="bg-[#282828] rounded-[14px] p-4 flex flex-col justify-start relative z-10 shrink-0 cursor-pointer"
                       onClick={() => setEditingStageId(stage.id)}
                  >
                     <div className="flex justify-between items-start w-full">
                        <span className="text-white font-bold text-[16px]">Etapa {idx + 1}</span>
                        <div className="relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setOpenStageMenuId(openStageMenuId === stage.id ? null : stage.id); }} 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[#73777d] hover:text-white transition-colors hover:bg-white/10"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            {openStageMenuId === stage.id && (
                                <div className="absolute right-0 top-10 w-[120px] bg-[#1f1f1f] rounded-[10px] shadow-lg border border-[#4f4f4f] overflow-hidden z-[100]">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setGoalStages(goalStages.filter(s => s.id !== stage.id)); setOpenStageMenuId(null); }}
                                        className="w-full px-4 py-3 text-left text-[14px] text-[#ff3838] hover:bg-white/5 flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" /> Excluir
                                    </button>
                                </div>
                            )}
                        </div>
                     </div>
                     {stage.title && (
                         <p className="text-white font-normal text-[15px] leading-[22px] mt-1 whitespace-normal break-words">
                             {stage.title}
                         </p>
                     )}
                     {stage.tasks.length > 0 && (
                         <span className="text-[#a0a0a0] text-[12px] mt-2 block">
                             {stage.tasks.length} tarefa{stage.tasks.length !== 1 ? 's' : ''}
                         </span>
                     )}
                  </div>
                ))"""

text = text.replace(old_card, new_card)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
