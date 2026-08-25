const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

const target = `                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                />
                
                <button
                  onClick={() => {
                    setIsTaskSelectionOpen(true);
                    setIsStartDatePickerOpen(false);
                    setIsStartTimePickerOpen(false);
                    setIsEndDatePickerOpen(false);
                  }}
                  className="w-full shrink-0 h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-left outline-none focus:ring-0 focus:border-transparent flex items-center justify-between"
                >
                  <span className={selectedTaskIds.length > 0 ? "text-[#e8e8e9]" : "text-[#73777d]"}>
                    {selectedTaskIds.length > 0 ? (selectedTaskIds.length === 1 ? "1 tarefa selecionada" : \`\${selectedTaskIds.length} tarefas selecionadas\`) : "Selecionar tarefas para meu objetivo"}
                  </span>
                  <ChevronRight className={\`w-4 h-4 shrink-0 text-[#73777d] transition-transform \${isTaskSelectionOpen ? "rotate-90" : ""}\`} />
                </button>

                <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory shrink-0 pb-2 -mx-6 px-6 scroll-px-6">
                  <button 
                      onClick={() => {`;

const replacement = `                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                />
                
                <textarea
                  placeholder="Adicione uma descrição para o objetivo..."
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-[#e8e8e9] h-[100px] resize-none outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d] no-scrollbar"
                  value={newGoalDescription}
                  onChange={(e) => setNewGoalDescription(e.target.value)}
                />

                <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory shrink-0 pb-2 -mx-6 px-6 scroll-px-6">
                  <button
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
                  </button>

                  <button 
                      onClick={() => {`;

// relax spaces
function normalize(str) {
  return str.replace(/\s+/g, ' ');
}

let codeNormalized = normalize(code);
let targetNormalized = normalize(target);

if (codeNormalized.includes(targetNormalized)) {
  console.log("Match found! Using regex replacement");
  // A somewhat naive but effective replace:
  let escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  let regex = new RegExp(escapedTarget);
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/components/ScreenGoals.tsx', code);
  console.log("Replaced.");
} else {
  console.log("NOT FOUND");
}
