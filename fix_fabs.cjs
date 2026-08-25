const fs = require('fs');

function fixRoadmap() {
  let code = fs.readFileSync('src/components/ScreenRoadmap.tsx', 'utf8');
  
  const startTag = 'className="absolute bottom-[104px] right-6 z-40 flex flex-col items-end"';
  const endTag = '{/* Discard Modal */}';
  
  const startIndex = code.indexOf(startTag);
  if (startIndex === -1) {
    console.log("Could not find start block in roadmap");
    return;
  }
  
  const actualStartIndex = code.lastIndexOf('<motion.div', startIndex);
  const endIndex = code.indexOf(endTag, startIndex);
  
  if (actualStartIndex !== -1 && endIndex !== -1) {
    const before = code.substring(0, actualStartIndex);
    // Find the enclosing </AnimatePresence> before the Discard Modal
    const after = code.substring(code.lastIndexOf('</AnimatePresence>', endIndex) + '</AnimatePresence>'.length);
    
    const newFab = `<motion.div 
            className="absolute bottom-[104px] right-6 z-40 flex flex-col items-end"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
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
      </AnimatePresence>
`;
    
    fs.writeFileSync('src/components/ScreenRoadmap.tsx', before + newFab + code.substring(endIndex));
    console.log('ScreenRoadmap fixed');
  }
}

function fixGoals() {
  let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');
  
  const startTag = 'className="fixed bottom-24 right-5 z-[40]"';
  const endTag = '{/* Selected Goal Modal */}';
  
  const startIndex = code.indexOf(startTag);
  if (startIndex === -1) {
    console.log("Could not find start block in goals");
    return;
  }
  
  const actualStartIndex = code.lastIndexOf('<motion.div', startIndex);
  const endIndex = code.indexOf(endTag, startIndex);
  
  if (actualStartIndex !== -1 && endIndex !== -1) {
    const before = code.substring(0, actualStartIndex);
    
    const newFab = `<motion.div
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
      </AnimatePresence>
`;
    
    fs.writeFileSync('src/components/ScreenGoals.tsx', before + newFab + "\n      " + code.substring(endIndex));
    console.log('ScreenGoals fixed');
  }
}

fixRoadmap();
fixGoals();
