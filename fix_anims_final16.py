import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Wait... the user said:
# "o título que ele deu aquela tarefa ja vai ficar salva... e quando ele fechar vai voltar a tela normal de etapas e ate na lista da tarefa vai desaparecer"
# The goal modal `animate={{ y: ... }}`
# Look at the goal modal's y-animation:
# animate={{ y: (isTaskSelectionOpen || isStartPickerOpen || isStartDatePickerOpen || isStartTimePickerOpen || isEndPickerOpen || isEndDatePickerOpen || isEndTimePickerOpen || editingStageId !== null) ? "100%" : 0, transition: { type: "spring", damping: 24, stiffness: 200 } }}

# BUT `isTaskSelectionOpen` is for ADDING STAGES! What about `editingStageTaskId !== null`?
# Well `editingStageId !== null` covers `editingStageTaskId !== null`!
# BUT wait! If `editingStageId !== null`, the Goal Modal (`isAddingGoal`) goes DOWN ("100%").
# Why does the user see it at the bottom in the screenshot??
# Oh! "100%" means it translates down by 100% of its OWN HEIGHT.
# If there's an extra block `<div className="absolute top-[98%] left-0 right-0 h-[100px] bg-[#1f1f1f] pointer-events-none" />` 
# AND it has `max-h-[90vh]`. 100% moves it exactly off-screen.
# Wait, `isAddingGoal` wrapper is:
text = text.replace(
    'animate={{ y: (isTaskSelectionOpen || isStartPickerOpen || isStartDatePickerOpen || isStartTimePickerOpen || isEndPickerOpen || isEndDatePickerOpen || isEndTimePickerOpen || editingStageId !== null) ? "100%" : 0, transition: { type: "spring", damping: 24, stiffness: 200 } }}',
    'animate={{ y: (isTaskSelectionOpen || isStartPickerOpen || isStartDatePickerOpen || isStartTimePickerOpen || isEndPickerOpen || isEndDatePickerOpen || isEndTimePickerOpen || editingStageId !== null || editingStageTaskId !== null) ? "100%" : 0, transition: { type: "spring", damping: 24, stiffness: 200 } }}'
)

# Actually, the user's issue with "Título da sua jornada" peeking up is not the main focus, the main focus is "a tela Extra de etapas vai descer para baixo vai sumir enquanto a tela para o usuário colocar o título da p**** da tarefa ... vai subir".
# My previous edits FIXED this exact thing! (I made `stageTaskModal` animate to `y: 100%` when `editingStageTaskId` is true).

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
