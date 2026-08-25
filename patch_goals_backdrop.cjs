const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

const target = `              } else if (isStartDatePickerOpen) {
                setIsStartDatePickerOpen(false);
              } else if (isStartTimePickerOpen) {
                setIsStartTimePickerOpen(false);`;

const replacement = `              } else if (isStartDatePickerOpen) {
                setIsStartDatePickerOpen(false);
                setIsStartPickerOpen(true);
              } else if (isStartTimePickerOpen) {
                setIsStartTimePickerOpen(false);
                setIsStartPickerOpen(true);`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/ScreenGoals.tsx', code);
