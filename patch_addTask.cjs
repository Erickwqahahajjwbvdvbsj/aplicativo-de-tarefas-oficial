const fs = require('fs');

let code = fs.readFileSync('src/hooks/useTasks.ts', 'utf8');

const regex = /const cleanObj = \(obj: any\) => \{\s*Object\.keys\(obj\)\.forEach\(key => \{\s*if \(obj\[key\] && typeof obj\[key\] === 'object'\) cleanObj\(obj\[key\]\);\s*else if \(obj\[key\] === undefined\) delete obj\[key\];\s*\}\);\s*return obj;\s*\};/g;
const replacement = `const cleanObj = (obj: any) => {
          Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) cleanObj(obj[key]);
            else if (obj[key] === undefined) delete obj[key];
          });
          return obj;
        };`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/hooks/useTasks.ts', code);
