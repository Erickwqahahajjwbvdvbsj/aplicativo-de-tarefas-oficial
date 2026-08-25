const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoalAI.tsx', 'utf8');

const regex = /const handleSaveTask = \(\) => \{[\s\S]*?onNavigate\('home'\);\n    \}\n  \};/;

const replacement = `const handleSaveGoal = () => {
    if (draftGoals.length > 0) {
      draftGoals.forEach(goal => {
        addGoal({
           title: goal.title || 'Nova Jornada',
           description: goal.description || '',
           stages: goal.stages ? goal.stages.map((s: any) => ({
             id: s.id || Date.now().toString() + Math.random().toString(),
             title: s.title || '',
             description: s.description || '',
             startDate: s.startDate || '',
             startTime: s.startTime || '',
             endDate: s.endDate || '',
             endTime: s.endTime || '',
             tasks: s.tasks ? s.tasks.map((t: any) => ({
                id: t.id || Date.now().toString() + Math.random().toString(),
                title: t.title || '',
                completed: false
             })) : []
           })) : [],
           startDate: goal.startDate || '',
           startTime: goal.startTime || '',
           endDate: goal.endDate || '',
           endTime: goal.endTime || '',
           completed: false
        });
      });
      setAiState('idle');
      setDraftGoals([]);
      setTranscript('');
      if (onBack) {
        onBack();
      } else if (onNavigate) {
        onNavigate('goals');
      }
    }
  };`;

code = code.replace(regex, replacement);

code = code.replace(/handleSaveTask/g, 'handleSaveGoal');

fs.writeFileSync('src/components/ScreenGoalAI.tsx', code);
console.log('Fixed handleSaveGoal');
