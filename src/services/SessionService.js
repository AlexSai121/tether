import { db } from './firebase';
import {
      doc,
      onSnapshot,
      updateDoc,
      serverTimestamp
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
      }
};

export default SessionService;
