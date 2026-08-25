const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenTaskHistory.tsx', 'utf8');

const target = `<div className="relative flex gap-8 mt-8">
             <div className="mt-1 relative z-10 shrink-0">
                <div className="w-5 h-5 rounded-full bg-[#303030] flex items-center justify-center ring-4 ring-[#1f1f1f]">
                  <X className="w-3 h-3 text-white" />
                </div>
             </div>
             <div className="pt-1.5 pb-8">
                <span className="text-[13px] font-medium text-[#73777d]">Últimos 7 dias deletados</span>
             </div>
          </div>`;

const replacement = `<div className="relative flex items-center gap-8 mt-16 pb-8">
             <div className="relative z-10 shrink-0">
                <div className="w-5 h-5 rounded-full bg-[#303030] flex items-center justify-center ring-4 ring-[#1f1f1f]">
                  <X className="w-3 h-3 text-white" />
                </div>
             </div>
             <div>
                <span className="text-[13px] font-medium text-[#73777d]">Últimos 7 dias deletados</span>
             </div>
          </div>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/ScreenTaskHistory.tsx', code);
    console.log('Successfully patched the end indicator');
} else {
    console.log('Target string not found, trying regex or alternative matching...');
    // Fallback if formatting differs slightly
}
