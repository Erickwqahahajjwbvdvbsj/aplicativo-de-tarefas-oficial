import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace('placeholder="Título da sua jornada: limite 100 caracteres"', 'placeholder="Qual é o seu objetivo? máx. 100 caracteres"')
text = text.replace('placeholder="Adicione uma descrição para a jornada..."', 'placeholder="Adicione uma descrição para o seu objetivo..."')

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
