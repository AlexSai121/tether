import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Shield, ArrowRight } from 'lucide-react';

const LoginView = () => {
      const { login } = useAuth();
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');

      const handleLogin = async () => {
            try {
                  setError('');
                  setLoading(true);
                  await login();
            } catch {
                  setError('Failed to sign in. Please try again.');
            }
            setLoading(false);
      };

      return (
            <div className="min-h-screen bg-[#141413] flex flex-col items-center justify-center relative overflow-hidden text-[#e0e0dc]">
                  <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none" />

                  <div className="relative z-10 w-full max-w-md px-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-[#2a2a28] border border-[#3a3a38] rounded-full flex items-center justify-center mb-8">
                              <Shield className="w-8 h-8 text-[#88a090]" />
                        </div>

                        <h1 className="text-5xl font-serif mb-4 italic">
                              Enter the <br />
                              <span className="text-[#88a090] not-italic">Observatory.</span>
                        </h1>

                        <p className="text-[#878782] text-lg leading-relaxed font-light mb-12">
                              Connect your identity to track your presence, maintain your streak, and tether with others.
                        </p>

                        {error && <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl mb-6 text-xs uppercase tracking-widest">{error}</div>}

                        <button
                              onClick={handleLogin}
                              disabled={loading}
                              className="w-full py-4 bg-[#e0e0dc] text-[#141413] rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50"
                        >
                              {loading ? (
                                    <div className="w-5 h-5 border-2 border-[#141413]/30 border-t-[#141413] rounded-full animate-spin" />
                              ) : (
                                    <>
                                          <span>Begin with Google</span>
                                          <ArrowRight className="w-4 h-4" />
                                    </>
                              )}
                        </button>

                        <p className="mt-8 text-[10px] uppercase tracking-widest text-[#5c5c58]">
                              By entering, you agree to maintaining the stillness.
                        </p>
                  </div>
            </div>
      );
};

export default LoginView;
