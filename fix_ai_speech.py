import sys

with open("src/components/ScreenAI.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "const finalTranscriptRef = useRef('');",
    "const finalTranscriptRef = useRef('');\n  const aiStateRef = useRef(aiState);\n  useEffect(() => {\n    aiStateRef.current = aiState;\n  }, [aiState]);"
)

content = content.replace(
    "if (aiState === 'recording') {",
    "if (aiStateRef.current === 'recording') {"
)

content = content.replace(
    "}, [aiState]);",
    "}, []);"
)

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(content)

