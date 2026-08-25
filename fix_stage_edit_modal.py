import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# 1 & 2. Remove the discrete line
text = text.replace('               <div className="w-full h-[1px] bg-white/[0.04] mt-2" />\n               \n', '')

# 3. Change height of stageTaskModal
text = text.replace(
    'className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[120] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh] pb-6"',
    'className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[120] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh] pb-6"'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
