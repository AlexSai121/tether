import { db } from './firebase';
import {
      doc,
      onSnapshot,
      updateDoc,
      serverTimestamp,
      collection,
      addDoc,
      query,
      where,
      orderBy,
      getDocs,
      limit
} from 'firebase/firestore';

const SessionService = {
      // Subscribe to session changes
      subscribe: (sessionId, callback) => {
            return onSnapshot(doc(db, 'sessions', sessionId), (docSnap) => {
                  if (docSnap.exists()) {
                        callback({ id: docSnap.id, ...docSnap.data() });
                  }
            });
      },

      // Update ready status in Pre-Session
      setReady: (sessionId, uid, tasks) => {
            return updateDoc(doc(db, 'sessions', sessionId), {
                  [`ready.${uid}`]: true,
                  [`tasks.${uid}`]: tasks || []
            });
      },

      // Start the session (can be triggered by either user once both are ready)
      startSession: (sessionId) => {
            return updateDoc(doc(db, 'sessions', sessionId), {
                  status: 'active',
                  startTime: serverTimestamp()
            });
      },

      // Send a pulse
      sendPulse: (sessionId, uid) => {
            // We just write a timestamp. The other client sees this change.
            return updateDoc(doc(db, 'sessions', sessionId), {
                  lastPulse: { from: uid, time: serverTimestamp() }
            });
      },

      // End or Fail session
      updateStatus: (sessionId, status) => {
            return updateDoc(doc(db, 'sessions', sessionId), {
                  status: status,
                  endTime: serverTimestamp()
            });
      },

      // Send a post-session note
      sendNote: (sessionId, uid, text) => {
            return updateDoc(doc(db, 'sessions', sessionId), {
                  [`notes.${uid}`]: {
                        text: text,
                        time: serverTimestamp()
                  }
            });
      },

      // Subscribe to notes on a session
      subscribeToNotes: (sessionId, callback) => {
            return onSnapshot(doc(db, 'sessions', sessionId), (docSnap) => {
                  if (docSnap.exists()) {
                        const data = docSnap.data();
                        callback(data.notes || {});
                  }
            });
      },

      // Get session history for a user
      getHistory: async (uid, maxResults = 20) => {
            const q = query(
                  collection(db, 'sessions'),
                  where('users', 'array-contains', uid),
                  orderBy('createdAt', 'desc'),
                  limit(maxResults)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      },

      // Write heartbeat
      writeHeartbeat: (sessionId, uid) => {
            return updateDoc(doc(db, 'sessions', sessionId), {
                  [`heartbeat.${uid}`]: serverTimestamp()
            });
      }
};

export default SessionService;
