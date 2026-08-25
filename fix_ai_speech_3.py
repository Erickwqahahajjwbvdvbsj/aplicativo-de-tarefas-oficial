import sys

with open("src/components/ScreenAI.tsx", "r") as f:
    content = f.read()

# Fix 1: Stop duplicating text
content = content.replace(
"""      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscriptRef.current + interimTranscript);
      };""",
"""      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript);
      };"""
)

# Fix 2: Remove the auto-restart loop that causes the beep
content = content.replace(
"""      recognition.onend = () => {
        if (aiStateRef.current === 'recording') {
           // sometimes it stops automatically, restart it if we are still 'recording'
           try { recognition.start(); } catch(e){}
        }
      };""",
"""      recognition.onend = () => {
        if (aiStateRef.current === 'recording') {
           // If it stopped automatically, just pause it so the user can review or send
           setAiState('paused');
        }
      };"""
)

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(content)

