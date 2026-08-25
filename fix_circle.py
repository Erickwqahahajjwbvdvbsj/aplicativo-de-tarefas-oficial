import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'className="w-[22px] h-[22px] rounded-full border border-[#F0F0F0] flex items-center justify-center shrink-0 mr-3 mt-0.5"></div>',
    'className="w-[22px] h-[22px] rounded-full border border-[#F0F0F0] flex items-center justify-center shrink-0 mr-3"></div>'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
