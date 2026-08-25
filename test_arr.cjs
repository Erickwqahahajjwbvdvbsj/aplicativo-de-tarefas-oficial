const removeUndefined = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj !== null && typeof obj === 'object') {
    if (obj.constructor.name !== 'Object' && obj.constructor.name !== 'Array') {
      return obj;
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

const input = { stages: [ { a: 1, b: undefined } ] };
console.log(JSON.stringify(removeUndefined(input)));
