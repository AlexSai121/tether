import { db } from './firebase';
import {
      collection,
      addDoc,
      onSnapshot,
      query,
      where,
      startAfter,
      limit,
      getDocs,
      doc,
      updateDoc,
      serverTimestamp,
      deleteDoc
} from 'firebase/firestore';

const QUEUE_COLLECTION = 'queue';
const SESSION_COLLECTION = 'sessions';

const MatchmakingService = {
      /**
       * Joins the matchmaking queue and listens for a match.
       * @param {string} mode - '50' or '25'
       * @param {object} userProfile - Review the user's profile data
       * @param {function} onMatchFound - Callback when a match is made { sessionId, partner }
       * @returns {function} unsubscribe - Call this to cancel search
       */
      findMatch: async (mode, userProfile, onMatchFound) => {
            // 1. CLEANUP:Remove any old queue entries for this user first
            const oldQueueQuery = query(
                  collection(db, QUEUE_COLLECTION),
                  where('uid', '==', userProfile.uid)
            );
            const oldDocs = await getDocs(oldQueueQuery);
            oldDocs.forEach(d => deleteDoc(d.ref));

            console.log(`Searching for match in mode: ${mode}...`);

            // 2. SEARCH: Look for SOMEONE ELSE waiting
            // Simple FIFO: Order by createdAt asc (oldest first)
            // Note: In a real app, you'd need composite indexes for this query
            const availableQuery = query(
                  collection(db, QUEUE_COLLECTION),
                  where('mode', '==', mode),
                  where('status', '==', 'waiting'),
                  // where('uid', '!=', userProfile.uid), // Requires index, skipping for now
                  limit(10) // fetch a few to find one that isn't me
            );

            const snapshot = await getDocs(availableQuery);
            const potentialMatch = snapshot.docs.find(d => d.data().uid !== userProfile.uid);

            if (potentialMatch) {
                  // --- MATCH FOUND (I am the "Taker") ---
                  const partnerData = potentialMatch.data();
                  console.log("Found match!", partnerData);

                  // A. Create the Session
                  const sessionRef = await addDoc(collection(db, SESSION_COLLECTION), {
                        mode: mode,
                        status: 'pre-session',
                        createdAt: serverTimestamp(),
                        users: [partnerData.uid, userProfile.uid],
                        userMap: {
                              [partnerData.uid]: { name: partnerData.name, rank: partnerData.rank, major: partnerData.major || 'Undecided' },
                              [userProfile.uid]: { name: userProfile.displayName, rank: userProfile.rank, major: userProfile.major || 'Undecided' }
                        },
                        tasks: {},
                        ready: {}
                  });

                  // B. Update Partner's Queue Item (Notify them)
                  await updateDoc(doc(db, QUEUE_COLLECTION, potentialMatch.id), {
                        status: 'matched',
                        sessionId: sessionRef.id,
                        partnerUid: userProfile.uid
                  });

                  // C. Trigger my callback immediately
                  onMatchFound(sessionRef.id, partnerData);
                  return () => { };

            } else {
                  // --- NO MATCH (I am the "Maker") ---
                  console.log("No match found, joining queue...");

                  const queueRef = await addDoc(collection(db, QUEUE_COLLECTION), {
                        uid: userProfile.uid,
                        name: userProfile.displayName || 'Anonymous',
                        rank: userProfile.rank || 'Drifter',
                        major: userProfile.major || 'Undecided',
                        mode: mode,
                        status: 'waiting',
                        createdAt: serverTimestamp()
                  });

                  // D. Listen for updates to MY queue item
                  const unsubscribe = onSnapshot(doc(db, QUEUE_COLLECTION, queueRef.id), (docSnap) => {
                        if (!docSnap.exists()) return;

                        const data = docSnap.data();
                        if (data.status === 'matched' && data.sessionId) {
                              console.log("I was matched by someone else!");
                              // I need to fetch the session to know who matched me
                              // But for now, just returning the session ID is enough for App.jsx to switch views
                              // It will then subscribe to the session and get partner data
                              onMatchFound(data.sessionId, null);
                        }
                  });

                  return () => {
                        unsubscribe();
                        deleteDoc(queueRef); // Cleanup if user cancels
                  };
            }
      },

      // Start a solo session immediately
      startSoloSession: async (mode, userProfile) => {
            // Cleanup old queue items just in case
            const oldQueueQuery = query(
                  collection(db, QUEUE_COLLECTION),
                  where('uid', '==', userProfile.uid)
            );
            const oldDocs = await getDocs(oldQueueQuery);
            oldDocs.forEach(d => deleteDoc(d.ref));

            // Create session immediately
            const sessionRef = await addDoc(collection(db, SESSION_COLLECTION), {
                  mode: mode,
                  status: 'active', // Skip pre-session
                  createdAt: serverTimestamp(),
                  startTime: serverTimestamp(), // Start immediately
                  users: [userProfile.uid],
                  userMap: {
                        [userProfile.uid]: { name: userProfile.displayName, rank: userProfile.rank, major: userProfile.major || 'Undecided' }
                  },
                  tasks: {},
                  type: 'solo'
            });

            return sessionRef.id;
      },

      /**
       * Starts a solo session immediately.
       * @param {string} mode - '50' or '25'
       * @param {object} userProfile - User profile data
       * @returns {string} sessionId
       */
      startSoloSession: async (mode, userProfile) => {
            // Cleanup existing queue items
            const q = query(collection(db, QUEUE_COLLECTION), where('uid', '==', userProfile.uid));
            const oldDocs = await getDocs(q);
            oldDocs.forEach(d => deleteDoc(d.ref));

            const sessionRef = await addDoc(collection(db, SESSION_COLLECTION), {
                  mode,
                  status: 'active',
                  type: 'solo',
                  createdAt: serverTimestamp(),
                  startTime: serverTimestamp(),
                  users: [userProfile.uid],
                  userMap: {
                        [userProfile.uid]: {
                              name: userProfile.displayName,
                              rank: userProfile.rank,
                              major: userProfile.major || 'Undecided'
                        }
                  },
                  tasks: {}
            });

            return sessionRef.id;
      }
};

export default MatchmakingService;
