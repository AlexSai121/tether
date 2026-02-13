import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Heart, UserPlus, Check, Send, MessageCircle } from 'lucide-react';
import SessionService from '../services/SessionService';
import BondService from '../services/BondService';

const ResultsView = ({ result, oldElo, newElo, onReturn, sessionId, currentUser, partner, partnerUid }) => {
      const [displayedElo, setDisplayedElo] = useState(oldElo);
      const [gratitudeSent, setGratitudeSent] = useState(false);
      const [requestSent, setRequestSent] = useState(false);
      const [note, setNote] = useState('');
      const [noteSent, setNoteSent] = useState(false);
      const [partnerNote, setPartnerNote] = useState(null);

      const isGain = newElo >= oldElo;
      const difference = Math.abs(newElo - oldElo);

      useEffect(() => {
            const timer = setTimeout(() => setDisplayedElo(newElo), 500);
            return () => clearTimeout(timer);
      }, [newElo]);

      // Listen for partner's note
      useEffect(() => {
            if (!sessionId) return;
            const unsub = SessionService.subscribeToNotes(sessionId, (notes) => {
                  if (partnerUid && notes[partnerUid]) {
                        setPartnerNote(notes[partnerUid].text);
                  }
            });
            return () => unsub();
      }, [sessionId, partnerUid]);

      const handleSendGratitude = () => {
            setGratitudeSent(true);
      };

      const handleRequestBond = async () => {
            if (currentUser && partnerUid) {
                  await BondService.sendRequest(currentUser.uid, partnerUid);
            }
            setRequestSent(true);
      };

      const handleSendNote = async () => {
            if (!note.trim() || !sessionId || !currentUser) return;
            await SessionService.sendNote(sessionId, currentUser.uid, note.trim());
            setNoteSent(true);
      };

      return (
            <div className="min-h-screen bg-[#141413] flex flex-col items-center justify-center relative overflow-hidden text-[#e0e0dc]">
                  <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none" />

                  <div className="relative z-10 text-center max-w-md w-full px-8">
                        <div className={`mb-12 inline-flex items-center justify-center w-20 h-20 rounded-full border ${isGain ? 'border-[#88a090] bg-[#88a090]/10' : 'border-rose-500/50 bg-rose-500/10'}`}>
                              {isGain ? <TrendingUp className="w-10 h-10 text-[#88a090]" /> : <TrendingDown className="w-10 h-10 text-rose-400" />}
                        </div>

                        <h1 className="text-5xl font-serif mb-2 italic">
                              {isGain ? 'Presence Maintained' : 'Tether Strained'}
                        </h1>
                        <p className="text-[#5c5c58] text-sm uppercase tracking-widest font-bold mb-12">
                              {result === 'success' ? 'Deep Work Cycle Complete' : 'Session Terminated'}
                        </p>

                        <div className="bg-[#1c1c1b] border border-[#2a2a28] rounded-3xl p-10 mb-8 shadow-2xl">
                              <div className="flex justify-between items-end mb-8 text-left">
                                    <div>
                                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c58]">Rating Update</p>
                                          <h2 className="text-6xl font-serif tracking-tighter tabular-nums">{displayedElo}</h2>
                                    </div>
                                    <div className={`text-right ${isGain ? 'text-[#88a090]' : 'text-rose-400'}`}>
                                          <p className="text-xs font-bold uppercase">{isGain ? 'Presence Gained' : 'Presence Lost'}</p>
                                          <h3 className="text-2xl font-serif italic">{isGain ? `+${difference}` : `-${difference}`}</h3>
                                    </div>
                              </div>

                              {/* Elo Bar */}
                              <div className="h-1.5 w-full bg-[#2a2a28] rounded-full overflow-hidden mb-4">
                                    <div
                                          className={`h-full transition-all duration-1000 ease-out ${isGain ? 'bg-[#88a090]' : 'bg-rose-500'}`}
                                          style={{ width: `${(displayedElo % 500 / 500) * 100}%` }}
                                    />
                              </div>
                              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#5c5c58]">
                                    <span>Current Milestone</span>
                                    <span>Next Rank</span>
                              </div>
                        </div>

                        {/* Post-Session Note */}
                        <div className="bg-[#1c1c1b] border border-[#2a2a28] rounded-2xl p-6 mb-6">
                              {partnerNote && (
                                    <div className="mb-4 p-3 bg-[#88a090]/10 border border-[#88a090]/20 rounded-xl text-left">
                                          <p className="text-[10px] uppercase tracking-widest text-[#88a090] font-bold mb-1">
                                                <MessageCircle className="w-3 h-3 inline mr-1" /> From {partner?.name || 'Partner'}
                                          </p>
                                          <p className="text-sm font-light italic text-[#e0e0dc]">"{partnerNote}"</p>
                                    </div>
                              )}
                              {!noteSent ? (
                                    <div className="flex items-center space-x-3">
                                          <input
                                                type="text"
                                                value={note}
                                                onChange={e => setNote(e.target.value)}
                                                placeholder="Leave a note for your partner..."
                                                maxLength={280}
                                                className="flex-1 bg-transparent text-sm text-[#e0e0dc] placeholder-[#5c5c58] focus:outline-none font-light"
                                          />
                                          <button
                                                onClick={handleSendNote}
                                                disabled={!note.trim()}
                                                className="p-2 rounded-full bg-[#88a090]/20 text-[#88a090] hover:bg-[#88a090]/30 transition-colors disabled:opacity-30"
                                          >
                                                <Send className="w-4 h-4" />
                                          </button>
                                    </div>
                              ) : (
                                    <p className="text-xs text-[#88a090] uppercase tracking-widest font-bold flex items-center justify-center space-x-2">
                                          <Check className="w-4 h-4" />
                                          <span>Note Sent</span>
                                    </p>
                              )}
                        </div>

                        {/* Social Actions */}
                        {isGain && (
                              <div className="grid grid-cols-2 gap-4 mb-8">
                                    <button
                                          onClick={handleSendGratitude}
                                          disabled={gratitudeSent}
                                          className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all ${gratitudeSent ? 'bg-[#88a090]/10 border-[#88a090] text-[#88a090]' : 'bg-[#1c1c1b] border-[#2a2a28] hover:border-[#88a090] text-[#5c5c58] hover:text-[#e0e0dc]'}`}
                                    >
                                          {gratitudeSent ? <Check className="w-6 h-6" /> : <Heart className="w-6 h-6" />}
                                          <span className="text-[10px] uppercase tracking-widest font-bold">{gratitudeSent ? 'Sent' : 'Gratitude'}</span>
                                    </button>

                                    <button
                                          onClick={handleRequestBond}
                                          disabled={requestSent}
                                          className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all ${requestSent ? 'bg-[#88a090]/10 border-[#88a090] text-[#88a090]' : 'bg-[#1c1c1b] border-[#2a2a28] hover:border-[#88a090] text-[#5c5c58] hover:text-[#e0e0dc]'}`}
                                    >
                                          {requestSent ? <Check className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                                          <span className="text-[10px] uppercase tracking-widest font-bold">{requestSent ? 'Requested' : 'Bond'}</span>
                                    </button>
                              </div>
                        )}

                        <button
                              onClick={onReturn}
                              className="w-full py-4 bg-[#e0e0dc] text-[#141413] rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-xl"
                        >
                              Return to Observatory
                        </button>
                  </div>
            </div>
      );
};

export default ResultsView;
