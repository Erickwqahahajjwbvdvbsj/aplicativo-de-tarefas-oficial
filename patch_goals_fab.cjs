const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

const oldFab = `      {/* Floating Add Goal Button */}
      <AnimatePresence initial={false}>
        {!isAddModalOpen && (
          <motion.button
            key="add-goal-fab"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="absolute bottom-[104px] right-6 w-14 h-14 rounded-[13px] bg-[#ff3838] flex items-center justify-center z-40"
          >
            <Plus className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>`;

const newFab = `      {/* FAB (Speed Dial) */}
      <AnimatePresence initial={false}>
        {!isAddModalOpen && (
          <motion.div 
            className="absolute bottom-[104px] right-6 z-40 flex flex-col items-end"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <AnimatePresence>
              {isFabExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-end gap-3 mb-4 origin-bottom-right"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFabExpanded(false);
                      setIsAIOpen(true);
                    }}
                    className="flex items-center justify-between gap-3 bg-[#ff3838] text-white px-4 h-[50px] w-[196px] rounded-[13px]"
                  >
                    <span className="text-[15px] font-medium tracking-tight">Adicionar com IA</span>
                    <img src="https://i.ibb.co/gM8zHtxw/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260818-011442-0000.png" alt="AI Assistant" className="w-[21px] h-[21px] object-contain shrink-0" referrerPolicy="no-referrer" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsFabExpanded(false);
                      setIsAddModalOpen(true);
                    }}
                    className="flex items-center justify-between gap-3 bg-[#ff3838] text-white px-4 h-[50px] w-[196px] rounded-[13px]"
                  >
                    <span className="text-[15px] font-medium tracking-tight">Adicionar manual</span>
                    <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
                       <Plus className="w-[22px] h-[22px] text-white" />
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              key="main-fab"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsFabExpanded(!isFabExpanded);
              }}
              className="w-14 h-14 rounded-[13px] bg-[#ff3838] flex items-center justify-center shadow-lg relative"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isFabExpanded ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex items-center justify-center absolute inset-0"
              >
                <Plus className="w-6 h-6 text-white" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>`;

code = code.replace(oldFab, newFab);

const screenAIModal = `      {/* Screen AI Overlay */}
      <AnimatePresence>
        {isAIOpen && (
          <motion.div key="aiModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[150] bg-[#1f1f1f]"
          >
            <ScreenGoalAI onBack={() => setIsAIOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Goal Modal */}`;

code = code.replace('{/* Selected Goal Modal */}', screenAIModal);

fs.writeFileSync('src/components/ScreenGoals.tsx', code);
console.log('Replaced');
