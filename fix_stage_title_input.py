import re
with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    '               <input \n                  type="text" \n                  placeholder="Título da etapa" \n                  value={stage.title}\n                  onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, title: e.target.value } : s))}',
    '               <input \n                  type="text" \n                  maxLength={100}\n                  placeholder="Título da etapa: limite 100 caracteres" \n                  value={stage.title}\n                  onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, title: e.target.value } : s))}'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
