import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Wait... the user said:
# "o título que ele deu aquela tarefa ja vai ficar salva... e quando ele fechar vai voltar a tela normal de etapas e ate na lista da tarefa vai desaparecer"
# What is "até na lista da tarefa vai desaparecer"?
# Oh, "e a tela lista da tarefa vai desaparecer" -> "the task list screen will disappear".
# But wait, my code replace for isAddingGoal might have failed:
# Let's check `isAddingGoal` animation again!
