import React, { useState, useEffect } from 'react';
import useTabFocus from '../hooks/useTabFocus';
import { AlertTriangle, XCircle, CheckCircle, Mic, MicOff, LogOut, ThumbsUp, ThumbsDown, Clock, Heart, Zap } from 'lucide-react';

const SessionView = ({ mode, partner, tasks, onComplete, onFail }) => {
      // Mode is in minutes, convert to seconds
      const [timeLeft, setTimeLeft] = useState(parseInt(mode) * 60);
      const [status, setStatus] = useState('active'); // active, warning, failed, success, abandoning, approved, denied
      const [isMicOn, setIsMicOn] = useState(false);
      const [isAbandoning, setIsAbandoning] = useState(false);
      const [reason, setReason] = useState(null);
      const [approvalProgress, setApprovalProgress] = useState(0);

      // Social & Flow States
      const [showTasks, setShowTasks] = useState(false); // Toggle for task list
      const [pulseReceived, setPulseReceived] = useState(false);
      const [pulseSent, setPulseSent] = useState(false);
      const [flowIntensity, setFlowIntensity] = useState(0); // 0-100 based on streak

      const abandonReasons = [
            "Emergency",
            "Deeply Distracted",
            "Unscheduled Break",
            "Technical Issues",
            "Task Completed Early",
            "Physical Strain"
      ];

      const handleFail = () => {
            if (status !== 'abandoning' && status !== 'approved' && status !== 'denied' && status !== 'failed') {
                  setStatus('failed');
                  // Trigger results screen after a brief delay so user sees the "Broken" state
                  setTimeout(() => onFail('fail'), 2000);
            }
      };

      const { isFocused, timeAway } = useTabFocus(handleFail);

      useEffect(() => {
            if (status !== 'active' && status !== 'warning') return;

            const timer = setInterval(() => {
                  setTimeLeft((prev) => {
                        if (prev <= 1) {
                              clearInterval(timer);
                              setStatus('success');
                              setTimeout(() => onComplete(), 1500);
                              return 0;
                        }

                        // Increase flow intensity over time if focused
                        if (isFocused && status === 'active') {
                              setFlowIntensity(current => Math.min(current + 0.5, 100)); // Max out after ~3 mins
                        } else {
                              setFlowIntensity(0);
                        }

                        return prev - 1;
                  });
            }, 1000);

            // Simulate partner pulse (randomly between 5m and 15m mark if long session, or just random)
            const randomPulseCheck = setInterval(() => {
                  if (status === 'active' && Math.random() > 0.995 && !pulseReceived) {
                        setPulseReceived(true);
                        setTimeout(() => setPulseReceived(false), 4000); // Pulse lasts 4s
                  }
            }, 2000);

            return () => {
                  clearInterval(timer);
                  clearInterval(randomPulseCheck);
            };
      }, [status, onComplete, isFocused, pulseReceived]);

      // Update status based on focus
      useEffect(() => {
            if (status === 'failed' || status === 'success' || status === 'abandoning' || status === 'approved' || status === 'denied') return;

            if (!isFocused) {
                  setStatus('warning');
                  setFlowIntensity(0);
            } else {
                  setStatus('active');
            }
      }, [isFocused, status]);

      const formatTime = (seconds) => {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };

      const handlePulseSend = () => {
            if (pulseSent) return;
            setPulseSent(true);
            // Reset pulse sent availability after 30s
            setTimeout(() => setPulseSent(false), 30000);
      };

      const handleAbandonRequest = (selectedReason) => {
            setReason(selectedReason);
            setIsAbandoning(false);
            setStatus('abandoning');

            // Simulate partner approval
            let progress = 0;
            const interval = setInterval(() => {
                  progress += 5;
                  setApprovalProgress(progress);
                  if (progress >= 100) {
                        clearInterval(interval);
                        // 70% chance of approval
                        const isApproved = Math.random() > 0.3;
                        setStatus(isApproved ? 'approved' : 'denied');
                  }
            }, 100);
      };

      // Flow Pulse Styles calculation
      // Ranges from 0 (no pulse) to 1 (max pulse)
      const pulseOpacity = 0.05 + (flowIntensity / 100) * 0.15; // 0.05 to 0.20
      const pulseSpeed = 10 - (flowIntensity / 100) * 5; // 10s down to 5s

      if (status === 'failed') {
            return (
                  <div className="min-h-screen bg-[#1c1c1b] flex flex-col items-center justify-center text-rose-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-rose-500/10 pointer-events-none animate-pulse" />
                        <XCircle className="w-24 h-24 mb-6" />
                        <h1 className="text-6xl font-serif mb-4 tracking-tighter">TETHER BROKEN</h1>
                        <p className="text-xl text-[#878782] font-sans">Focus was lost for too long.</p>
                        <p className="text-4xl mt-8 font-serif text-rose-400">-15 Presence</p>
                  </div>
            );
      }

      if (status === 'approved' || status === 'denied') {
            const approved = status === 'approved';
            return (
                  <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${approved ? 'bg-[#141413] text-[#88a090]' : 'bg-[#1c1c1b] text-rose-500'}`}>
                        {approved ? <ThumbsUp className="w-24 h-24 mb-6" /> : <ThumbsDown className="w-24 h-24 mb-6" />}
                        <h1 className="text-6xl font-serif mb-4 tracking-tighter uppercase">
                              {approved ? 'Abandon Approved' : 'Abandon Denied'}
                        </h1>
                        <p className="text-xl text-[#878782] font-sans mb-8">
                              {approved ? `${partner?.name} understood your reason: "${reason}"` : `${partner?.name} rejected the reason: "${reason}"`}
                        </p>
                        <p className={`text-4xl font-serif ${approved ? 'text-[#88a090]' : 'text-rose-400'}`}>
                              {approved ? '-5 Presence (Minimal)' : '-15 Presence (Penalty)'}
                        </p>
                        <button
                              onClick={() => onFail(approved ? 'approved_abandon' : 'denied_abandon')}
                              className="mt-12 px-8 py-3 bg-[#2a2a28] text-[#e0e0dc] rounded-full uppercase tracking-widest text-xs hover:bg-[#3a3a38] transition-colors"
                        >
                              Exit Session
                        </button>
                  </div>
            );
      }

      return (
            <div className={`min-h-screen transition-colors duration-1000 flex flex-col items-center justify-center relative overflow-hidden ${status === 'warning' ? 'bg-[#4a2b2b]' : 'bg-[#141413]'}`}>

                  {/* Visual Flow Pulse Background */}
                  <div
                        className="absolute inset-0 pointer-events-none rounded-full blur-[100px] transition-all ease-in-out bg-[#88a090]"
                        style={{
                              opacity: pulseOpacity,
                              transform: 'scale(0.8)',
                              animation: `breathing ${pulseSpeed}s infinite ease-in-out`
                        }}
                  />

                  {/* Partner Pulse Receipt Overlay */}
                  {pulseReceived && (
                        <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center animate-ping opacity-20">
                              <div className="w-[500px] h-[500px] rounded-full border border-[#88a090]" />
                        </div>
                  )}

                  {/* Warning Overlay */}
                  {status === 'warning' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-red-950/80 backdrop-blur-sm">
                              <AlertTriangle className="w-32 h-32 text-red-500 animate-bounce mb-8" />
                              <h1 className="text-6xl md:text-9xl font-black text-red-500 tracking-tighter uppercase animate-pulse text-center">
                                    Tether<br />Straining
                              </h1>
                              <p className="text-white font-mono mt-8 text-2xl">Return immediately</p>
                              <div className="w-64 h-2 bg-red-900 rounded-full mt-4 overflow-hidden">
                                    <div
                                          className="h-full bg-red-500 transition-all duration-100 ease-linear"
                                          style={{ width: `${(timeAway / 10) * 100}%` }}
                                    />
                              </div>
                        </div>
                  )}

                  {/* Shared Tasks Toggle */}
                  <div className="absolute top-8 right-8 z-30">
                        <button
                              onClick={() => setShowTasks(!showTasks)}
                              className={`p-3 rounded-full border transition-all ${showTasks ? 'bg-[#2a2a28] border-[#88a090] text-[#88a090]' : 'border-[#2a2a28] text-[#5c5c58] hover:text-[#e0e0dc]'}`}
                        >
                              <Zap className="w-5 h-5" />
                        </button>

                        {/* Tasks Dropdown */}
                        {showTasks && (
                              <div className="absolute right-0 top-14 w-64 bg-[#1c1c1b] border border-[#2a2a28] rounded-2xl p-4 shadow-2xl backdrop-blur-md">
                                    <h4 className="text-[10px] uppercase tracking-widest text-[#5c5c58] mb-3">Shared Intentions</h4>
                                    <div className="space-y-4">
                                          <div>
                                                <p className="text-xs text-[#88a090] mb-1 font-bold">You</p>
                                                <ul className="text-xs text-[#e0e0dc] space-y-1 ml-1 font-light">
                                                      {tasks?.my?.map((t, i) => <li key={i}>• {t}</li>)}
                                                      {(!tasks?.my || tasks.my.length === 0) && <li className="italic opacity-50">No tasks set</li>}
                                                </ul>
                                          </div>
                                          <div className="border-t border-[#2a2a28] pt-2">
                                                <p className="text-xs text-[#88a090] mb-1 font-bold">{partner?.name}</p>
                                                <ul className="text-xs text-[#e0e0dc] space-y-1 ml-1 font-light">
                                                      {tasks?.partner?.map((t, i) => <li key={i}>• {t}</li>)}
                                                      {(!tasks?.partner || tasks.partner.length === 0) && <li className="italic opacity-50">No tasks set</li>}
                                                </ul>
                                          </div>
                                    </div>
                              </div>
                        )}
                  </div>

                  {/* Abandon Modal */}
                  {(isAbandoning || status === 'abandoning') && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-[60] bg-[#141413]/95 backdrop-blur-xl transition-all duration-500">
                              {status === 'abandoning' ? (
                                    <div className="text-center w-full max-w-md px-8">
                                          <Clock className="w-16 h-16 text-[#88a090] animate-spin-slow mb-8 mx-auto" />
                                          <h2 className="text-3xl font-serif text-[#e0e0dc] mb-4 italic">Awaiting Understanding...</h2>
                                          <p className="text-[#878782] mb-8 font-light italic">"{reason}"</p>
                                          <div className="w-full h-1 bg-[#2a2a28] rounded-full overflow-hidden">
                                                <div
                                                      className="h-full bg-[#88a090] transition-all duration-100 ease-linear"
                                                      style={{ width: `${approvalProgress}%` }}
                                                />
                                          </div>
                                          <p className="text-[10px] uppercase tracking-widest text-[#5c5c58] mt-4 italic">Waiting for {partner?.name} to respond</p>
                                    </div>
                              ) : (
                                    <div className="text-center space-y-8 w-full max-w-lg px-8">
                                          <div>
                                                <h2 className="text-4xl font-serif text-[#e0e0dc] italic mb-2">Leave the Tether?</h2>
                                                <p className="text-[#878782] text-sm font-light">Abruptly leaving breaks the shared focus. Provide a reason for {partner?.name}.</p>
                                          </div>
                                          <div className="grid grid-cols-1 gap-3 text-left">
                                                {abandonReasons.map((r) => (
                                                      <button
                                                            key={r}
                                                            onClick={() => handleAbandonRequest(r)}
                                                            className="w-full py-4 px-6 bg-[#1c1c1b] border border-[#2a2a28] rounded-xl text-left hover:border-[#88a090] hover:bg-[#2a2a28] transition-all group"
                                                      >
                                                            <span className="text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{r}</span>
                                                      </button>
                                                ))}
                                          </div>
                                          <button
                                                onClick={() => setIsAbandoning(false)}
                                                className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5c5c58] hover:text-[#e0e0dc] transition-colors"
                                          >
                                                Remain Connected
                                          </button>
                                    </div>
                              )}
                        </div>
                  )}

                  {/* Ambient Background */}
                  <div className="absolute inset-0 paper-texture pointer-events-none opacity-20" />

                  {/* Timer Display */}
                  <div className={`relative z-10 text-center transition-all duration-500 ${(status === 'warning' || isAbandoning || status === 'abandoning') ? 'blur-sm scale-95 opacity-50' : ''}`}>
                        <div className="mb-8 flex items-center justify-center space-x-3">
                              <span className="inline-block w-2 h-2 rounded-full bg-[#88a090] animate-pulse" />
                              <span className="text-[#88a090] text-xs uppercase tracking-[0.3em] font-bold">Live Session</span>
                        </div>

                        <h1 className="text-[12rem] md:text-[16rem] leading-none font-serif text-[#e0e0dc] font-variant-numeric tabular-nums tracking-tighter">
                              {formatTime(timeLeft)}
                        </h1>

                        <div className="mt-12 flex items-center justify-center space-x-12 opacity-50">
                              <div className="text-center">
                                    <p className="text-xs uppercase tracking-widest text-[#5c5c58] mb-2">Partner</p>
                                    <p className="text-[#e0e0dc] font-serif">
                                          {partner ? `${partner.name} (${partner.major})` : 'Finding Partner...'}
                                    </p>
                              </div>
                              <div className="w-px h-8 bg-[#2a2a28]" />
                              <div className="text-center">
                                    <p className="text-xs uppercase tracking-widest text-[#5c5c58] mb-2">Status</p>
                                    <p className="text-[#88a090] font-serif">Connected</p>
                              </div>
                        </div>

                        {/* Interactive Controls */}
                        <div className="mt-20 flex items-center justify-center space-x-8">
                              {/* Pulse Button (Heart) */}
                              <button
                                    onClick={handlePulseSend}
                                    disabled={pulseSent}
                                    className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 relative ${pulseSent ? 'border-[#88a090] bg-[#88a090]/10 opacity-50 cursor-not-allowed' : 'border-[#2a2a28] hover:border-[#88a090] hover:bg-[#88a090]/10'}`}
                              >
                                    <Heart className={`w-5 h-5 ${pulseSent ? 'text-[#88a090] fill-[#88a090]' : 'text-[#4a4a48] hover:text-[#88a090]'}`} />
                                    {pulseReceived && <div className="absolute inset-0 rounded-full border border-[#88a090] animate-ping" />}
                              </button>

                              <button
                                    onClick={() => setIsMicOn(!isMicOn)}
                                    className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 ${isMicOn ? 'bg-[#88a090]/10 border-[#88a090] shadow-[0_0_20px_rgba(136,160,144,0.1)]' : 'border-[#2a2a28] hover:border-[#3a3a38]'}`}
                              >
                                    {isMicOn ? <Mic className="w-5 h-5 text-[#88a090]" /> : <MicOff className="w-5 h-5 text-[#4a4a48]" />}
                              </button>

                              <button
                                    onClick={() => setIsAbandoning(true)}
                                    className="w-14 h-14 rounded-full border border-[#2a2a28] hover:border-rose-500/50 flex items-center justify-center transition-all duration-500 hover:bg-rose-500/5 group"
                              >
                                    <LogOut className="w-5 h-5 text-[#4a4a48] group-hover:text-rose-400 transition-colors" />
                              </button>
                        </div>
                  </div>
            </div>
      );
};

export default SessionView;
