import re

with open("src/components/ScreenAI.tsx", "r") as f:
    text = f.read()

# Make the save button work anytime draftTasks > 0
text = text.replace("disabled={aiState !== 'ready'}", "disabled={draftTasks.length === 0}")
text = text.replace("aiState === 'ready'\n               ? 'bg-[#ff3838]", "draftTasks.length > 0\n               ? 'bg-[#ff3838]")

# Update the aiState === 'ready' && parsedTask block to render the list of cards
# The cards need to be inside a scrollable area. The invisible barriers: top and bottom padding/margins so it's a fixed height area that scrolls.
old_ready_block = """        {aiState === 'ready' && parsedTask && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2 bg-black/40 p-6 rounded-3xl border border-white/10 backdrop-blur-md"
          >
            <Check className="w-10 h-10 text-[#ff3838] mb-2" />
            <h3 className="text-white text-[20px] font-bold">Tarefa Pronta!</h3>
            <p className="text-white/80 text-[15px] text-center mt-2 font-medium">{parsedTask.title}</p>
            <div className="flex gap-2 mt-3">
              {parsedTask.date && <span className="text-[12px] bg-white/10 text-white/70 px-3 py-1 rounded-full">{parsedTask.date}</span>}
              {parsedTask.category && <span className="text-[12px] bg-white/10 text-white/70 px-3 py-1 rounded-full">{parsedTask.category}</span>}
              {parsedTask.priority && <span className="text-[12px] bg-white/10 text-white/70 px-3 py-1 rounded-full">{parsedTask.priority}</span>}
            </div>
          </motion.div>
        )}"""

new_ready_block = """        {draftTasks.length > 0 && (
          <div className="w-full flex-1 max-h-[60vh] overflow-y-auto pt-8 pb-24 z-50 pointer-events-auto" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}>
            <div className="flex flex-col gap-2.5 w-full">
              <AnimatePresence>
                {draftTasks.map((task: any) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#2c2c2c] rounded-[14px] py-4 pl-4 pr-5 flex items-start justify-start flex-shrink-0 border border-white/5 shadow-lg"
                  >
                    <div className="w-[22px] h-[22px] rounded-full border border-[#F0F0F0] flex items-center justify-center shrink-0 mr-3">
                      <Check className="w-3.5 h-3.5 text-white opacity-0" />
                    </div>
                    <div className="flex flex-col justify-start flex-1 min-w-0">
                      <p className="text-white font-roboto font-normal text-[15px] leading-[22px] w-full break-words whitespace-normal">
                        {task.title}
                      </p>
                      {(task.date || task.priority) && (
                        <div className="flex gap-2 mt-2">
                            {task.date && <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{task.date}</span>}
                            {task.priority && <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{task.priority}</span>}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}"""
text = text.replace(old_ready_block, new_ready_block)

# Also fix the empty view where we show suggestions. Only show them if draftTasks is empty.
text = text.replace("{aiState === 'idle' && (", "{aiState === 'idle' && draftTasks.length === 0 && (")

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(text)
