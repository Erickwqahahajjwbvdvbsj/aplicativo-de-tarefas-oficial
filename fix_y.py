import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'animate={{ y: (isTaskSelectionOpen || isStartPickerOpen || isStartDatePickerOpen || isStartTimePickerOpen || isEndPickerOpen || isEndDatePickerOpen || isEndTimePickerOpen) ? "100%" : 0, transition: { type: "spring", damping: 24, stiffness: 200 } }}',
    'animate={{ y: (isTaskSelectionOpen || isStartPickerOpen || isStartDatePickerOpen || isStartTimePickerOpen || isEndPickerOpen || isEndDatePickerOpen || isEndTimePickerOpen || editingStageId !== null) ? "100%" : 0, transition: { type: "spring", damping: 24, stiffness: 200 } }}'
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
