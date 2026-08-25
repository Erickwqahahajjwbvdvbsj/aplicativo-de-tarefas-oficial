with open("src/components/ScreenAI.tsx", "r") as f:
    text = f.read()

start_str = "export function ScreenAI({ onNavigate }: { onNavigate: (tab: 'home' | 'roadmap' | 'ai' | 'profile' | 'focus' | 'notifications') => void }) {"
start_idx = text.find(start_str)
start_idx += len(start_str)

return_idx = text.find("  return (", start_idx)
# Keep finding until it is the real one
while "return (" in text[return_idx:]:
    if '<div className="h-full w-full' in text[return_idx:return_idx+200]:
        break
    if '<div className="flex-1 w-full' in text[return_idx:return_idx+200]:
        break
    if '<div' in text[return_idx:return_idx+50]:
        break
    return_idx = text.find("  return (", return_idx + 1)

print("Return index found at:", return_idx)

logic = """
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aiState, setAiState] = useState<AiState>('idle');
  const [parsedTask, setParsedTask] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [transcript, setTranscript] = useState(''); 
  
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<any>(null);
  
  const { addTask } = useTasks();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SUGGESTIONS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartRecording = async () => {
    setErrorMsg('');
    setTranscript('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setAiState('recording');
    } catch (e) {
      console.error(e);
      setErrorMsg('Erro ao acessar o microfone.');
    }
  };

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setAiState('paused');
    }
  };

  const handleResumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setAiState('recording');
    }
  };

  const handleRestartRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    audioChunksRef.current = [];
    handleStartRecording();
  };

  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;

    setAiState('processing');

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        let base64data = reader.result as string;
        const base64Audio = base64data.split(',')[1];
        
        try {
          const response = await fetch('/api/gemini/parse-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64Audio, mimeType: audioBlob.type })
          });
          if (!response.ok) throw new Error("Erro na API");
          
          const data = await response.json();
          setParsedTask(data);
          setAiState('ready');
          
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track: any) => track.stop());
            streamRef.current = null;
          }
        } catch (error) {
          console.error(error);
          setErrorMsg("Erro ao processar sua voz.");
          setAiState('idle');
        }
      };
    };

    mediaRecorderRef.current.stop();
  };

  const handleSaveTask = () => {
    if (parsedTask) {
      addTask({
        title: parsedTask.title || 'Nova Tarefa',
        category: parsedTask.category || 'Pessoal',
        date: parsedTask.date || undefined,
        priority: parsedTask.priority || 'Média',
        completed: false
      });
      setAiState('idle');
      setParsedTask(null);
      setTranscript('');
      onNavigate('home');
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, []);
\n"""

new_text = text[:start_idx] + logic + text[return_idx:]
with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(new_text)
