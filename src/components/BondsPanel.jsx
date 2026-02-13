import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check, Users, Clock } from 'lucide-react';
import BondService from '../services/BondService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const BondsPanel = ({ currentUser, onClose }) => {
      const [bonds, setBonds] = useState([]);
      const [pending, setPending] = useState([]);
      const [loading, setLoading] = useState(true);
      const [tab, setTab] = useState('bonds'); // 'bonds' or 'pending'

      useEffect(() => {
            const fetchData = async () => {
                  setLoading(true);
                  const [bondsData, pendingData] = await Promise.all([
                        BondService.getBonds(currentUser.uid),
                        BondService.getPendingRequests(currentUser.uid)
                  ]);

                  // Fetch display names for bonds
                  const enrichedBonds = await Promise.all(
                        bondsData.map(async (bond) => {
                              const userSnap = await getDoc(doc(db, 'users', bond.bondUid));
                              return { ...bond, partnerProfile: userSnap.exists() ? userSnap.data() : null };
                        })
                  );

                  // Fetch display names for pending
                  const enrichedPending = await Promise.all(
                        pendingData.map(async (req) => {
                              const userSnap = await getDoc(doc(db, 'users', req.from));
                              return { ...req, fromProfile: userSnap.exists() ? userSnap.data() : null };
                        })
                  );

                  setBonds(enrichedBonds);
                  setPending(enrichedPending);
                  setLoading(false);
            };
            fetchData();
      }, [currentUser.uid]);

      const handleAccept = async (bondId) => {
            await BondService.acceptRequest(bondId);
            setPending(prev => prev.filter(p => p.id !== bondId));
            // Refresh bonds
            const updated = await BondService.getBonds(currentUser.uid);
            const enriched = await Promise.all(
                  updated.map(async (bond) => {
                        const userSnap = await getDoc(doc(db, 'users', bond.bondUid));
                        return { ...bond, partnerProfile: userSnap.exists() ? userSnap.data() : null };
                  })
            );
            setBonds(enriched);
      };

      return (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

                  <div className="relative z-10 w-full max-w-lg bg-[#1c1c1b] border border-[#2a2a28] rounded-t-3xl sm:rounded-3xl p-8 max-h-[90vh] overflow-y-auto animate-slideUp">
                        <div className="flex justify-between items-center mb-6">
                              <h2 className="text-2xl font-serif italic text-[#e0e0dc]">Bonds</h2>
                              <button onClick={onClose} className="p-2 rounded-full hover:bg-[#2a2a28] transition-colors text-[#5c5c58] hover:text-[#e0e0dc]">
                                    <X className="w-5 h-5" />
                              </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 mb-6 bg-[#141413] rounded-xl p-1">
                              <button
                                    onClick={() => setTab('bonds')}
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${tab === 'bonds' ? 'bg-[#2a2a28] text-[#e0e0dc]' : 'text-[#5c5c58]'}`}
                              >
                                    <Users className="w-3 h-3 inline mr-1.5" /> Bonds ({bonds.length})
                              </button>
                              <button
                                    onClick={() => setTab('pending')}
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${tab === 'pending' ? 'bg-[#2a2a28] text-[#e0e0dc]' : 'text-[#5c5c58]'}`}
                              >
                                    <Clock className="w-3 h-3 inline mr-1.5" /> Pending ({pending.length})
                              </button>
                        </div>

                        {loading ? (
                              <div className="text-center py-12">
                                    <div className="w-6 h-6 border-2 border-[#88a090]/30 border-t-[#88a090] rounded-full animate-spin mx-auto" />
                              </div>
                        ) : (
                              <div className="space-y-3">
                                    {tab === 'bonds' && bonds.length === 0 && (
                                          <p className="text-[#5c5c58] text-sm text-center py-8 italic">No bonds yet. Complete sessions and send bond requests!</p>
                                    )}
                                    {tab === 'bonds' && bonds.map(bond => (
                                          <div key={bond.id} className="flex items-center justify-between p-4 bg-[#141413] border border-[#2a2a28] rounded-2xl">
                                                <div className="flex items-center space-x-3">
                                                      <div className="w-10 h-10 bg-[#2a2a28] rounded-full flex items-center justify-center overflow-hidden">
                                                            {bond.partnerProfile?.photoURL ? (
                                                                  <img src={bond.partnerProfile.photoURL} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                  <Users className="w-4 h-4 text-[#5c5c58]" />
                                                            )}
                                                      </div>
                                                      <div>
                                                            <p className="text-sm font-semibold text-[#e0e0dc]">{bond.partnerProfile?.displayName || 'Unknown'}</p>
                                                            <p className="text-[10px] text-[#5c5c58] uppercase tracking-widest">{bond.partnerProfile?.major || 'Undecided'} · {bond.partnerProfile?.rank || 'Drifter'}</p>
                                                      </div>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-[#88a090]" title="Bonded" />
                                          </div>
                                    ))}

                                    {tab === 'pending' && pending.length === 0 && (
                                          <p className="text-[#5c5c58] text-sm text-center py-8 italic">No pending requests.</p>
                                    )}
                                    {tab === 'pending' && pending.map(req => (
                                          <div key={req.id} className="flex items-center justify-between p-4 bg-[#141413] border border-[#2a2a28] rounded-2xl">
                                                <div className="flex items-center space-x-3">
                                                      <div className="w-10 h-10 bg-[#2a2a28] rounded-full flex items-center justify-center overflow-hidden">
                                                            {req.fromProfile?.photoURL ? (
                                                                  <img src={req.fromProfile.photoURL} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                  <UserPlus className="w-4 h-4 text-[#5c5c58]" />
                                                            )}
                                                      </div>
                                                      <div>
                                                            <p className="text-sm font-semibold text-[#e0e0dc]">{req.fromProfile?.displayName || 'Unknown'}</p>
                                                            <p className="text-[10px] text-[#5c5c58] uppercase tracking-widest">Wants to bond</p>
                                                      </div>
                                                </div>
                                                <button
                                                      onClick={() => handleAccept(req.id)}
                                                      className="px-4 py-2 bg-[#88a090]/20 text-[#88a090] rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-[#88a090]/30 transition-colors"
                                                >
                                                      <Check className="w-3 h-3 inline mr-1" /> Accept
                                                </button>
                                          </div>
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      );
};

export default BondsPanel;
