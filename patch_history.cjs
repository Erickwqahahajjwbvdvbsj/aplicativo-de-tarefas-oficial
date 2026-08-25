const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenTaskHistory.tsx', 'utf8');

// 1. Remove pl-4 from timeline container
code = code.replace('<div className="relative pl-4 flex-1">', '<div className="relative flex-1">');

// 2. Update vertical line left position from 23px to 9px
code = code.replace('<div className="absolute top-2 bottom-4 left-[23px] w-0.5 bg-[#2c2c2c]" />', '<div className="absolute top-2 bottom-4 left-[9px] w-0.5 bg-[#2c2c2c]" />');

// 3. Update gap-4 to gap-8 in task rows
code = code.replace('<div key={task.id} className="relative flex gap-4">', '<div key={task.id} className="relative flex gap-8">');

// 4. Update gap-4 to gap-8 in the end indicator
code = code.replace('<div className="relative flex gap-4 mt-8">', '<div className="relative flex gap-8 mt-8">');

fs.writeFileSync('src/components/ScreenTaskHistory.tsx', code);
console.log('ScreenTaskHistory patched');
