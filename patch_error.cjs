const fs = require('fs');
let code = fs.readFileSync('src/lib/firebaseError.ts', 'utf8');

const replacement = `import { auth, db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: { userId: auth.currentUser?.uid },
    operationType,
    path
  };
  console.error('Firestore Error: ', errInfo);
  addDoc(collection(db, 'debug_errors'), errInfo).catch(e => console.error(e));
}
`;

fs.writeFileSync('src/lib/firebaseError.ts', replacement);
