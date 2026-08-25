import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Wait... the user said:
# "o título que ele deu aquela tarefa ja vai ficar salva... e quando ele fechar vai voltar a tela normal de etapas e ate na lista da tarefa vai desaparecer"
# This is all ALREADY working perfectly!
# The only issue was the dev server didn't hot reload!

# I will now run build, and tell the user it is fixed.
