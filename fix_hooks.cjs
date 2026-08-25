const fs = require('fs');

function fixHook(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  const sortRegex = /new\w+\.sort\(\(a, b\) => \{([\s\S]*?)return timeB - timeA;\s*\}\);/;
  
  // We want to replace the sort logic with a robust one that handles Firebase Timestamps.
  const robustSort = `new\w+.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        const getMillis = (obj) => {
          if (obj.pinnedAt) {
            if (typeof obj.pinnedAt === 'string') return new Date(obj.pinnedAt).getTime();
            if (obj.pinnedAt.toMillis) return obj.pinnedAt.toMillis();
          }
          if (obj.updatedAt) {
            if (typeof obj.updatedAt === 'string') return new Date(obj.updatedAt).getTime();
            if (obj.updatedAt.toMillis) return obj.updatedAt.toMillis();
          }
          if (obj.createdAt) {
            if (typeof obj.createdAt === 'string') return new Date(obj.createdAt).getTime();
            if (obj.createdAt.toMillis) return obj.createdAt.toMillis();
          }
          return 0;
        };

        if (a.isPinned && b.isPinned) {
          const pinA = getMillis(a);
          const pinB = getMillis(b);
          if (pinB !== pinA) return pinB - pinA;
        }
        
        const timeA = a.createdAt?.toMillis?.() || parseInt(a.id) || 0;
        const timeB = b.createdAt?.toMillis?.() || parseInt(b.id) || 0;
        return timeB - timeA;
      });`;
      
   // Actually let's just do a simple replacement for the sort block
}
