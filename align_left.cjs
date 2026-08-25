const fs = require('fs');

// Goals file
let goalsCode = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');
goalsCode = goalsCode.replace(
  /<div className="flex items-center justify-end text-\[11px\] text-\[#808080\] font-medium">\s*<span>Fixado<\/span>\s*<\/div>/,
  '<div className="flex items-center justify-start text-[11px] text-[#808080] font-medium">\n                      <span>Fixado</span>\n                    </div>'
);
fs.writeFileSync('src/components/ScreenGoals.tsx', goalsCode);


// Tasks file
let tasksCode = fs.readFileSync('src/components/ScreenRoadmap.tsx', 'utf8');

// Replace the outer wrapping and move Fixada to the title column
const tasksRegex = /<div className=\{\`flex items-start justify-start w-full \$\{task\.isPinned \? 'mb-1\.5' : ''\}\`\}>([\s\S]*?)<div className="flex flex-col justify-start flex-1 min-w-0">\s*<p\s*className=\{\`\$\{textColor\} font-roboto font-normal text-\[15px\] leading-\[22px\] line-clamp-3 w-full break-words whitespace-normal\`\}\s*>\s*\{task\.title\}\s*<\/p>\s*<\/div>\s*<\/div>\s*\{task\.isPinned && \(\s*<div className="flex items-center justify-end text-\[11px\] text-\[#808080\] font-medium w-full">\s*<span>Fixada<\/span>\s*<\/div>\s*\)\}/;

const tasksReplacement = `<div className="flex items-start justify-start w-full">$1<div className="flex flex-col justify-start flex-1 min-w-0">
                      <p
                        className={\`\$\{textColor\} font-roboto font-normal text-[15px] leading-[22px] line-clamp-3 w-full break-words whitespace-normal\`}
                      >
                        {task.title}
                      </p>
                      {task.isPinned && (
                        <div className="mt-1.5 flex items-center justify-start text-[11px] text-[#808080] font-medium w-full">
                          <span>Fixada</span>
                        </div>
                      )}
                    </div>
                  </div>`;

tasksCode = tasksCode.replace(tasksRegex, tasksReplacement);
fs.writeFileSync('src/components/ScreenRoadmap.tsx', tasksCode);

