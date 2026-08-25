const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoalAI.tsx', 'utf8');

// replace useTasks with useGoals
code = code.replace(/import \{ useTasks \} from '\.\.\/hooks\/useTasks';/, `import { useGoals } from '../hooks/useGoals';`);
code = code.replace(/const \{ addTask \} = useTasks\(\);/, `const { addGoal } = useGoals();`);

// rename draftTasks to draftGoals
code = code.replace(/const \[draftTasks, setDraftTasks\] = useState<any\[\]>\(\[\]\);/g, `const [draftGoals, setDraftGoals] = useState<any[]>([]);`);
code = code.replace(/draftTasks/g, `draftGoals`);
code = code.replace(/setDraftTasks/g, `setDraftGoals`);

// enable backend call and use parse-goal
code = code.replace(/\/\/ Visual only for now\s*\/\*\s*const response = await fetch\('\/api\/gemini\/parse-goal'/g, `const response = await fetch('/api/gemini/parse-goal'`);
code = code.replace(/currentTasks: draftGoals/g, `currentGoals: draftGoals`);
code = code.replace(/const data = \{ tasks: \[\] \}; \*\/\s*const data = \{ tasks: \[\] \};/g, `const data = await response.json();`);

// Fix the assignment of parsed data
code = code.replace(/if \(data\.tasks\)/g, `if (data.goals)`);
code = code.replace(/setDraftGoals\(data\.tasks\);/g, `setDraftGoals(data.goals);`);

// Fix the map rendering to show Goals, Stages, and Tasks properly
const oldMapping = `{draftGoals.length > 0 && (
          <div className="w-full absolute top-[100px] bottom-[80px] overflow-y-auto pt-4 pb-8 z-50 pointer-events-auto" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)' }}>
            <div className="flex flex-col gap-2.5 w-full px-4">
              <AnimatePresence>
                {draftGoals.map((task: any) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#282828] rounded-[14px] py-4 pl-4 pr-5 flex items-start justify-start flex-shrink-0"
                  >
                    <div className="w-[22px] h-[22px] rounded-full border border-[#cfcfcf] flex items-center justify-center shrink-0 mr-3 transition-all duration-300 group">
                      <Check className="w-3.5 h-3.5 text-white opacity-0 scale-50 group-hover:opacity-50 transition-all duration-300" />
                    </div>
                    <div className="flex flex-col justify-start flex-1 min-w-0">
                      <p className="text-white font-roboto font-normal text-[15px] leading-[22px] w-full break-words whitespace-normal">
                        {task.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}`;

const newMapping = `{draftGoals.length > 0 && (
          <div className="w-full absolute top-[100px] bottom-[80px] overflow-y-auto pt-4 pb-8 z-50 pointer-events-auto" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)' }}>
            <div className="flex flex-col gap-4 w-full px-4">
              <AnimatePresence>
                {draftGoals.map((goal: any) => (
                  <motion.div
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}`;

code = code.replace(oldMapping, newMapping);

// handle save method
code = code.replace(/const handleSave = \(\) => \{[\s\S]*?setAiState\('idle'\);\n    \}\n  \};/, `const handleSave = () => {
    if (draftGoals.length > 0) {
      draftGoals.forEach(goal => {
        addGoal({
           title: goal.title,
           description: goal.description || '',
           stages: goal.stages ? goal.stages.map((s: any) => ({
             id: s.id || Date.now().toString() + Math.random().toString(),
             title: s.title || '',
             description: s.description || '',
             startDate: s.startDate || '',
             startTime: s.startTime || '',
             endDate: s.endDate || '',
             endTime: s.endTime || '',
             tasks: s.tasks ? s.tasks.map((t: any) => ({
                id: t.id || Date.now().toString() + Math.random().toString(),
                title: t.title || '',
                completed: false
             })) : []
           })) : [],
           startDate: goal.startDate || '',
           startTime: goal.startTime || '',
           endDate: goal.endDate || '',
           endTime: goal.endTime || '',
           completed: false
        });
      });
      setDraftGoals([]);
      setTranscript('');
      setAiState('idle');
      if (onBack) onBack();
    }
  };`);

fs.writeFileSync('src/components/ScreenGoalAI.tsx', code);
console.log('Patched ScreenGoalAI.tsx');
