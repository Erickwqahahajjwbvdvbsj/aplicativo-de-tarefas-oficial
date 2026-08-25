const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

code = code.replace(/const \[newGoalStartTime, setNewGoalStartTime\] = useState<string>\(''\);/,
`const [newGoalStartTime, setNewGoalStartTime] = useState<string>('');
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);`);

code = code.replace(/\} else if \(isStartDatePickerOpen\) \{\n\s*setIsStartDatePickerOpen\(false\);\n\s*\} else if \(isStartTimePickerOpen\) \{\n\s*setIsStartTimePickerOpen\(false\);/,
`} else if (isStartPickerOpen) {
                setIsStartPickerOpen(false);
              } else if (isStartDatePickerOpen) {
                setIsStartDatePickerOpen(false);
              } else if (isStartTimePickerOpen) {
                setIsStartTimePickerOpen(false);`);

code = code.replace(/animate=\{\{ y: \(isTaskSelectionOpen \|\| isStartDatePickerOpen \|\| isStartTimePickerOpen \|\| isEndPickerOpen \|\| isEndDatePickerOpen \|\| isEndTimePickerOpen\) \? "100%" : 0/,
`animate={{ y: (isTaskSelectionOpen || isStartPickerOpen || isStartDatePickerOpen || isStartTimePickerOpen || isEndPickerOpen || isEndDatePickerOpen || isEndTimePickerOpen) ? "100%" : 0`);

fs.writeFileSync('src/components/ScreenGoals.tsx', code);
