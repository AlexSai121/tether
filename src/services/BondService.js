import { db } from './firebase';
import {
      collection,
      addDoc,
      getDocs,
      updateDoc,
      doc,
      query,
      where,
      serverTimestamp,
      or,
      and
} from 'firebase/firestore';

const BONDS_COLLECTION = 'bonds';

const BondService = {
      // Send a bond request
      sendRequest: async (fromUid, toUid) => {
            // Check if request already exists
            const existing = query(
                  collection(db, BONDS_COLLECTION),
                  where('from', '==', fromUid),
                  where('to', '==', toUid)
            );
            const snap = await getDocs(existing);
            if (!snap.empty) return; // already sent

            return addDoc(collection(db, BONDS_COLLECTION), {
                  from: fromUid,
                  to: toUid,
                  status: 'pending',
                  createdAt: serverTimestamp()
            });
      },

      // Accept a bond request
      acceptRequest: async (bondId) => {
            return updateDoc(doc(db, BONDS_COLLECTION, bondId), {
                  status: 'accepted'
            });
      },

      // Get accepted bonds for a user
      getBonds: async (uid) => {
            const q1 = query(
                  collection(db, BONDS_COLLECTION),
                  where('from', '==', uid),
                  where('status', '==', 'accepted')
            );
            const q2 = query(
                  collection(db, BONDS_COLLECTION),
                  where('to', '==', uid),
                  where('status', '==', 'accepted')
            );

            const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
            const bonds = [];
            snap1.forEach(d => bonds.push({ id: d.id, ...d.data(), bondUid: d.data().to }));
            snap2.forEach(d => bonds.push({ id: d.id, ...d.data(), bondUid: d.data().from }));
            return bonds;
      },

      // Get pending incoming requests for a user
      getPendingRequests: async (uid) => {
            const q = query(
                  collection(db, BONDS_COLLECTION),
                  where('to', '==', uid),
                  where('status', '==', 'pending')
            );
            const snap = await getDocs(q);
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
};

export default BondService;
