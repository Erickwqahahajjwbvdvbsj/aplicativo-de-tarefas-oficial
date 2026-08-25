import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_card = """                goalStages.map((stage, idx) => (
                  <div key={stage.id} 
                       className={`bg-[#282828] rounded-[14px] px-4 min-h-[76px] flex flex-col relative z-10 shrink-0 cursor-pointer ${(stage.title || stage.tasks.length > 0) ? 'justify-start py-3' : 'justify-center py-2'}`}
                       onClick={() => setEditingStageId(stage.id)}
                  >
                     <div className="flex justify-between items-center w-full">
                        <span className="text-white font-bold text-[16px]">Etapa {idx + 1}</span>
                        <div className="relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setOpenStageMenuId(openStageMenuId === stage.id ? null : stage.id); }} 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[#73777d] hover:text-white transition-colors hover:bg-white/10"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            {openStageMenuId === stage.id && (
                                <div className="absolute right-0 top-8 w-[120px] bg-[#1f1f1f] rounded-[10px] shadow-lg border border-[#4f4f4f] overflow-hidden z-[100]">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setGoalStages(goalStages.filter(s => s.id !== stage.id)); setOpenStageMenuId(null); }}
                                        className="w-full px-4 py-3 text-left text-[14px] text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
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
                         <span className="text-[#a0a0a0] text-[12px] mt-1 block">
                             {stage.tasks.length} tarefa{stage.tasks.length !== 1 ? 's' : ''}
                         </span>
                     )}
                  </div>
                ))"""

new_card = """                goalStages.map((stage, idx) => (
                  <div key={stage.id} 
                       className="bg-[#282828] rounded-[14px] py-4 pl-4 pr-5 flex flex-col justify-center relative z-10 shrink-0 cursor-pointer transition-all"
                       onClick={() => setEditingStageId(stage.id)}
                  >
                     <div className={`flex justify-between w-full ${(stage.title || stage.tasks.length > 0) ? 'items-start' : 'items-center'}`}>
                        <span className="text-white font-bold text-[16px] leading-[22px]">Etapa {idx + 1}</span>
                        <div className="relative flex items-center justify-center -my-1">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setOpenStageMenuId(openStageMenuId === stage.id ? null : stage.id); }} 
                                className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            {openStageMenuId === stage.id && (
                                <div className="absolute right-0 top-8 w-[120px] bg-[#1f1f1f] rounded-[10px] shadow-lg border border-[#4f4f4f] overflow-hidden z-[100]">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setGoalStages(goalStages.filter(s => s.id !== stage.id)); setOpenStageMenuId(null); }}
                                        className="w-full px-4 py-3 text-left text-[14px] text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
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
                         <span className="text-[#a0a0a0] text-[12px] mt-1 block">
                             {stage.tasks.length} tarefa{stage.tasks.length !== 1 ? 's' : ''}
                         </span>
                     )}
                  </div>
                ))"""

text = text.replace(old_card, new_card)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
