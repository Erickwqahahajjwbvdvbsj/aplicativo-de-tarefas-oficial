const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

// 1. Remove ScreenGoalAI import
code = code.replace(/import { ScreenGoalAI } from '\.\/ScreenGoalAI';\n?/, '');

// 2. Remove state
code = code.replace(/const \[isAIOpen, setIsAIOpen\] = useState\(false\);\n?/, '');
code = code.replace(/const \[isFabExpanded, setIsFabExpanded\] = useState\(false\);\n?/, '');

// 3. Replace the entire FAB section
const oldFabRegex = /\{\!\(isAddModalOpen \|\| selectedGoal\) && \(\s*<motion\.div[\s\S]*?<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/;

const newFab = `{! (isAddModalOpen || selectedGoal) && (
          <motion.div
            key="fab-container"
            className="fixed bottom-24 right-5 z-[40]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.button
              key="main-fab"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsAddModalOpen(true);
              }}
              className="w-14 h-14 rounded-[13px] bg-[#ff3838] flex items-center justify-center shadow-lg relative"
            >
              <div className="w-full h-full flex items-center justify-center absolute inset-0">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>`;

code = code.replace(oldFabRegex, newFab);

// 4. Remove ScreenGoalAI render block
const oldOverlayRegex = /\{\/\* Screen AI Overlay \*\/\}\s*<AnimatePresence>\s*\{isAIOpen && \([\s\S]*?<\/AnimatePresence>/;
code = code.replace(oldOverlayRegex, '');

fs.writeFileSync('src/components/ScreenGoals.tsx', code);
console.log('ScreenGoals patched successfully.');
