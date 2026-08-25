import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[120] border-t border-[#4f4f4f] flex flex-col overflow-hidden h-[90vh]"',
    'className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] rounded-t-[30px] z-[120] border-t border-[#4f4f4f] flex flex-col overflow-hidden max-h-[90vh] pb-6"'
)

text = text.replace(
    '<div className="flex-1 overflow-y-auto no-scrollbar relative p-6 pt-4 pb-20">',
    '<div className="overflow-y-auto no-scrollbar relative px-6 pt-0 shrink-1 max-h-[250px]">'
)

text = re.sub(
    r'\{/\* Fade out top border \*/\}.*?to-transparent pointer-events-none z-20" />',
    '',
    text,
    flags=re.DOTALL
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
