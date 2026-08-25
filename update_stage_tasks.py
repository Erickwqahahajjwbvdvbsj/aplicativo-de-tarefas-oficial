import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Update default task title
text = text.replace("title: 'Clique aqui para editar o título da tarefa'", "title: 'Clique para editar: máx. 100 caracteres'")

# Add maxLength to textarea
old_textarea = """                         <textarea
                           value={t.title}
                           onChange={(e) => {"""
new_textarea = """                         <textarea
                           value={t.title}
                           maxLength={100}
                           onChange={(e) => {"""
text = text.replace(old_textarea, new_textarea)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
