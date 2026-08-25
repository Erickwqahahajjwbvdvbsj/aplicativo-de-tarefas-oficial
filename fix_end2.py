import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

text = text.replace("""            </div>
          </motion.div>
        )}
      </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Discard Modal */}""", """            </div>
          </motion.div>
        )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Discard Modal */}""")

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
