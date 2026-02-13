import React, { useState } from 'react';
import Lobby from './components/Lobby';
import PreSessionView from './components/PreSessionView';
import SessionView from './components/SessionView';
import ResultsView from './components/ResultsView';
import EloService from './services/EloService';
import './index.css';

function App() {
  const [view, setView] = useState('lobby'); // lobby, pre-session, session, results
  const [userElo, setUserElo] = useState(2450);
  const [sessionMode, setSessionMode] = useState('50');
  const [partner, setPartner] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [oldElo, setOldElo] = useState(2450);
  const [sessionTasks, setSessionTasks] = useState([]); // [myTasks, partnerTasks]

  const handleMatchFound = (mode, partnerData) => {
    setSessionMode(mode);
    setPartner(partnerData);
    setView('pre-session');
  };

  const handlePreSessionComplete = (myTasks, partnerTasks) => {
    setSessionTasks({ my: myTasks, partner: partnerTasks });
    setView('session');
  };

  const handleSessionFinished = (resultType) => {
    const change = EloService.calculateEloChange(userElo, resultType);
    setOldElo(userElo);
    setUserElo(prev => prev + change);
    setLastResult(resultType);
    setView('results');
  };

  const handleReturnToLobby = () => {
    setView('lobby');
  };

  return (
    <>
      {view === 'lobby' && (
        <Lobby
          onMatchFound={handleMatchFound}
          userElo={userElo}
          userRank={EloService.getRank(userElo)}
        />
      )}

      {view === 'pre-session' && (
        <PreSessionView
          partner={partner}
          onReady={handlePreSessionComplete}
        />
      )}

      {view === 'session' && (
        <SessionView
          mode={sessionMode}
          partner={partner}
          tasks={sessionTasks}
          onComplete={() => handleSessionFinished('success')}
          onFail={(type = 'fail') => handleSessionFinished(type)}
        />
      )}

      {view === 'results' && (
        <ResultsView
          result={lastResult}
          oldElo={oldElo}
          newElo={userElo}
          onReturn={handleReturnToLobby}
        />
      )}
    </>
  );
}

export default App;
