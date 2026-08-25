const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

const target = `                  <button 
                      onClick={() => {
                        setIsStartDatePickerOpen(true);
                        setIsStartTimePickerOpen(false);
                        setIsEndDatePickerOpen(false);
                        setIsTaskSelectionOpen(false);
                     }}
                     className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                  >
                     <span className="truncate mr-2">{newGoalStartDate ? new Date(newGoalStartDate + 'T12:00:00').toLocaleDateString('pt-BR') : <span className="text-[#73777d]">Data de Início</span>}</span>
                     <ChevronRight className={\`w-4 h-4 shrink-0 text-[#73777d] transition-transform \${isStartDatePickerOpen ? "rotate-90" : ""}\`} />
                  </button>
                  <button
                      onClick={() => {
                        setIsStartTimePickerOpen(true);
                        setIsStartDatePickerOpen(false);
                        setIsEndDatePickerOpen(false);
                        setIsTaskSelectionOpen(false);
                     }}
                     className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                  >
                     <span className="truncate mr-2">{newGoalStartTime ? \`Início: \${newGoalStartTime}\` : <span className="text-[#73777d]">Horário de Início</span>}</span>
                     <ChevronRight className={\`w-4 h-4 shrink-0 text-[#73777d] transition-transform \${isStartTimePickerOpen ? "rotate-90" : ""}\`} />
                  </button>`;

const replacement = `                  <button 
                      onClick={() => {
                        setIsStartPickerOpen(!isStartPickerOpen);
                        setIsStartDatePickerOpen(false);
                        setIsStartTimePickerOpen(false);
                        setIsEndDatePickerOpen(false);
                        setIsTaskSelectionOpen(false);
                        setIsEndPickerOpen(false);
                        setIsEndTimePickerOpen(false);
                     }}
                     className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                  >
                     <span className="truncate mr-2">{newGoalStartDate || newGoalStartTime ? <span className="text-white">{\`\${newGoalStartDate ? new Date(newGoalStartDate + 'T12:00:00').toLocaleDateString('pt-BR') : ''}\${(newGoalStartDate && newGoalStartTime) ? ' às ' : ''}\${newGoalStartTime || ''}\`}</span> : <span className="text-[#73777d]">Início do Objetivo</span>}</span>
                     <ChevronRight className={\`w-4 h-4 shrink-0 text-[#73777d] transition-transform \${isStartPickerOpen ? "rotate-90" : ""}\`} />
                  </button>`;

function normalize(str) {
  return str.replace(/\s+/g, ' ');
}

let codeNormalized = normalize(code);
let targetNormalized = normalize(target);

if (codeNormalized.includes(targetNormalized)) {
  console.log("Match found! Using regex replacement");
  let escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  let regex = new RegExp(escapedTarget);
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/components/ScreenGoals.tsx', code);
  console.log("Replaced.");
} else {
  console.log("NOT FOUND");
}
