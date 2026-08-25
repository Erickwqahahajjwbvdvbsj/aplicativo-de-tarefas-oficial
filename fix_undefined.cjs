const fs = require('fs');

const replacement = `const removeUndefined = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(removeUndefined);
        } else if (obj !== null && typeof obj === 'object') {
          const newObj: any = {};
          Object.keys(obj).forEach(key => {
              if (obj[key] !== undefined) {
                  newObj[key] = removeUndefined(obj[key]);
              }
          });
          return newObj;
        }
        return obj;
      };`;

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const removeUndefined = \(obj: any\) => \{\s*const newObj: any = \{\};\s*Object\.keys\(obj\)\.forEach\(key => \{\s*if \(obj\[key\] !== undefined\) \{\s*newObj\[key\] = obj\[key\];\s*\}\s*\}\);\s*return newObj;\s*\};/g, replacement);
  fs.writeFileSync(file, content);
}

fixFile('src/hooks/useTasks.ts');
fixFile('src/hooks/useGoals.ts');
fixFile('src/hooks/useNotes.ts');
