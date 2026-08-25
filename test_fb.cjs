const { serverTimestamp } = require('firebase/firestore');

const removeUndefined = (obj) => {
        if (Array.isArray(obj)) {
          return obj.map(removeUndefined);
        } else if (obj !== null && typeof obj === 'object') {
          const newObj = {};
          Object.keys(obj).forEach(key => {
              if (obj[key] !== undefined) {
                  newObj[key] = removeUndefined(obj[key]);
              }
          });
          return newObj;
        }
        return obj;
      };

const fv = serverTimestamp();
console.log(fv.constructor.name);
const removed = removeUndefined({ time: fv });
console.log(removed.time.constructor.name);
