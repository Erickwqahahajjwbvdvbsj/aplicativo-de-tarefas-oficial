import re

with open("src/components/ScreenAI.tsx", "r") as f:
    text = f.read()

# Make sure main action button checks aiState
text = text.replace("{aiState === 'idle' || aiState === 'ready' ?", "{aiState === 'idle' ?")

# Also, if we just set aiState to 'idle' after parsing, 'ready' state is not used anymore. 
# Wait, handleStopRecording currently sets it to 'ready'. Let's check handleStopRecording.
old_stop = """          const data = await response.json();
          setDraftTasks(data.tasks || []);
          setAiState('ready');"""

new_stop = """          const data = await response.json();
          setDraftTasks(data.tasks || []);
          setAiState('idle');"""

if old_stop in text:
    text = text.replace(old_stop, new_stop)

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(text)
