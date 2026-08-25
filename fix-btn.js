const fs = require('fs');
let c = fs.readFileSync('src/components/ScreenNotes.tsx', 'utf8');

const target = `                    <button\n                      type="button"\n                      onClick={handleSaveNote}\n                      disabled={isSaving}\n                      className="h-8 px-3.5 bg-[#2c2c2c] hover:bg-[#3c3c3c] text-gray-400 hover:text-white font-bold text-[13px] rounded-full flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 select-none cursor-pointer group"\n                    >\n                      {isSaving ? (\n                        <Loader2 className="w-6 h-6 text-white animate-spin" />`;

const replacement = `                    <button\n                      type="button"\n                      onClick={handleSaveNote}\n                      disabled={isSaving}\n                      className={\`h-8 px-3.5 bg-[#2c2c2c] hover:bg-[#3c3c3c] text-gray-400 hover:text-white font-bold text-[13px] rounded-full flex items-center justify-center gap-1.5 transition active:scale-95 select-none group \${isSaving ? 'cursor-default min-w-[76px]' : 'cursor-pointer'}\`}\n                    >\n                      {isSaving ? (\n                        <Loader2 className="w-[20px] h-[20px] text-white animate-spin" />`;

if (c.includes(target)) {
  c = c.replace(target, replacement);
  fs.writeFileSync('src/components/ScreenNotes.tsx', c);
  console.log("Success!");
} else {
  console.log("Target not found!");
}
