import sys

with open("src/components/ScreenAI.tsx", "r") as f:
    content = f.read()

# Fix onresult again
content = content.replace(
"""      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript);
      };""",
"""      recognition.onresult = (event: any) => {
        let currentSessionTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          currentSessionTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(finalTranscriptRef.current + ' ' + currentSessionTranscript);
      };"""
)

# Fix handlePauseRecording
content = content.replace(
"""  const handlePauseRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setAiState('paused');
  };""",
"""  const handlePauseRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    finalTranscriptRef.current = transcript;
    setAiState('paused');
  };"""
)

# Fix handleResumeRecording
content = content.replace(
"""  const handleResumeRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (e) { console.error(e); }
    }
    setAiState('recording');
  };""",
"""  const handleResumeRecording = () => {
    finalTranscriptRef.current = transcript;
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (e) { console.error(e); }
    }
    setAiState('recording');
  };"""
)

# Fix automatically paused state where finalTranscriptRef is not updated yet, but we handle it in Resume. Wait, what if the user clicks Stop (check mark) while it's auto-paused?
# handleStopRecording uses `transcript` state directly! 
# body: JSON.stringify({ text: transcript })
# So `finalTranscriptRef` doesn't matter there! It only matters for resume.

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(content)

