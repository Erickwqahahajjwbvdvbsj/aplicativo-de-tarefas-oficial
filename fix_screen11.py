with open("src/components/ScreenAI.tsx", "r") as f:
    text = f.read()

old_check = """                    <div className="w-[22px] h-[22px] rounded-full border border-[#F0F0F0] flex items-center justify-center shrink-0 mr-3">
                      <Check className="w-3.5 h-3.5 text-white opacity-0" />
                    </div>"""

new_check = """                    <div className="w-[22px] h-[22px] rounded-full border border-[#F0F0F0] flex items-center justify-center shrink-0 mr-3 transition-all duration-300 group">
                      <Check className="w-3.5 h-3.5 text-white opacity-0 scale-50 group-hover:opacity-50 transition-all duration-300" />
                    </div>"""

text = text.replace(old_check, new_check)

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(text)
