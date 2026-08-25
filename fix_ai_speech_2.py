import sys

with open("src/components/ScreenAI.tsx", "r") as f:
    content = f.read()

content = content.replace(
"""  const aiStateRef = useRef(aiState);
  useEffect(() => {
    aiStateRef.current = aiState;
  }, []);""",
"""  const aiStateRef = useRef(aiState);
  useEffect(() => {
    aiStateRef.current = aiState;
  }, [aiState]);"""
)

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(content)

