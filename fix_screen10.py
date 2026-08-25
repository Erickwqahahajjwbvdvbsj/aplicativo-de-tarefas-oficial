with open("src/components/ScreenAI.tsx", "r") as f:
    text = f.read()

old_response = """          const data = await response.json();
          setDraftTasks((data.tasks || []).slice(0, 20));
          setAiState('idle');
          
          if (streamRef.current) {"""

new_response = """          const data = await response.json();
          if (data.noSpeechDetected) {
            setErrorMsg("Nenhuma voz ou fala capturada.");
          } else {
            setDraftTasks((data.tasks || []).slice(0, 20));
          }
          setAiState('idle');
          
          if (streamRef.current) {"""

text = text.replace(old_response, new_response)

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(text)
