import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    content = f.read()

# I will find the end of the stages map and add the final marker.
marker = """                      ))}
                    </div>
                  </motion.div>"""

replacement = """                      ))}

                      {selectedGoal.stages && selectedGoal.stages.length > 0 && (
                        <div className="relative mt-8">
                          {/* Vertical Line to the final goal */}
                          <div className="absolute left-[7px] top-[-40px] bottom-[24px] w-0.5 bg-[#333333] z-0" />
                          <div className="flex items-center gap-4 relative z-10 bg-[#1f1f1f] py-1">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#fe3a32] to-[#af2223] flex items-center justify-center shrink-0 ring-4 ring-[#1f1f1f]">
                               <Target className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="text-white font-bold text-[16px] leading-[22px]">Objetivo Final</span>
                          </div>
                          <div className="pl-8 flex flex-col gap-2 mt-1">
                            <p className="text-[#a0a0a0] font-normal text-[15px] leading-[22px] whitespace-normal break-words">{selectedGoal.title}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>"""

content = content.replace(marker, replacement)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(content)
