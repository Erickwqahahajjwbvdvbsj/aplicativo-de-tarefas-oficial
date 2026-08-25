import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'className="bg-[#282828] rounded-[14px] py-4 pl-4 pr-5 flex flex-col relative z-10 shrink-0 cursor-pointer transition-all"',
    'className={`bg-[#282828] rounded-[14px] py-4 pl-4 pr-5 flex flex-col relative shrink-0 cursor-pointer transition-all ${openStageMenuId === stage.id ? \'z-50\' : \'z-10\'}`}'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
