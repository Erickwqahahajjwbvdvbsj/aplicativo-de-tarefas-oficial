import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_details_stage = """                        <div key={stage.id} className="flex flex-col bg-[#2c2c2c] rounded-[14px] p-4 gap-2">
                           <span className="text-white font-bold text-[16px]">Etapa {idx + 1}</span>
                           {stage.title && <p className="text-white font-normal text-[15px] leading-[22px] whitespace-normal break-words">{stage.title}</p>}"""

new_details_stage = """                        <div key={stage.id} className="flex flex-col bg-[#2c2c2c] rounded-[14px] p-4 gap-2">
                           <span className="text-white font-bold text-[16px] leading-[22px] min-h-[22px] flex items-center">Etapa {idx + 1}</span>
                           {stage.title && <p className="text-white font-normal text-[15px] leading-[22px] whitespace-normal break-words mt-1">{stage.title}</p>}"""

text = text.replace(old_details_stage, new_details_stage)
with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
