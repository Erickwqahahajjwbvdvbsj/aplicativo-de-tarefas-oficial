const remainingMs = 60000;
const totalSec = Math.floor(remainingMs / 1000);
const hrs = Math.floor(totalSec / 3600);
const mins = Math.floor((totalSec % 3600) / 60);
const secs = totalSec % 60;
console.log(`${hrs}:${mins}:${secs}`);
