const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

const target = `                  <button
                    onClick={() => {
                      setIsTaskSelectionOpen(true);
                      setIsStartDatePickerOpen(false);
                      setIsStartTimePickerOpen(false);
                      setIsEndDatePickerOpen(false);
                      setIsEndPickerOpen(false);
                      setIsEndTimePickerOpen(false);
                    }}
                    className="shrink-0 h-[56px] w-[200px] snap-start bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex flex-col justify-center transition-colors hover:bg-[#3a3a3a]"
                  >
                    <span className="truncate text-white">
                      Selecionar Tarefas
                    </span>
                    <span className="text-[#73777d] text-[12px] mt-0.5 truncate">
                      {selectedTaskIds.length > 0 ? (selectedTaskIds.length === 1 ? "1 tarefa" : \`\${selectedTaskIds.length} tarefas\`) : "Nenhuma"}
                    </span>
                  </button>`;

const replacement = `                  <button
                    onClick={() => {
                      setIsTaskSelectionOpen(true);
                      setIsStartDatePickerOpen(false);
                      setIsStartTimePickerOpen(false);
                      setIsEndDatePickerOpen(false);
                      setIsEndPickerOpen(false);
                      setIsEndTimePickerOpen(false);
                    }}
                    className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                  >
                    <span className="truncate mr-2">
                      {selectedTaskIds.length > 0 ? <span className="text-white">{selectedTaskIds.length === 1 ? "1 tarefa" : \`\${selectedTaskIds.length} tarefas\`}</span> : <span className="text-[#73777d]">Selecionar tarefas</span>}
                    </span>
                    <ChevronRight className={\`w-4 h-4 shrink-0 text-[#73777d] transition-transform \${isTaskSelectionOpen ? "rotate-90" : ""}\`} />
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
