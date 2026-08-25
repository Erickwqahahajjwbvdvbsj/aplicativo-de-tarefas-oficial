const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenRoadmap.tsx', 'utf8');

// 1. Remove ScreenAI import
code = code.replace(/import { ScreenAI } from '\.\/ScreenAI';\n?/, '');
code = code.replace(/import { ScreenAI } from "\.\/ScreenAI";\n?/, '');

// 2. Remove isAIOpen and isFabExpanded state
code = code.replace(/const \[isAIOpen, setIsAIOpen\] = useState\(false\);\n?/, '');
code = code.replace(/const \[isFabExpanded, setIsFabExpanded\] = useState\(false\);\n?/, '');

// 3. Replace the entire FAB section
const oldFabRegex = /\{!\(isAddingTask \|\| selectedTask \|\| editingTaskId \|\| isFiltersOpen\) && \(\s*<motion\.div[\s\S]*?<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/;

const newFab = `{! (isAddingTask || selectedTask || editingTaskId || isFiltersOpen) && (
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
                if (!user) {
                  onNavigate?.('profile');
                } else {
                  setNewTask(defaultTaskState);
                  setInitialTaskState(defaultTaskState);
                  setEditingTaskId(null);
                  setIsAddingTask(true);
                }
              }}
              className="w-14 h-14 rounded-[13px] bg-[#ff3838] flex items-center justify-center shadow-lg"
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>`;

code = code.replace(oldFabRegex, newFab);

// 4. Remove ScreenAI overlay render block
const oldOverlayRegex = /\{\/\* Screen AI Overlay \*\/\}\s*<AnimatePresence>\s*\{isAIOpen && \([\s\S]*?<\/AnimatePresence>/;
code = code.replace(oldOverlayRegex, '');

fs.writeFileSync('src/components/ScreenRoadmap.tsx', code);
console.log('ScreenRoadmap patched successfully.');
