const fs = require('fs');
let code = fs.readFileSync('src/hooks/useGoals.ts', 'utf8');

if (!code.includes('isPinned?: boolean;')) {
  code = code.replace(/export interface Goal \{/, "export interface Goal {\n  isPinned?: boolean;\n  pinnedAt?: string;");
}

code = code.replace(/newGoals\.sort\(\(a, b\) => \{[\s\S]*?return timeB - timeA;\n\s*\}\);/, `newGoals.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (a.isPinned && b.isPinned) {
          const pinA = new Date(a.pinnedAt || a.updatedAt || a.createdAt || 0).getTime();
          const pinB = new Date(b.pinnedAt || b.updatedAt || b.createdAt || 0).getTime();
          if (pinB !== pinA) return pinB - pinA;
        }
        const timeA = a.createdAt?.toMillis?.() || parseInt(a.id) || 0;
        const timeB = b.createdAt?.toMillis?.() || parseInt(b.id) || 0;
        return timeB - timeA;
      });`);

fs.writeFileSync('src/hooks/useGoals.ts', code);
