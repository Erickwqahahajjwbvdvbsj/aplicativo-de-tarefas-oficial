const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

const newFabBlock = `      {/* FAB (Speed Dial) */}
      <AnimatePresence initial={false}>
        {!isAddModalOpen && (
          <motion.div 
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

// Split based on lines 525 to 595
const lines = code.split('\n');
const before = lines.slice(0, 524).join('\n');
const after = lines.slice(595).join('\n');

fs.writeFileSync('src/components/ScreenGoals.tsx', before + '\n' + newFabBlock + '\n' + after);
