const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');

// fix tasks delete
rules = rules.replace(
  `allow delete: if isVerifiedUser() && resource.data.ownerId == request.auth.uid;`,
  `allow delete: if isVerifiedUser() && (resource == null || resource.data.ownerId == request.auth.uid);`
);

// wait, let's also fix goals delete
rules = rules.replace(
  `match /goals/{goalId} {\n      allow read: if isVerifiedUser() && resource.data.ownerId == request.auth.uid;\n      allow create: if isVerifiedUser() && incoming().ownerId == request.auth.uid;\n      allow update: if isVerifiedUser() && resource.data.ownerId == request.auth.uid && incoming().ownerId == request.auth.uid;\n      allow delete: if isVerifiedUser() && resource.data.ownerId == request.auth.uid;\n    }`,
  `match /goals/{goalId} {\n      allow read: if isVerifiedUser() && resource.data.ownerId == request.auth.uid;\n      allow create: if isVerifiedUser() && incoming().ownerId == request.auth.uid;\n      allow update: if isVerifiedUser() && resource.data.ownerId == request.auth.uid && incoming().ownerId == request.auth.uid;\n      allow delete: if isVerifiedUser() && (resource == null || resource.data.ownerId == request.auth.uid);\n    }`
);

// notes delete
rules = rules.replace(
  `match /notes/{noteId} {\n      allow read: if isVerifiedUser() && resource.data.ownerId == request.auth.uid;\n      allow create: if isVerifiedUser() && incoming().ownerId == request.auth.uid;\n      allow update: if isVerifiedUser() && resource.data.ownerId == request.auth.uid && incoming().ownerId == request.auth.uid;\n      allow delete: if isVerifiedUser() && resource.data.ownerId == request.auth.uid;\n    }`,
  `match /notes/{noteId} {\n      allow read: if isVerifiedUser() && resource.data.ownerId == request.auth.uid;\n      allow create: if isVerifiedUser() && incoming().ownerId == request.auth.uid;\n      allow update: if isVerifiedUser() && resource.data.ownerId == request.auth.uid && incoming().ownerId == request.auth.uid;\n      allow delete: if isVerifiedUser() && (resource == null || resource.data.ownerId == request.auth.uid);\n    }`
);

fs.writeFileSync('firestore.rules', rules);
console.log('Rules patched.');
