import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, LogOut, Save, User, BookOpen, Quote, Shield } from 'lucide-react';

const ProfileSettings = ({ onClose }) => {
      const { userProfile, updateProfile, logout } = useAuth();
      const [name, setName] = useState(userProfile?.displayName || '');
      const [major, setMajor] = useState(userProfile?.major || '');
      const [bio, setBio] = useState(userProfile?.bio || '');
      const [saving, setSaving] = useState(false);
      const [saved, setSaved] = useState(false);

      const majors = [
            'Computer Science', 'Engineering', 'Business', 'Law',
            'Medicine', 'Philosophy', 'Psychology', 'Design',
            'Mathematics', 'Literature', 'Economics', 'Other'
      ];

      const handleSave = async () => {
            setSaving(true);
            await updateProfile({
                  displayName: name.trim(),
                  major,
                  bio: bio.trim()
            });
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
      };

      const handleLogout = async () => {
            await logout();
            onClose();
      };

      return (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
                  {/* Backdrop */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

                  {/* Panel */}
                  <div className="relative z-10 w-full max-w-lg bg-[#1c1c1b] border border-[#2a2a28] rounded-t-3xl sm:rounded-3xl p-8 max-h-[90vh] overflow-y-auto animate-slideUp">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                              <h2 className="text-2xl font-serif italic text-[#e0e0dc]">Profile Settings</h2>
                              <button onClick={onClose} className="p-2 rounded-full hover:bg-[#2a2a28] transition-colors text-[#5c5c58] hover:text-[#e0e0dc]">
                                    <X className="w-5 h-5" />
                              </button>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-[#2a2a28]">
                              <div className="w-14 h-14 bg-[#2a2a28] border border-[#3a3a38] rounded-full flex items-center justify-center overflow-hidden">
                                    {userProfile?.photoURL ? (
                                          <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                          <User className="w-6 h-6 text-[#88a090]" />
                                    )}
                              </div>
                              <div className="flex-1">
                                    <p className="text-[10px] uppercase tracking-widest text-[#88a090] font-bold">{userProfile?.rank || 'Drifter'}</p>
                                    <p className="text-xl font-serif text-[#e0e0dc]">{userProfile?.elo || 1000} <span className="text-xs text-[#5c5c58]">Presence</span></p>
                              </div>
                              <div className="text-right">
                                    <div className="w-10 h-10 bg-[#88a090]/10 border border-[#88a090]/30 rounded-xl flex items-center justify-center">
                                          <Shield className="w-5 h-5 text-[#88a090]" />
                                    </div>
                              </div>
                        </div>

                        {/* Name */}
                        <div className="mb-6">
                              <label className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#5c5c58] font-bold mb-3">
                                    <User className="w-3 h-3" />
                                    <span>Display Name</span>
                              </label>
                              <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    maxLength={30}
                                    className="w-full bg-[#141413] border border-[#2a2a28] rounded-xl px-4 py-3 text-sm text-[#e0e0dc] placeholder-[#5c5c58] focus:outline-none focus:border-[#88a090] transition-colors"
                              />
                        </div>

                        {/* Major */}
                        <div className="mb-6">
                              <label className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#5c5c58] font-bold mb-3">
                                    <BookOpen className="w-3 h-3" />
                                    <span>Field of Focus</span>
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                    {majors.map(m => (
                                          <button
                                                key={m}
                                                onClick={() => setMajor(m)}
                                                className={`py-2 px-2 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all border ${major === m ? 'bg-[#88a090]/20 border-[#88a090] text-[#88a090]' : 'bg-[#141413] border-[#2a2a28] text-[#5c5c58] hover:text-[#e0e0dc]'}`}
                                          >
                                                {m}
                                          </button>
                                    ))}
                              </div>
                        </div>

                        {/* Bio */}
                        <div className="mb-8">
                              <label className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#5c5c58] font-bold mb-3">
                                    <Quote className="w-3 h-3" />
                                    <span>Bio</span>
                              </label>
                              <textarea
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    placeholder="A brief note about what drives your focus..."
                                    maxLength={160}
                                    rows={3}
                                    className="w-full bg-[#141413] border border-[#2a2a28] rounded-xl px-4 py-3 text-sm text-[#e0e0dc] placeholder-[#5c5c58] focus:outline-none focus:border-[#88a090] transition-colors resize-none font-light"
                              />
                              <p className="text-right text-[10px] text-[#5c5c58] mt-1">{bio.length}/160</p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                              <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full py-4 bg-[#e0e0dc] text-[#141413] rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                              >
                                    {saving ? (
                                          <div className="w-5 h-5 border-2 border-[#141413]/30 border-t-[#141413] rounded-full animate-spin" />
                                    ) : saved ? (
                                          <>
                                                <span>Saved ✓</span>
                                          </>
                                    ) : (
                                          <>
                                                <Save className="w-4 h-4" />
                                                <span>Save Changes</span>
                                          </>
                                    )}
                              </button>

                              <button
                                    onClick={handleLogout}
                                    className="w-full py-4 bg-transparent border border-[#2a2a28] text-rose-400 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-rose-500/10 hover:border-rose-500/30 transition-all flex items-center justify-center space-x-2"
                              >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                              </button>
                        </div>
                  </div>
            </div>
      );
};

export default ProfileSettings;
