import { getFirestore } from 'firebase/firestore';
import { app } from './firebase';

// Firestore database. Import `db` from here (not from ./firebase) so the
// Firestore library only loads on pages that use it. See firebase.js.
export const db = getFirestore(app);
