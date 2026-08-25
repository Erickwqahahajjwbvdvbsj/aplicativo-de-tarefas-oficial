const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

const target = `                  <div>
                    <div className="text-[#cfcfcf] text-[14px] leading-relaxed line-clamp-5 break-words">
                      {goal.title}
                    </div>                                      
                  </div>`;
                  
const replacement = `                  <div className={goal.isPinned ? "mb-1.5" : ""}>
                    <div className="text-[#cfcfcf] text-[14px] leading-relaxed line-clamp-5 break-words">
                      {goal.title}
                    </div>                                      
                  </div>
                  {goal.isPinned && (
                    <div className="flex items-center justify-end text-[11px] text-[#808080] font-medium">
                      <span>Fixado</span>
                    </div>
                  )}`;

// replace using regex to ignore exact whitespace differences
code = code.replace(/<div>\s*<div className="text-\[#cfcfcf\] text-\[14px\] leading-relaxed line-clamp-5 break-words\">\s*\{goal\.title\}\s*<\/div>\s*<\/div>/, replacement);

fs.writeFileSync('src/components/ScreenGoals.tsx', code);
