import re

with open("src/components/ScreenAI.tsx", "r") as f:
    text = f.read()

text = text.replace("style={{ maskImage:", "style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)', maskImage:")

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(text)
