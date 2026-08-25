const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoalAI.tsx', 'utf8');

const oldCard = `                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#282828] rounded-[14px] p-4 flex flex-col gap-3 flex-shrink-0 border border-[#3a3a3a]"
                  >
                    <div className="flex flex-col gap-1">
                       <h3 className="text-white font-bold text-[16px] leading-[22px] break-words">{goal.title}</h3>
                       {goal.description && <p className="text-[#a0a0a0] text-[13px]">{goal.description}</p>}
                       {(goal.startDate || goal.endDate) && (
                         <div className="text-[12px] text-[#ff3838] font-medium flex gap-1 mt-1">
                            {goal.startDate && <span>Início: {goal.startDate} {goal.startTime}</span>}
                            {goal.endDate && <span>Fim: {goal.endDate} {goal.endTime}</span>}
                         </div>
                       )}
                    </div>
                    
                    {goal.stages && goal.stages.length > 0 && (
                       <div className="flex flex-col gap-2 mt-2 pl-3 border-l-2 border-[#4f4f4f]">
                          {goal.stages.map((stage: any, idx: number) => (
                            <div key={stage.id || idx} className="flex flex-col gap-1">
                               <h4 className="text-white font-medium text-[14px]">{stage.title}</h4>
                               {(stage.startDate || stage.endDate) && (
                                 <div className="text-[11px] text-[#a0a0a0] flex gap-1">
                                    {stage.startDate && <span>Início: {stage.startDate} {stage.startTime}</span>}
                                    {stage.endDate && <span>Fim: {stage.endDate} {stage.endTime}</span>}
                                 </div>
                               )}
                               {stage.tasks && stage.tasks.length > 0 && (
                                  <ul className="flex flex-col gap-1 mt-1 pl-2">
                                     {stage.tasks.map((task: any, tIdx: number) => (
                                        <li key={task.id || tIdx} className="text-[#cfcfcf] text-[13px] flex items-center gap-1.5">
                                           <div className="w-1 h-1 bg-[#ff3838] rounded-full" />
                                           {task.title}
                                        </li>
                                     ))}
                                  </ul>
                               )}
                            </div>
                          ))}
                       </div>
                    )}
                  </motion.div>`;

const newCard = `                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#282828] rounded-[14px] py-4 pl-4 pr-5 flex flex-col items-start justify-start flex-shrink-0"
                  >
                    <div className="flex flex-col justify-start flex-1 min-w-0 w-full">
                       <p className="text-white font-roboto font-normal text-[15px] leading-[22px] w-full break-words whitespace-normal">
                         {goal.title}
                       </p>
                       {goal.description && <p className="text-[#a0a0a0] text-[13px] font-roboto mt-1">{goal.description}</p>}
                       {(goal.startDate || goal.endDate) && (
                         <div className="text-[12px] text-[#ff3838] font-medium flex gap-1 mt-1 font-roboto">
                            {goal.startDate && <span>Início: {goal.startDate} {goal.startTime}</span>}
                            {goal.endDate && <span>Fim: {goal.endDate} {goal.endTime}</span>}
                         </div>
                       )}
                    </div>
                    
                    {goal.stages && goal.stages.length > 0 && (
                       <div className="flex flex-col gap-2 mt-3 pl-3 border-l-2 border-[#4f4f4f] w-full">
                          {goal.stages.map((stage: any, idx: number) => (
                            <div key={stage.id || idx} className="flex flex-col gap-1 w-full">
                               <p className="text-white font-roboto font-normal text-[14px] leading-[20px] w-full break-words whitespace-normal">{stage.title}</p>
                               {(stage.startDate || stage.endDate) && (
                                 <div className="text-[11px] text-[#a0a0a0] flex gap-1 font-roboto">
                                    {stage.startDate && <span>Início: {stage.startDate} {stage.startTime}</span>}
                                    {stage.endDate && <span>Fim: {stage.endDate} {stage.endTime}</span>}
                                 </div>
                               )}
                               {stage.tasks && stage.tasks.length > 0 && (
                                  <ul className="flex flex-col gap-1 mt-1 pl-2 w-full">
                                     {stage.tasks.map((task: any, tIdx: number) => (
                                        <li key={task.id || tIdx} className="text-[#cfcfcf] font-roboto font-normal text-[13px] leading-[18px] flex items-center gap-1.5 break-words whitespace-normal">
                                           <div className="w-1 h-1 bg-[#ff3838] rounded-full shrink-0" />
                                           <span>{task.title}</span>
                                        </li>
                                     ))}
                                  </ul>
                               )}
                            </div>
                          ))}
                       </div>
                    )}
                  </motion.div>`;

code = code.replace(oldCard, newCard);
fs.writeFileSync('src/components/ScreenGoalAI.tsx', code);
console.log('Fixed card UI');
