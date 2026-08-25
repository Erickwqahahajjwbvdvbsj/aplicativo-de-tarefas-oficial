import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    content = f.read()

# Make all stages have the downward line (even the last one) because it goes to the final marker
content = content.replace(
"""                          {idx !== selectedGoal.stages!.length - 1 && (
                             <div className="absolute left-[7px] top-[24px] bottom-[-40px] w-0.5 bg-[#333333] z-0" />
                          )}""",
"""                          <div className="absolute left-[7px] top-[24px] bottom-[-40px] w-0.5 bg-[#333333] z-0" />"""
)

# Remove the upward line from the final marker
content = content.replace(
"""                          {/* Vertical Line to the final goal */}
                          <div className="absolute left-[7px] top-[-40px] bottom-[24px] w-0.5 bg-[#333333] z-0" />""",
""
)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(content)
