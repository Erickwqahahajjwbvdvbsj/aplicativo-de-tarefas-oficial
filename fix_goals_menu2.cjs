const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

const menuButton = `<button
                                type="button"
                                disabled={isDeletingGoal || isCompletingGoal}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isDeletingGoal || isCompletingGoal) return;
                                  updateGoal(selectedGoal.id, { isPinned: !selectedGoal.isPinned, pinnedAt: new Date().toISOString() });
                                  setIsGoalMenuOpen(false);
                                  setSelectedGoal(null);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer"
                              >
                                {selectedGoal.isPinned ? "Desfixar objetivo" : "Fixar objetivo"}
                              </button>`;

code = code.replace(menuButton, ''); // Remove it from current place (if not already removed)

// Insert at the top of the menu
code = code.replace(/<motion\.div\s*initial=\{\{ opacity: 0, scale: 0\.92, y: -6 \}\}\s*animate=\{\{ opacity: 1, scale: 1, y: 0 \}\}\s*exit=\{\{ opacity: 0, scale: 0\.92, y: -6 \}\}\s*transition=\{\{ duration: 0\.15, ease: "easeOut" \}\}\s*onClick=\{\(e\) => e\.stopPropagation\(\)\}\s*className="absolute right-1\.5 top-10 bg-\[#282828\] border border-\[#4f4f4f\] rounded-\[16px\] p-1\.5 z-50 flex flex-col min-w-\[160px\]"\s*>/, 
  `<motion.div
                              initial={{ opacity: 0, scale: 0.92, y: -6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.92, y: -6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-1.5 top-10 bg-[#282828] border border-[#4f4f4f] rounded-[16px] p-1.5 z-50 flex flex-col min-w-[160px]"
                            >
                              ${menuButton}`);

fs.writeFileSync('src/components/ScreenGoals.tsx', code);
