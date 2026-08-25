import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Fix the duplicate motion.div
text = text.replace("""            </div>
          </motion.div>
        )}
      </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>""", """            </div>
          </motion.div>
        )}
      </AnimatePresence>""")

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
