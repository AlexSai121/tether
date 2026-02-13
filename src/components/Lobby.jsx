import React, { useState } from 'react';
import { Shield, Target, Zap, Users, Flame, Info, ArrowRight, Circle, Link2 } from 'lucide-react';
import MatchmakingService from '../services/MatchmakingService';
import ProfileSettings from './ProfileSettings';
import BondsPanel from './BondsPanel';

const Lobby = ({ onMatchFound, userElo, userRank, userProfile, currentUser, onViewArchives }) => {
      const [mode, setMode] = useState('50');
      const [isSearching, setIsSearching] = useState(false);
      const [showSettings, setShowSettings] = useState(false);
      const [showBonds, setShowBonds] = useState(false);

      const userName = userProfile?.displayName || "Drifter";

      const handleFindMatch = async () => {
            setIsSearching(true);
            const partner = await MatchmakingService.findMatch(mode);
            setIsSearching(false);
            if (onMatchFound) onMatchFound(mode, partner);
      };

      return (
            <div className="min-h-screen bg-[#141413] text-[#b4b4af] font-sans relative overflow-hidden text-selection:bg-[#88a090]/30">
                  {/* Texture Layer */}
                  <div className="absolute inset-0 paper-texture pointer-events-none z-50 mix-blend-overlay" />

                  {/* Ambient Background Animations */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden text-selection:none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#88a090]/10 rounded-full blur-slow animate-drift" />
                        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-[#c2847a]/5 rounded-full blur-slow animate-drift-slow" />
                        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#a0a095]/5 rounded-full blur-slow animate-drift" style={{ animationDelay: '-5s' }} />
                  </div>

                  {/* Ambient depth */}
                  <div className="absolute inset-0 depth-gradient pointer-events-none" />

                  {/* Header */}
                  <header className="relative z-10 p-8 max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[#2a2a28] border border-[#3a3a38] rounded-full flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-[#88a090]" />
                              </div>
                              <button onClick={() => setShowBonds(true)} className="w-10 h-10 bg-[#2a2a28] border border-[#3a3a38] rounded-full flex items-center justify-center hover:border-[#88a090] transition-colors" title="Bonds">
                                    <Link2 className="w-5 h-5 text-[#5c5c58] hover:text-[#88a090]" />
                              </button>
                        </div>

                        <div className="flex items-center space-x-6">
                              <div className="hidden sm:block text-right">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#88a090] mb-0.5">{userRank}</p>
                                    <p className="text-sm font-serif text-[#e0e0dc]">{userName} <span className="text-[10px] text-[#5c5c58] ml-2 tabular-nums">{userElo}</span></p>
                              </div>
                              <div className="w-px h-8 bg-[#2a2a28]" />
                              <button onClick={() => setShowSettings(true)} className="text-[10px] font-bold uppercase tracking-widest hover:text-[#e0e0dc] transition-colors">
                                    Settings
                              </button>
                        </div>
                  </header>

                  <main className="relative z-10 max-w-5xl mx-auto px-8 pt-12 pb-24">

                        {/* Title Section */}
                        <div className="mb-20">
                              <h1 className="text-5xl md:text-7xl font-serif text-[#e0e0dc] leading-[1.1] tracking-tight mb-6 italic">
                                    The Quiet <br />
                                    <span className="text-[#88a090] not-italic">Connection.</span>
                              </h1>
                              <p className="max-w-lg text-[#878782] text-lg leading-relaxed font-light">
                                    Tether is a commitment to stillness. Choose your duration, find a partner, and remain present.
                                    Every second away from this window strains the bond.
                              </p>
                        </div>

                        {/* Grounded Selection Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                              {/* Mode Selection */}
                              <div className="md:col-span-7 space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-[#5c5c58]">Duration</p>

                                    <div className="flex flex-col space-y-3">
                                          <button
                                                onClick={() => setMode('50')}
                                                className={`flex items-center justify-between p-8 rounded-2xl border transition-all duration-500 group ${mode === '50' ? 'bg-[#1c1c1b] border-[#88a090] text-[#e0e0dc]' : 'border-[#2a2a28] hover:border-[#3a3a38]'}`}
                                          >
                                                <div className="flex items-center space-x-6">
                                                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${mode === '50' ? 'bg-[#88a090]/20' : 'bg-[#1c1c1b] group-hover:bg-[#2a2a28]'}`}>
                                                            <Target className={`w-6 h-6 ${mode === '50' ? 'text-[#88a090]' : 'text-[#4a4a48]'}`} />
                                                      </div>
                                                      <div className="text-left">
                                                            <h3 className="text-xl font-serif">Deep Session</h3>
                                                            <p className="text-xs text-[#5c5c58]">Focused endurance.</p>
                                                      </div>
                                                </div>
                                                <span className="text-2xl font-serif opacity-80">50m</span>
                                          </button>

                                          <button
                                                onClick={() => setMode('25')}
                                                className={`flex items-center justify-between p-8 rounded-2xl border transition-all duration-500 group ${mode === '25' ? 'bg-[#1c1c1b] border-[#88a090] text-[#e0e0dc]' : 'border-[#2a2a28] hover:border-[#3a3a38]'}`}
                                          >
                                                <div className="flex items-center space-x-6">
                                                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${mode === '25' ? 'bg-[#88a090]/20' : 'bg-[#1c1c1b] group-hover:bg-[#2a2a28]'}`}>
                                                            <Zap className={`w-6 h-6 ${mode === '25' ? 'text-[#88a090]' : 'text-[#4a4a48]'}`} />
                                                      </div>
                                                      <div className="text-left">
                                                            <h3 className="text-xl font-serif">Quiet Sprint</h3>
                                                            <p className="text-xs text-[#5c5c58]">Brief, intense focus.</p>
                                                      </div>
                                                </div>
                                                <span className="text-2xl font-serif opacity-80">25m</span>
                                          </button>
                                    </div>
                              </div>

                              {/* Action Card */}
                              <div className="md:col-span-5 flex flex-col pt-8">
                                    <div className="bg-[#1c1c1b] border border-[#2a2a28] rounded-3xl p-8 sage-glow">
                                          <div className="flex justify-between items-start mb-12">
                                                <div>
                                                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#88a090] mb-1">Queue Status</p>
                                                      <p className="text-sm font-serif italic text-[#e0e0dc]">Open for pairs</p>
                                                </div>
                                                <Circle className="w-3 h-3 text-[#88a090] animate-pulse" />
                                          </div>

                                          <div className="space-y-6 mb-12">
                                                <div className="flex justify-between items-end border-b border-[#2a2a28] pb-4 text-selection:none">
                                                      <span className="text-xs text-[#5c5c58]">Potential Yield</span>
                                                      <span className="font-serif text-[#88a090]">+25 Presence</span>
                                                </div>
                                                <div className="flex justify-between items-end border-b border-[#2a2a28] pb-4 text-selection:none">
                                                      <span className="text-xs text-[#5c5c58]">Drift Risk</span>
                                                      <span className="font-serif text-[#c2847a]">-15 Presence</span>
                                                </div>
                                          </div>

                                          <button
                                                onClick={handleFindMatch}
                                                disabled={isSearching}
                                                className="w-full py-4 bg-[#88a090] hover:bg-[#97af9e] text-[#141413] font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 group/play"
                                          >
                                                {isSearching ? (
                                                      <span className="w-5 h-5 border-2 border-[#141413]/30 border-t-[#141413] rounded-full animate-spin" />
                                                ) : (
                                                      <>
                                                            <span className="text-[11px] uppercase tracking-[0.3em]">Become Tethered</span>
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                      </>
                                                )}
                                          </button>
                                    </div>

                                    <div className="mt-8 flex justify-between space-x-4">
                                          <div className="bg-[#1c1c1b] border border-[#2a2a28] flex-1 rounded-2xl p-4 flex items-center space-x-3">
                                                <Users className="w-4 h-4 text-[#5c5c58]" />
                                                <div>
                                                      <p className="text-[9px] font-bold text-[#5c5c58] uppercase">Online</p>
                                                      <p className="text-sm font-serif">1,240</p>
                                                </div>
                                          </div>
                                          <div className="bg-[#1c1c1b] border border-[#2a2a28] flex-1 rounded-2xl p-4 flex items-center space-x-3">
                                                <Flame className="w-4 h-4 text-[#88a090]" />
                                                <div>
                                                      <p className="text-[9px] font-bold text-[#5c5c58] uppercase">Streak</p>
                                                      <p className="text-sm font-serif">5 days</p>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        {/* Editorial Columns */}
                        <div className="mt-32 pt-12 border-t border-[#2a2a28] grid grid-cols-1 md:grid-cols-3 gap-16">
                              <div className="space-y-4">
                                    <Info className="w-5 h-5 text-[#88a090] opacity-50" />
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-[#e0e0dc]">The Philosophy</h4>
                                    <p className="text-sm text-[#5c5c58] leading-relaxed font-light italic text-selection:bg-[#88a090]/20">
                                          Attention is the ultimate currency. To Tether is to vow that for a finite time,
                                          your presence will remain absolute. Drift is not just a digital switch—it is a break in character.
                                    </p>
                              </div>

                              <div className="space-y-6">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c5c58]">Observatory</h4>
                                    <div className="space-y-4">
                                          {[
                                                { name: "Law", value: "98.2%", label: "Retention" },
                                                { name: "Philosophy", value: "94.5%", label: "Retention" },
                                                { name: "CompSci", value: "88.1%", label: "Retention" }
                                          ].map((item, i) => (
                                                <div key={i} className="flex justify-between items-end">
                                                      <span className="text-sm text-[#e0e0dc]">{item.name}</span>
                                                      <div className="flex-grow mx-4 h-px bg-[#2a2a28] mb-1.5" />
                                                      <div className="text-right">
                                                            <span className="text-[10px] text-[#88a090] font-bold">{item.value}</span>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              </div>

                              <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c5c58]">Stewardship</h4>
                                    <p className="text-sm text-[#5c5c58] font-light italic">
                                          Last session: <br />
                                          <span className="text-[#e0e0dc] not-italic">"Alex matched with Julian from Med-Bio. Both remained tethered for 50m. Focus was maintained."</span>
                                    </p>
                                    <button onClick={onViewArchives} className="text-[10px] font-bold uppercase tracking-widest border-b border-[#2a2a28] pb-1 hover:border-[#88a090] transition-colors">
                                          Recent Archives
                                    </button>
                              </div>
                        </div>

                  </main>

                  {/* Footer */}
                  <footer className="p-12 border-t border-[#2a2a28] flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto opacity-30 grayscale">
                        <span className="text-[9px] uppercase tracking-[0.4em] font-medium">Tether / Collective Presence</span>
                        <p className="text-[9px] uppercase tracking-[0.4em] mt-4 md:mt-0 italic">Est. 2026 — Built for the focused mind.</p>
                  </footer>

                  {showSettings && <ProfileSettings onClose={() => setShowSettings(false)} />}
                  {showBonds && currentUser && <BondsPanel currentUser={currentUser} onClose={() => setShowBonds(false)} />}
            </div>
      );
};

export default Lobby;
