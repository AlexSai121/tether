import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, ArrowLeft, User, BookOpen, Quote } from 'lucide-react';

const OnboardingView = () => {
      const { currentUser, updateProfile } = useAuth();
      const [step, setStep] = useState(1);
      const [name, setName] = useState(currentUser?.displayName || '');
      const [major, setMajor] = useState('');
      const [bio, setBio] = useState('');
      const [saving, setSaving] = useState(false);

      const majors = [
            'Computer Science', 'Engineering', 'Business', 'Law',
            'Medicine', 'Philosophy', 'Psychology', 'Design',
            'Mathematics', 'Literature', 'Economics', 'Other'
      ];

      const handleFinish = async () => {
            try {
                  setSaving(true);
                  await updateProfile({
                        displayName: name.trim() || currentUser.displayName,
                        major: major || 'Undecided',
                        bio: bio.trim(),
                        onboarded: true
                  });
            } catch (error) {
                  console.error("Failed to update profile", error);
                  alert("Something went wrong. Please check your connection or try again.");
            } finally {
                  setSaving(false);
            }
      };

      return (
            <div className="min-h-screen bg-[#141413] flex flex-col items-center justify-center relative overflow-hidden text-[#e0e0dc]">
                  <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none" />

                  {/* Progress Indicator */}
                  <div className="absolute top-8 left-0 right-0 flex justify-center space-x-3 z-10">
                        {[1, 2, 3].map(s => (
                              <div
                                    key={s}
                                    className={`h-1 rounded-full transition-all duration-500 ${s === step ? 'w-12 bg-[#88a090]' : s < step ? 'w-8 bg-[#88a090]/50' : 'w-8 bg-[#2a2a28]'}`}
                              />
                        ))}
                  </div>

                  <div className="relative z-10 w-full max-w-md px-8">

                        {/* Step 1: Name */}
                        {step === 1 && (
                              <div className="text-center animate-fadeIn">
                                    <div className="mx-auto w-16 h-16 bg-[#2a2a28] border border-[#3a3a38] rounded-full flex items-center justify-center mb-8">
                                          <User className="w-8 h-8 text-[#88a090]" />
                                    </div>
                                    <h1 className="text-4xl font-serif mb-3 italic">What shall we<br />call you?</h1>
                                    <p className="text-[#878782] text-sm font-light mb-10">This is how partners will see you during sessions.</p>
                                    <input
                                          type="text"
                                          value={name}
                                          onChange={e => setName(e.target.value)}
                                          placeholder="Your name"
                                          maxLength={30}
                                          className="w-full bg-[#1c1c1b] border border-[#2a2a28] rounded-xl px-6 py-4 text-center text-lg font-serif text-[#e0e0dc] placeholder-[#5c5c58] focus:outline-none focus:border-[#88a090] transition-colors"
                                    />
                                    <button
                                          onClick={() => setStep(2)}
                                          disabled={!name.trim()}
                                          className="mt-8 w-full py-4 bg-[#e0e0dc] text-[#141413] rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center space-x-3"
                                    >
                                          <span>Continue</span>
                                          <ArrowRight className="w-4 h-4" />
                                    </button>
                              </div>
                        )}

                        {/* Step 2: Major */}
                        {step === 2 && (
                              <div className="text-center animate-fadeIn">
                                    <div className="mx-auto w-16 h-16 bg-[#2a2a28] border border-[#3a3a38] rounded-full flex items-center justify-center mb-8">
                                          <BookOpen className="w-8 h-8 text-[#88a090]" />
                                    </div>
                                    <h1 className="text-4xl font-serif mb-3 italic">Your field<br />of focus?</h1>
                                    <p className="text-[#878782] text-sm font-light mb-10">Helps match you with like-minded individuals.</p>
                                    <div className="grid grid-cols-3 gap-3">
                                          {majors.map(m => (
                                                <button
                                                      key={m}
                                                      onClick={() => setMajor(m)}
                                                      className={`py-3 px-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all border ${major === m ? 'bg-[#88a090]/20 border-[#88a090] text-[#88a090]' : 'bg-[#1c1c1b] border-[#2a2a28] text-[#5c5c58] hover:border-[#3a3a38] hover:text-[#e0e0dc]'}`}
                                                >
                                                      {m}
                                                </button>
                                          ))}
                                    </div>
                                    <div className="flex space-x-3 mt-8">
                                          <button
                                                onClick={() => setStep(1)}
                                                className="py-4 px-6 bg-[#1c1c1b] border border-[#2a2a28] rounded-xl text-[#5c5c58] hover:text-[#e0e0dc] transition-colors"
                                          >
                                                <ArrowLeft className="w-4 h-4" />
                                          </button>
                                          <button
                                                onClick={() => setStep(3)}
                                                disabled={!major}
                                                className="flex-1 py-4 bg-[#e0e0dc] text-[#141413] rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center space-x-3"
                                          >
                                                <span>Continue</span>
                                                <ArrowRight className="w-4 h-4" />
                                          </button>
                                    </div>
                              </div>
                        )}

                        {/* Step 3: Bio */}
                        {step === 3 && (
                              <div className="text-center animate-fadeIn">
                                    <div className="mx-auto w-16 h-16 bg-[#2a2a28] border border-[#3a3a38] rounded-full flex items-center justify-center mb-8">
                                          <Quote className="w-8 h-8 text-[#88a090]" />
                                    </div>
                                    <h1 className="text-4xl font-serif mb-3 italic">A word about<br />yourself?</h1>
                                    <p className="text-[#878782] text-sm font-light mb-10">Optional. A brief note about what drives your focus.</p>
                                    <textarea
                                          value={bio}
                                          onChange={e => setBio(e.target.value)}
                                          placeholder="I focus best when..."
                                          maxLength={160}
                                          rows={3}
                                          className="w-full bg-[#1c1c1b] border border-[#2a2a28] rounded-xl px-6 py-4 text-sm text-[#e0e0dc] placeholder-[#5c5c58] focus:outline-none focus:border-[#88a090] transition-colors resize-none font-light"
                                    />
                                    <p className="text-right text-[10px] text-[#5c5c58] mt-2">{bio.length}/160</p>
                                    <div className="flex space-x-3 mt-6">
                                          <button
                                                onClick={() => setStep(2)}
                                                className="py-4 px-6 bg-[#1c1c1b] border border-[#2a2a28] rounded-xl text-[#5c5c58] hover:text-[#e0e0dc] transition-colors"
                                          >
                                                <ArrowLeft className="w-4 h-4" />
                                          </button>
                                          <button
                                                onClick={handleFinish}
                                                disabled={saving}
                                                className="flex-1 py-4 bg-[#e0e0dc] text-[#141413] rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
                                          >
                                                {saving ? (
                                                      <div className="w-5 h-5 border-2 border-[#141413]/30 border-t-[#141413] rounded-full animate-spin" />
                                                ) : (
                                                      <>
                                                            <span>Enter the Observatory</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                      </>
                                                )}
                                          </button>
                                    </div>
                              </div>
                        )}
                  </div>

                  <p className="absolute bottom-8 text-[10px] uppercase tracking-[0.2em] text-[#5c5c58] z-10">
                        You can update this later in Settings.
                  </p>
            </div>
      );
};

export default OnboardingView;
