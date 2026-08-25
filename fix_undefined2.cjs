const fs = require('fs');

const replacement = `const removeUndefined = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(removeUndefined);
        } else if (obj !== null && typeof obj === 'object') {
          if (obj.constructor.name !== 'Object' && obj.constructor.name !== 'Array') {
            return obj; // Leave FieldValue and other instances intact
          }
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
  content = content.replace(/const removeUndefined = \(obj: any\): any => \{\s*if \(Array\.isArray\(obj\)\) \{[\s\S]*?return obj;\s*\};/g, replacement);
  fs.writeFileSync(file, content);
}

fixFile('src/hooks/useTasks.ts');
fixFile('src/hooks/useGoals.ts');
fixFile('src/hooks/useNotes.ts');
