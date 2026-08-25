const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

const target = `      {/* Start Date Picker Bottom Sheet */}
      <AnimatePresence>
        {isStartDatePickerOpen && (`;

const replacement = `      {/* Start Picker Bottom Sheet (Combined) */}
      <AnimatePresence>
        {isStartPickerOpen && (
          <motion.div key="startPickerGoals"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] pt-6 px-6 z-[110] border-t border-[#4f4f4f]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-[20px]">Início do Objetivo</h3>
              <button onClick={() => setIsStartPickerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>
            <div className="flex flex-col gap-3 mb-8">
              <button 
                 onClick={() => {
                    setIsStartPickerOpen(false);
                    setIsStartDatePickerOpen(true);
                }}
                className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
              >
                <span className="truncate mr-2">
                    {newGoalStartDate ? <span className="text-white">{new Date(newGoalStartDate + 'T12:00:00').toLocaleDateString('pt-BR')}</span> : <span className="text-[#73777d]">Escolher Data de Início</span>}
                </span>
                <ChevronRight className="w-4 h-4 shrink-0 text-[#73777d]" />
              </button>
              <button 
                 onClick={() => {
                    setIsStartPickerOpen(false);
                    setIsStartTimePickerOpen(true);
                }}
                className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
              >
                <span className="truncate mr-2">
                    {newGoalStartTime ? <span className="text-white">{newGoalStartTime}</span> : <span className="text-[#73777d]">Escolher Horário de Início</span>}
                </span>
                <ChevronRight className="w-4 h-4 shrink-0 text-[#73777d]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Date Picker Bottom Sheet */}
      <AnimatePresence>
        {isStartDatePickerOpen && (`;

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
