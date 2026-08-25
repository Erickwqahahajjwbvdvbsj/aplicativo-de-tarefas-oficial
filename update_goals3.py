import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

# Details rendering
old_details = r"""          const goalTasks = allTasks.filter\(t => selectedGoal.taskIds.includes\(t.id\)\);
          const completedCount = goalTasks.filter\(t => t.completed\).length;
          const totalCount = goalTasks.length;
          const progress = totalCount > 0 \? \(completedCount / totalCount\) \* 100 : 0;
          const allTasksCompleted = completedCount === totalCount && totalCount > 0;"""

new_details = """          const allTasks = selectedGoal.stages?.flatMap(s => s.tasks) || [];
          const completedCount = allTasks.filter(t => t.completed).length;
          const totalCount = allTasks.length;
          const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
          const allTasksCompleted = completedCount === totalCount && totalCount > 0;"""

text = re.sub(old_details, new_details, text)

old_tarefas = r"""            \{\/\* TAREFAS VINCULADAS \*\/\}
            <div className="flex flex-col">
              <h3 className="text-\[\#73777d\] text-\[14px\] font-normal mb-1">Tarefas deste objetivo<\/h3>
              <div className="flex flex-col gap-\[2px\]">
                \{goalTasks.map\(task => \(
                  <div key=\{task.id\} className="flex items-center justify-between w-full p-4 rounded-\[14px\] bg-\[\#2c2c2c\] border border-transparent">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-\[\#cfcfcf\] flex items-center justify-center shrink-0">
                         \{task.completed && <Check className="w-3 h-3 text-\[\#cfcfcf\]" />\}
                      </div>
                      <span className=\{`text-\[15px\] font-normal $\{task.completed \? 'text-\[\#73777d\] line-through' : 'text-\[\#e8e8e9\]'\}`\}>
                        \{task.title\}
                      <\/span>
                    <\/div>
                  <\/div>
                \)\)\}
              <\/div>
            <\/div>"""

new_tarefas = """            {/* ETAPAS DA JORNADA */}
            <div className="flex flex-col mt-4">
              <h3 className="text-[#73777d] text-[14px] font-normal mb-2">Etapas</h3>
              <div className="flex flex-col gap-3">
                {selectedGoal.stages?.map((stage, idx) => (
                  <div key={stage.id} className="flex flex-col bg-[#2c2c2c] rounded-[14px] p-4 gap-2">
                     <span className="text-white font-bold text-[16px]">Etapa {idx + 1}: {stage.title}</span>
                     {stage.description && <span className="text-[#a0a0a0] text-[14px]">{stage.description}</span>}
                     <div className="flex flex-col gap-1 mt-2">
                        {stage.tasks.map(t => (
                           <div key={t.id} className="flex items-center gap-2 cursor-pointer" onClick={() => {
                              const newStages = selectedGoal.stages?.map(s => s.id === stage.id ? { ...s, tasks: s.tasks.map(task => task.id === t.id ? { ...task, completed: !task.completed } : task) } : s) || [];
                              updateGoal(selectedGoal.id, { stages: newStages });
                              setSelectedGoal({ ...selectedGoal, stages: newStages });
                           }}>
                              <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${t.completed ? 'text-green-500' : 'text-[#73777d]'}`} />
                              <span className={`text-[14px] transition-colors ${t.completed ? 'text-[#73777d] line-through' : 'text-white'}`}>{t.title}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                ))}
              </div>
            </div>"""

text = re.sub(old_tarefas, new_tarefas, text, flags=re.MULTILINE | re.DOTALL)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
