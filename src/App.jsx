import React, { useState, useEffect, useCallback } from 'react';
import Lobby from './components/Lobby';
import PreSessionView from './components/PreSessionView';
import SessionView from './components/SessionView';
import ResultsView from './components/ResultsView';
import LoginView from './components/LoginView';
import OnboardingView from './components/OnboardingView';
import ArchivesView from './components/ArchivesView';
import EloService from './services/EloService';
import MatchmakingService from './services/MatchmakingService';
import SessionService from './services/SessionService';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

const TetherApp = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const [view, setView] = useState('lobby'); // lobby, pre-session, session, results, archives
  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [partner, setPartner] = useState(null);
  const [partnerUid, setPartnerUid] = useState(null);

  // Results state
  const [lastResult, setLastResult] = useState('success');
  const [oldElo, setOldElo] = useState(1000);
  const [newElo, setNewElo] = useState(1000);

  const handleSessionFinished = useCallback(async (resultType) => {
    setLastResult(resultType);
    const currentElo = userProfile?.elo || 1000;
    const change = EloService.calculateEloChange(currentElo, resultType);
    setOldElo(currentElo);
    const calculatedNewElo = currentElo + change;
    setNewElo(calculatedNewElo);

    setView('results');

    // Persist to Firebase
    if (currentUser) {
      import('./services/firebase').then(async ({ db }) => {
        const { doc, updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'users', currentUser.uid), {
          elo: calculatedNewElo,
          rank: EloService.getRank(calculatedNewElo)
        });
      });
    }
  }, [currentUser, userProfile]);

  // --- Subscription to Active Session ---
  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = SessionService.subscribe(sessionId, (data) => {
      setSessionData(data);

      if (data.users && currentUser) {
        const pUid = data.users.find(uid => uid !== currentUser.uid);
        setPartnerUid(pUid || null);
        if (pUid && data.userMap && data.userMap[pUid]) {
          setPartner(data.userMap[pUid]);
        } else {
          setPartner(null);
        }
      }

      if (data.status === 'active' && view !== 'session') {
        setView('session');
      } else if (data.status === 'finished' && view !== 'results') {
        handleSessionFinished('success');
      } else if (data.status === 'abandoned' && view !== 'results') {
        handleSessionFinished('abandoned');
      }
    });

    return () => unsubscribe();
  }, [sessionId, view, currentUser, handleSessionFinished]);

  const handleFindMatch = async (mode) => {
    await MatchmakingService.findMatch(mode, userProfile, (sid) => {
      setSessionId(sid);
      setView('pre-session');
    });
  };

  const handlePreSessionReady = (myTasks) => {
    if (sessionId && currentUser) {
      SessionService.setReady(sessionId, currentUser.uid, myTasks);
    }
  };

  const handleReturnToLobby = () => {
    setView('lobby');
    setSessionId(null);
    setSessionData(null);
    setPartner(null);
    setPartnerUid(null);
  };

  if (!currentUser) {
    return <LoginView />;
  }

  if (!userProfile?.onboarded) {
    return <OnboardingView />;
  }

  return (
    <>
      {view === 'lobby' && (
        <Lobby
          onMatchFound={handleFindMatch}
          userElo={userProfile?.elo || 1000}
          userRank={userProfile?.rank || 'Drifter'}
          userProfile={userProfile}
          currentUser={currentUser}
          onViewArchives={() => setView('archives')}
        />
      )}

      {view === 'archives' && (
        <ArchivesView
          currentUser={currentUser}
          onBack={() => setView('lobby')}
        />
      )}

      {view === 'pre-session' && sessionId && (
        <PreSessionView
          sessionId={sessionId}
          currentUser={currentUser}
          partner={partner}
          sessionData={sessionData}
          onReady={handlePreSessionReady}
        />
      )}

      {view === 'session' && (
        <SessionView
          sessionId={sessionId}
          currentUser={currentUser}
          mode={sessionData?.mode || '50'}
          partner={partner}
          sessionData={sessionData}
          onComplete={() => SessionService.updateStatus(sessionId, 'finished')}
          onFail={() => SessionService.updateStatus(sessionId, 'abandoned')}
        />
      )}

      {view === 'results' && (
        <ResultsView
          result={lastResult}
          oldElo={oldElo}
          newElo={newElo}
          onReturn={handleReturnToLobby}
          sessionId={sessionId}
          currentUser={currentUser}
          partner={partner}
          partnerUid={partnerUid}
        />
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <TetherApp />
    </AuthProvider>
  );
}

export default App;
