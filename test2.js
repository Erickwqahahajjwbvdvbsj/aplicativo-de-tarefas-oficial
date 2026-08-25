import fs from 'fs';
let c = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

c = c.replace(
  '<div className="flex items-center justify-between gap-3 mb-1.5 relative">\n                        <h3 className="text-white font-bold text-[17px] leading-snug break-words flex-1 min-w-0">',
  '<div className="flex items-center justify-between gap-3 mb-1.5 relative min-h-[28px]">\n                        <h3 className="text-white font-bold text-[17px] leading-snug break-words flex-1 min-w-0">'
);
fs.writeFileSync('src/components/ScreenGoals.tsx', c);
