import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';
import SessionService from '../services/SessionService';
import EloService from '../services/EloService';

const ArchivesView = ({ currentUser, onBack }) => {
      const [sessions, setSessions] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const fetch = async () => {
                  setLoading(true);
                  const history = await SessionService.getHistory(currentUser.uid, 20);
                  setSessions(history);
                  setLoading(false);
            };
            fetch();
      }, [currentUser.uid]);

      const formatDate = (timestamp) => {
            if (!timestamp) return '—';
            const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      };

      const formatDuration = (mode) => {
            return mode === '50' ? '50 min' : '25 min';
      };

      return (
            <div className="min-h-screen bg-[#141413] text-[#e0e0dc] relative overflow-hidden">
                  <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none" />

                  <div className="relative z-10 max-w-2xl mx-auto px-8 py-12">
                        {/* Header */}
                        <div className="flex items-center space-x-4 mb-12">
                              <button onClick={onBack} className="p-2 rounded-full bg-[#1c1c1b] border border-[#2a2a28] hover:border-[#3a3a38] transition-colors">
                                    <ArrowLeft className="w-5 h-5 text-[#5c5c58]" />
                              </button>
                              <div>
                                    <h1 className="text-3xl font-serif italic">The Archives</h1>
                                    <p className="text-[10px] uppercase tracking-widest text-[#5c5c58] mt-1">Your focus history</p>
                              </div>
                        </div>

                        {loading ? (
                              <div className="text-center py-24">
                                    <div className="w-6 h-6 border-2 border-[#88a090]/30 border-t-[#88a090] rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-[#5c5c58] text-xs uppercase tracking-widest">Loading archives...</p>
                              </div>
                        ) : sessions.length === 0 ? (
                              <div className="text-center py-24">
                                    <Clock className="w-12 h-12 text-[#2a2a28] mx-auto mb-4" />
                                    <p className="text-[#5c5c58] text-sm italic">No sessions yet. Your journey begins now.</p>
                              </div>
                        ) : (
                              <div className="space-y-4">
                                    {sessions.map((session, i) => {
                                          const isSuccess = session.status === 'finished';
                                          const partnerUid = session.users?.find(uid => uid !== currentUser.uid);
                                          const partnerName = session.userMap?.[partnerUid]?.name || 'Unknown';
                                          const change = EloService.calculateEloChange(1000, isSuccess ? 'success' : 'fail');

                                          return (
                                                <div
                                                      key={session.id}
                                                      className="bg-[#1c1c1b] border border-[#2a2a28] rounded-2xl p-6 flex items-center justify-between hover:border-[#3a3a38] transition-colors animate-fadeIn"
                                                      style={{ animationDelay: `${i * 0.05}s` }}
                                                >
                                                      <div className="flex items-center space-x-4">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSuccess ? 'bg-[#88a090]/10' : 'bg-rose-500/10'}`}>
                                                                  {isSuccess ? (
                                                                        <CheckCircle className="w-5 h-5 text-[#88a090]" />
                                                                  ) : (
                                                                        <XCircle className="w-5 h-5 text-rose-400" />
                                                                  )}
                                                            </div>
                                                            <div>
                                                                  <p className="text-sm font-semibold text-[#e0e0dc]">with {partnerName}</p>
                                                                  <div className="flex items-center space-x-3 mt-1">
                                                                        <span className="text-[10px] text-[#5c5c58] uppercase tracking-widest">{formatDate(session.createdAt)}</span>
                                                                        <span className="text-[10px] text-[#5c5c58]">·</span>
                                                                        <span className="text-[10px] text-[#5c5c58] uppercase tracking-widest">{formatDuration(session.mode)}</span>
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      <div className={`text-right ${isSuccess ? 'text-[#88a090]' : 'text-rose-400'}`}>
                                                            <div className="flex items-center space-x-1">
                                                                  {isSuccess ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                                  <span className="text-sm font-serif">{isSuccess ? `+${change}` : `${change}`}</span>
                                                            </div>
                                                            <p className="text-[10px] uppercase tracking-widest mt-0.5">{isSuccess ? 'Maintained' : 'Strained'}</p>
                                                      </div>
                                                </div>
                                          );
                                    })}
                              </div>
                        )}
                  </div>
            </div>
      );
};

export default ArchivesView;
