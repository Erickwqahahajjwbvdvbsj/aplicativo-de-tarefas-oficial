import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    content = f.read()

# Remove the global line
content = content.replace(
"""                      {/* Vertical Timeline Line */}
                      {selectedGoal.stages && selectedGoal.stages.length > 0 && (
                        <div className="absolute left-[7px] top-[14px] bottom-0 w-0.5 bg-[#333333] z-0" />
                      )}""",
""
)

# Add the per-item line
old_item = """                        <div key={stage.id} className="relative mb-8 last:mb-0">
                          {/* Timeline Dot & Stage Title */}"""

new_item = """                        <div key={stage.id} className="relative mb-8 last:mb-0">
                          {/* Vertical Line to next stage */}
                          {idx !== selectedGoal.stages!.length - 1 && (
                             <div className="absolute left-[7px] top-[24px] bottom-[-40px] w-0.5 bg-[#333333] z-0" />
                          )}
                          {/* Timeline Dot & Stage Title */}"""

content = content.replace(old_item, new_item)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(content)
