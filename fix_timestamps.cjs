const fs = require('fs');

const extractLogic = `const getTimestamp = (val: any, fallbackId?: string) => {
  if (!val) return fallbackId ? (parseInt(fallbackId) || 0) : 0;
  if (typeof val === 'string') return new Date(val).getTime();
  if (typeof val === 'number') return val;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val.seconds === 'number') return val.seconds * 1000;
  return fallbackId ? (parseInt(fallbackId) || 0) : 0;
};`;

function fixUseFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Inject getTimestamp at the top after imports if not exists
  if (!code.includes('const getTimestamp')) {
     code = code.replace(/export function use[A-Za-z]+\(\) \{/, 'export function ' + file.match(/use[A-Za-z]+/)[0] + '() {\n  ' + extractLogic);
  }

  // Replace getMillis in sort
  code = code.replace(/const getMillis = \(item\) => \{[\s\S]*?\};\n/g, `const getMillis = (item: any) => {
          if (item.pinnedAt) return getTimestamp(item.pinnedAt);
          if (item.updatedAt) return getTimestamp(item.updatedAt);
          if (item.createdAt) return getTimestamp(item.createdAt, item.id);
          return parseInt(item.id) || 0;
        };\n`);

  // Replace timeA and timeB logic
  code = code.replace(/const timeA = typeof a\.createdAt === 'string' \? new Date\(a\.createdAt\)\.getTime\(\) : \(a\.createdAt\?\.toMillis\?\.\(\) \|\| parseInt\(a\.id\) \|\| 0\);/g, 'const timeA = getTimestamp(a.createdAt, a.id);');
  code = code.replace(/const timeB = typeof b\.createdAt === 'string' \? new Date\(b\.createdAt\)\.getTime\(\) : \(b\.createdAt\?\.toMillis\?\.\(\) \|\| parseInt\(b\.id\) \|\| 0\);/g, 'const timeB = getTimestamp(b.createdAt, b.id);');

  fs.writeFileSync(file, code);
}

fixUseFile('src/hooks/useGoals.ts');
fixUseFile('src/hooks/useTasks.ts');

let goalsCode = fs.readFileSync('src/components/ScreenGoals.tsx', 'utf8');
if (!goalsCode.includes('const getTimestamp')) {
  goalsCode = goalsCode.replace(/const getStableGoalNumber = \(goalId: string\) => \{/, extractLogic + '\n  const getStableGoalNumber = (goalId: string) => {');
}
goalsCode = goalsCode.replace(/const timeA = typeof a\.createdAt === 'string' \? new Date\(a\.createdAt\)\.getTime\(\) : \(a\.createdAt\?\.toMillis\?\.\(\) \|\| parseInt\(a\.id\) \|\| 0\);/g, 'const timeA = getTimestamp(a.createdAt, a.id);');
goalsCode = goalsCode.replace(/const timeB = typeof b\.createdAt === 'string' \? new Date\(b\.createdAt\)\.getTime\(\) : \(b\.createdAt\?\.toMillis\?\.\(\) \|\| parseInt\(b\.id\) \|\| 0\);/g, 'const timeB = getTimestamp(b.createdAt, b.id);');
fs.writeFileSync('src/components/ScreenGoals.tsx', goalsCode);

console.log("Fixed!");
