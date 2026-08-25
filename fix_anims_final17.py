import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Make double sure that the editing task modal stays above the adding goal modal, etc.
# Z-indexes:
# goalModal: z-40
# isTaskSelectionOpen: z-[110]
# stageTaskModal (Editar Etapa): z-[120]
# stageTaskEditModal (Título da Tarefa): z-[130]
# They are completely correct.

# I will now inform the user.
