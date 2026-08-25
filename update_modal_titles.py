import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace('<h3 className="text-white font-bold text-[18px]">Adicionar Etapas à Jornada</h3>', '<h3 className="text-white font-bold text-[20px]">Adicionar Etapas</h3>')
text = text.replace('<h3 className="text-white font-bold text-[18px]">Editar Etapa</h3>', '<h3 className="text-white font-bold text-[20px]">Editar Etapa</h3>')
text = text.replace('<h3 className="text-white font-bold text-[18px]">Tarefas da Etapa</h3>', '<h3 className="text-white font-bold text-[20px]">Tarefas da Etapa</h3>')

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
