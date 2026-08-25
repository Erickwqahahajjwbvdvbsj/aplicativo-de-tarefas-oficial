const fs = require('fs');
let content = fs.readFileSync('src/components/ScreenRoadmap.tsx', 'utf8');

// Add import ScreenAI
const importTarget = `import { ScreenTaskHistory } from "./ScreenTaskHistory";`;
const importRepl = `import { ScreenTaskHistory } from "./ScreenTaskHistory";\nimport { ScreenAI } from "./ScreenAI";`;

// Add isAIOpen state
const stateTarget = `  const [isSearchOpen, setIsSearchOpen] = useState(false);`;
const stateRepl = `  const [isSearchOpen, setIsSearchOpen] = useState(false);\n  const [isAIOpen, setIsAIOpen] = useState(false);`;

// Add Bot button between search and history
const rightElementsTarget = `            {/* History Button (Positioned absolutely so search can expand over/next to it seamlessly) */}
            <div className={\`absolute right-0 transition-opacity \${isSearchOpen ? 'opacity-0 pointer-events-none duration-150 ease-out' : 'opacity-100 pointer-events-auto duration-300 ease-in'}\`}>`;

const rightElementsRepl = `            {/* History Button */}
            <div className={\`absolute right-0 transition-opacity \${isSearchOpen ? 'opacity-0 pointer-events-none duration-150 ease-out' : 'opacity-100 pointer-events-auto duration-300 ease-in'}\`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHistoryOpen(true);
                }}
                className="w-[42px] h-[42px] shrink-0 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform bg-transparent"
              >
                <History className="w-[22px] h-[22px] text-[#aaaaaa]" />
              </button>
            </div>
            
            {/* AI Assistant Button */}
            <div className={\`absolute right-[46px] transition-opacity \${isSearchOpen ? 'opacity-0 pointer-events-none duration-150 ease-out' : 'opacity-100 pointer-events-auto duration-300 ease-in'}\`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAIOpen(true);
                }}
                className="w-[42px] h-[42px] shrink-0 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform bg-transparent"
              >
                <Bot className="w-[22px] h-[22px] text-[#aaaaaa]" />
              </button>
            </div>`;

// Update Search Component mr-[46px] to mr-[92px]
const searchTarget1 = `isSearchOpen 
                  ? 'w-[calc(100vw-32px)] bg-[#303030] border border-[#aaaaaa]/20 shadow-sm' 
                  : 'w-[42px] bg-transparent border border-transparent shadow-none mr-[46px]'`;
const searchRepl1 = `isSearchOpen 
                  ? 'w-[calc(100vw-32px)] bg-[#303030] border border-[#aaaaaa]/20 shadow-sm' 
                  : 'w-[42px] bg-transparent border border-transparent shadow-none mr-[92px]'`;

// Now add the <AnimatePresence> overlay for ScreenAI
const aiOverlayTarget = `{/* Fullscreen Image Modal */}`;
const aiOverlayRepl = `{/* Screen AI Overlay */}
      <AnimatePresence>
        {isAIOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[150] bg-[#1f1f1f]"
          >
            <ScreenAI onBack={() => setIsAIOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Fullscreen Image Modal */}`;

// Update Bottom Nav
const bottomNavTarget = `      {/* Bottom Nav */}
      <div className="absolute -bottom-[2px] left-0 right-0 h-[90px] pb-[2px] bg-[#303030] rounded-t-[40px] px-4 flex justify-between items-center z-50">
        <button onClick={() => onNavigate?.("home")} className="flex flex-col items-center gap-1 min-w-[56px] hover:opacity-80 transition">
          <Home size={24} className="text-[#aaaaaa]" />
          <span className="text-[10px] font-bold text-[#aaaaaa] ">Início</span>
        </button>
        <button onClick={() => onNavigate?.("roadmap")} className="flex flex-col items-center gap-1 min-w-[56px]">
          <NotepadText size={24} className="text-[#ff3838]" />
          <span className="text-[10px] font-bold text-[#aaaaaa] ">Tarefas</span>
        </button>
        <button onClick={() => onNavigate?.("ai")} className="flex flex-col items-center gap-1 min-w-[56px] hover:opacity-80 transition">
          <Bot size={28} className="text-[#aaaaaa]" />
          <span className="text-[10px] font-bold text-[#aaaaaa] ">Assistente</span>
        </button>
        <button onClick={() => onNavigate?.("goals")} className="flex flex-col items-center gap-1 min-w-[56px] hover:opacity-80 transition">
          <span className="material-symbols-outlined text-[#aaaaaa]" style={{ fontSize: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>rocket_launch</span>
          <span className="text-[10px] font-bold text-[#aaaaaa] ">Objetivos</span>
        </button>
        <button onClick={() => onNavigate?.("profile")} className="flex flex-col items-center gap-1 min-w-[56px] hover:opacity-80 transition">
          <User size={26} className="text-[#aaaaaa]" />
          <span className="text-[10px] font-bold text-[#aaaaaa] ">Perfil</span>
        </button>
      </div>`;

const bottomNavRepl = `      {/* Bottom Nav */}
      <div className="absolute -bottom-[2px] left-0 right-0 h-[90px] pb-[2px] bg-[#303030] rounded-t-[40px] px-8 flex justify-between items-center z-50">
        <button onClick={() => onNavigate?.("home")} className="flex flex-col items-center gap-1 min-w-[56px] hover:opacity-80 transition">
          <Home size={24} className="text-[#aaaaaa]" />
          <span className="text-[10px] font-bold text-[#aaaaaa] ">Início</span>
        </button>
        <button onClick={() => onNavigate?.("roadmap")} className="flex flex-col items-center gap-1 min-w-[56px]">
          <NotepadText size={24} className="text-[#ff3838]" />
          <span className="text-[10px] font-bold text-[#aaaaaa] ">Tarefas</span>
        </button>
        <button onClick={() => onNavigate?.("goals")} className="flex flex-col items-center gap-1 min-w-[56px] hover:opacity-80 transition">
          <span className="material-symbols-outlined text-[#aaaaaa]" style={{ fontSize: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>rocket_launch</span>
          <span className="text-[10px] font-bold text-[#aaaaaa] ">Objetivos</span>
        </button>
        <button onClick={() => onNavigate?.("profile")} className="flex flex-col items-center gap-1 min-w-[56px] hover:opacity-80 transition">
          <User size={26} className="text-[#aaaaaa]" />
          <span className="text-[10px] font-bold text-[#aaaaaa] ">Perfil</span>
        </button>
      </div>`;


if (content.includes(importTarget)) {
  content = content.replace(importTarget, importRepl);
  content = content.replace(stateTarget, stateRepl);
  
  // Need to replace the whole rightElements block... it's a bit hard with replace string matching.
  // Instead of replacing the block, let's just use string operations around 'isSearchOpen ?'
  let splitParts = content.split(rightElementsTarget);
  if (splitParts.length === 2) {
      let after = splitParts[1];
      // remove the old history button block and search button
      // To be safe I will do a replace
  }
}

