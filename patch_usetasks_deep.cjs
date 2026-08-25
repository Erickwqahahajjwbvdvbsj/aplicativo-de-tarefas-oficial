const fs = require('fs');
let code = fs.readFileSync('src/hooks/useTasks.ts', 'utf8');

code = code.replace(/Object\.keys\(docData\)\.forEach\(key => docData\[key\] === undefined && delete docData\[key\]\);/,
`const cleanObj = (obj) => {
          Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] === 'object') cleanObj(obj[key]);
            else if (obj[key] === undefined) delete obj[key];
          });
          return obj;
        };
        cleanObj(docData);`);

fs.writeFileSync('src/hooks/useTasks.ts', code);
