const fs = require('fs');

let code = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');

const stableFn = `  const getStableGoalNumber = (goalId: string) => {
    const goalsByCreation = [...goals].sort((a, b) => {
      const timeA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : (a.createdAt?.toMillis?.() || parseInt(a.id) || 0);
      const timeB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : (b.createdAt?.toMillis?.() || parseInt(b.id) || 0);
      return timeA - timeB;
    });
    const index = goalsByCreation.findIndex(g => g.id === goalId);
    return String(index + 1).padStart(2, '0');
  };

  const filteredGoals = goals.filter(goal => !goal.completed && goal.title.toLowerCase().includes(searchQuery.toLowerCase()));`;

code = code.replace(/const filteredGoals = goals\.filter\(goal => !goal\.completed && goal\.title\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\);/, stableFn);

code = code.replace(/Objetivo \{String\(goals\.length - goals\.findIndex\(g => g\.id === goal\.id\)\)\.padStart\(2, '0'\)\}/g, 'Objetivo {getStableGoalNumber(goal.id)}');

fs.writeFileSync('src/components/ScreenGoals.tsx', code);
