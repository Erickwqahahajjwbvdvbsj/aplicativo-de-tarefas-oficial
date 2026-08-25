const { serverTimestamp } = require('firebase/firestore');

const removeUndefined = (obj) => {
        if (Array.isArray(obj)) {
          return obj.map(removeUndefined);
        } else if (obj !== null && typeof obj === 'object') {
          if (obj.constructor.name !== 'Object' && obj.constructor.name !== 'Array') {
            return obj; // Leave FieldValue and other instances intact
          }
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
const removed = removeUndefined({ time: fv, arr: [{x: undefined, y: 1}] });
console.log(removed.time.constructor.name);
console.log(removed.arr[0]);
