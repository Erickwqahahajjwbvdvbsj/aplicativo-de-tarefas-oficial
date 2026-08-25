const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

const startTag = '<motion.div\n            className="absolute bottom-[104px] right-6 z-40 flex flex-col items-end"';
const endTag = '{/* Selected Goal Modal */}';

const startIndex = code.indexOf(startTag);
if (startIndex !== -1) {
  const endIndex = code.indexOf(endTag, startIndex);
  if (endIndex !== -1) {
    const before = code.substring(0, startIndex);
    
    // Find the enclosing </AnimatePresence>
    const beforeEndTag = code.substring(0, endIndex);
    const lastAnimatePresence = beforeEndTag.lastIndexOf('</AnimatePresence>');
    
    const after = code.substring(lastAnimatePresence + '</AnimatePresence>'.length);
    
    const newFab = `<motion.div
            key="fab-container"
            className="fixed bottom-[104px] right-6 z-[40]"
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
    
    fs.writeFileSync('src/components/ScreenGoals.tsx', before + newFab + after);
    console.log('ScreenGoals fixed');
  }
}
