const fs = require('fs');
const file = 'src/components/ScreenAI.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const finalTranscriptRef = useRef('');",
  "const finalTranscriptRef = useRef('');\n  const aiStateRef = useRef(aiState);\n  useEffect(() => {\n    aiStateRef.current = aiState;\n  }, [aiState]);"
);

content = content.replace(
  "if (aiState === 'recording') {",
  "if (aiStateRef.current === 'recording') {"
);

content = content.replace(
  "}, [aiState]);",
  "}, []);"
);

fs.writeFileSync(file, content);
