const fs = require('fs');

function fixFile(file, objectName) {
  let code = fs.readFileSync(file, 'utf8');
  
  const targetRegex = new RegExp(`${objectName}\\.sort\\(\\(a, b\\) => \\{[\\s\\S]*?return timeB - timeA;\\s*\\}\\);`);
  
  const replacement = `${objectName}.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        const getMillis = (item) => {
          if (item.pinnedAt) {
            return typeof item.pinnedAt === 'string' ? new Date(item.pinnedAt).getTime() : (item.pinnedAt.toMillis?.() || 0);
          }
          if (item.updatedAt) {
            return typeof item.updatedAt === 'string' ? new Date(item.updatedAt).getTime() : (item.updatedAt.toMillis?.() || 0);
          }
          if (item.createdAt) {
            return typeof item.createdAt === 'string' ? new Date(item.createdAt).getTime() : (item.createdAt.toMillis?.() || 0);
          }
          return 0;
        };

        if (a.isPinned && b.isPinned) {
          const pinA = getMillis(a);
          const pinB = getMillis(b);
          if (pinB !== pinA) return pinB - pinA;
        }
        
        const timeA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : (a.createdAt?.toMillis?.() || parseInt(a.id) || 0);
        const timeB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : (b.createdAt?.toMillis?.() || parseInt(b.id) || 0);
        return timeB - timeA;
      });`;

  code = code.replace(targetRegex, replacement);
  
  // also fix updateLocalGoals / updateLocalTasks to sort immediately!
  if (objectName === 'newGoals') {
    const updateLocalRegex = /const updateLocalGoals = \(updater: \(prev: Goal\[\]\) => Goal\[\]\) => \{\s*setGoalsState\(\(prev\) => \{\s*const newGoals = updater\(prev\);/g;
    code = code.replace(updateLocalRegex, `const updateLocalGoals = (updater: (prev: Goal[]) => Goal[]) => {
    setGoalsState((prev) => {
      const newGoals = updater(prev);
      ${replacement}`);
  } else if (objectName === 'newTasks') {
    const updateLocalRegex = /const updateLocalTasks = \(updater: \(prev: Task\[\]\) => Task\[\]\) => \{\s*setTasksState\(\(prev\) => \{\s*const newTasks = updater\(prev\);/g;
    code = code.replace(updateLocalRegex, `const updateLocalTasks = (updater: (prev: Task[]) => Task[]) => {
    setTasksState((prev) => {
      const newTasks = updater(prev);
      ${replacement}`);
  }

  fs.writeFileSync(file, code);
}

fixFile('src/hooks/useGoals.ts', 'newGoals');
fixFile('src/hooks/useTasks.ts', 'newTasks');

