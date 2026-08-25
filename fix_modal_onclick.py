import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[110] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh]"\n            onClick={(e) => e.stopPropagation()}',
    'className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[110] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh]"\n            onClick={(e) => { e.stopPropagation(); if (openStageMenuId) setOpenStageMenuId(null); }}'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
