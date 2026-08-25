import re

with open("src/components/ScreenGoals.tsx", "r") as f:
    text = f.read()

old_inputs = r"""            <div className="px-6 pt-6 pb-4 border-b border-\[\#4f4f4f\] shrink-0">
               <input 
                  type="text" 
                  placeholder="Título da etapa" 
                  value=\{stage\.title\}
                  onChange=\{e => setGoalStages\(goalStages\.map\(s => s\.id === editingStageId \? \{ \.\.\.s, title: e\.target\.value \} : s\)\)\}
                  className="w-full bg-transparent border-none outline-none text-white text-\[24px\] font-bold placeholder-\[\#73777d\]"
               \/>
               <textarea 
                  placeholder="Descrição da etapa \(opcional\)\.\.\." 
                  value=\{stage\.description\}
                  onChange=\{e => setGoalStages\(goalStages\.map\(s => s\.id === editingStageId \? \{ \.\.\.s, description: e\.target\.value \} : s\)\)\}
                  className="w-full h-\[80px\] bg-transparent border-none outline-none text-\[\#a0a0a0\] text-\[14px\] placeholder-\[\#555\] resize-none mt-4 no-scrollbar"
               \/>
               <div className="flex justify-start mt-2">
                 <button 
                    onClick=\{\(\) => \{
                       const newTask = \{ id: Date\.now\(\)\.toString\(\), title: '', completed: false \};
                       setGoalStages\(goalStages\.map\(s => s\.id === editingStageId \? \{ \.\.\.s, tasks: \[\.\.\.s\.tasks, newTask\] \} : s\)\);
                       setEditingStageTaskId\(newTask\.id\);
                    \}\}
                    className="text-\[\#ff3838\] text-\[14px\] font-medium hover:opacity-80 transition-opacity"
                 >
                    Adicionar tarefa
                 <\/button>
               <\/div>
            <\/div>"""

new_inputs = """            <div className="p-6 shrink-0 flex flex-col gap-5">
               <input 
                  type="text" 
                  placeholder="Título da etapa" 
                  value={stage.title}
                  onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, title: e.target.value } : s))}
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d]"
               />
               <textarea 
                  placeholder="Adicione uma descrição para a etapa..." 
                  value={stage.description}
                  onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, description: e.target.value } : s))}
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-[#e8e8e9] h-[100px] resize-none outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d] no-scrollbar"
               />
               <div className="flex justify-start">
                 <button 
                    onClick={() => {
                       const newTask = { id: Date.now().toString(), title: '', completed: false };
                       setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, tasks: [...s.tasks, newTask] } : s));
                       setEditingStageTaskId(newTask.id);
                    }}
                    className="text-[#e8e8e9] text-[14px] hover:opacity-80 transition-opacity bg-transparent"
                 >
                    Adicionar tarefa
                 </button>
               </div>
            </div>"""

text = re.sub(old_inputs, new_inputs, text, flags=re.MULTILINE)

with open("src/components/ScreenGoals.tsx", "w") as f:
    f.write(text)
