import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace("      {/* Discard Modal */}", "          </motion.div>\n        )}\n      </AnimatePresence>\n      {/* Discard Modal */}")

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
