const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenRoadmap.tsx', 'utf8');

const targetRegex = /className=\{\`\$\{bgColor\} rounded-\[7px\] py-4 pl-4 pr-5 flex items-start justify-start cursor-pointer \$\{hoverColor\} transition-all duration-300 ease-out \$\{\s*isSliding \? 'translate-x-\[110%\] opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'\s*\}\`\}\s*>\s*<button([\s\S]*?)<\/button>\s*<div className="flex flex-col justify-start flex-1 min-w-0">\s*<p\s*className=\{\`\$\{textColor\} font-roboto font-normal text-\[15px\] leading-\[22px\] line-clamp-3 w-full break-words whitespace-normal\`\}\s*>\s*\{task\.title\}\s*<\/p>\s*\{task\.isPinned && \(\s*<div className="mt-1\.5 flex items-center justify-end text-\[11px\] text-\[#808080\] font-medium w-full">\s*<span>Fixada<\/span>\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>/;

const replacement = `className={\`\$\{bgColor\} rounded-[7px] px-4 py-3.5 flex flex-col cursor-pointer \$\{hoverColor\} transition-all duration-300 ease-out \$\{
                    isSliding ? 'translate-x-[110%] opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'
                  }\`}
                >
                  <div className={\`flex items-start justify-start w-full \$\{task.isPinned ? 'mb-1.5' : ''}\`}>
                    <button$1</button>
                    <div className="flex flex-col justify-start flex-1 min-w-0">
                      <p
                        className={\`\$\{textColor\} font-roboto font-normal text-[15px] leading-[22px] line-clamp-3 w-full break-words whitespace-normal\`}
                      >
                        {task.title}
                      </p>
                    </div>
                  </div>
                  {task.isPinned && (
                    <div className="flex items-center justify-end text-[11px] text-[#808080] font-medium w-full">
                      <span>Fixada</span>
                    </div>
                  )}
                </div>`;

code = code.replace(targetRegex, replacement);

fs.writeFileSync('src/components/ScreenRoadmap.tsx', code);
