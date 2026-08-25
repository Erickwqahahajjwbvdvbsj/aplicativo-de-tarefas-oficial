const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenTaskHistory.tsx', 'utf8');

const oldCard = `<div className="bg-[#2c2c2c] rounded-[7px] p-4 flex-1 border border-transparent flex flex-col gap-1">
                      <span className="text-[14px] font-bold text-white leading-tight">{task.title}</span>
                      <span className="text-[12px] font-medium text-[#73777d] mt-1">
                        {formatDate(task.completedAt!)} • {formatTime(task.completedAt!)}
                      </span>
                    </div>`;

const newCard = `<div className="bg-[#282828] rounded-[7px] px-4 py-3.5 flex-1 border border-transparent flex flex-col justify-start min-w-0">
                      <span className="text-[14px] font-roboto font-normal text-white leading-tight line-clamp-3 break-words whitespace-normal">{task.title}</span>
                      <div className="mt-1.5 flex items-center justify-start text-[11px] text-[#808080] font-medium w-full">
                        <span>{formatDate(task.completedAt!)} • {formatTime(task.completedAt!)}</span>
                      </div>
                    </div>`;

if (code.includes(oldCard)) {
    code = code.replace(oldCard, newCard);
    fs.writeFileSync('src/components/ScreenTaskHistory.tsx', code);
    console.log('Successfully patched the card');
} else {
    console.log('Target string not found');
}
