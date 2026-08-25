const fs = require('fs');
let c = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');
if(c.includes('signInAnonymously(auth)')) {
  console.log("already anonymously signing in");
} else {
  console.log("need to sign in");
}
