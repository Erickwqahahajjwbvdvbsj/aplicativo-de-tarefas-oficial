const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

// For Start Date close button
code = code.replace(
  /<button onClick=\{\(\) => setIsStartDatePickerOpen\(false\)\} className="w-8 h-8 flex items-center justify-center rounded-full bg-\[\#2c2c2c\] text-gray-400 hover:text-white">\s*<ChevronRight className="w-4 h-4 rotate-90" \/>\s*<\/button>/g,
  `<button onClick={() => { setIsStartDatePickerOpen(false); setIsStartPickerOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>`
);

// For Start Date day select
code = code.replace(
  /setNewGoalStartDate\(dateStr\);\n\s*setIsStartDatePickerOpen\(false\);/g,
  `setNewGoalStartDate(dateStr);
                                  setIsStartDatePickerOpen(false);
                                  setIsStartPickerOpen(true);`
);

// For Start Time close button
code = code.replace(
  /<button onClick=\{\(\) => setIsStartTimePickerOpen\(false\)\} className="w-8 h-8 flex items-center justify-center rounded-full bg-\[\#2c2c2c\] text-gray-400 hover:text-white">\s*<ChevronRight className="w-4 h-4 rotate-90" \/>\s*<\/button>/g,
  `<button onClick={() => { setIsStartTimePickerOpen(false); setIsStartPickerOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>`
);

// For Start Time minute select
code = code.replace(
  /setIsStartTimePickerOpen\(false\);\n\s*\}\}\n\s*className=\{\`w-full py-3/g,
  `setIsStartTimePickerOpen(false);
                      setIsStartPickerOpen(true);
                    }}
                    className={\`w-full py-3`
);

fs.writeFileSync('src/components/ScreenGoals.tsx', code);
