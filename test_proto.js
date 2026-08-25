const { serverTimestamp } = require('firebase/firestore');
const fv = serverTimestamp();
console.log(Object.getPrototypeOf(fv) === Object.prototype);
console.log(Object.getPrototypeOf({}) === Object.prototype);
