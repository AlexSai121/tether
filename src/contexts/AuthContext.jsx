import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../services/firebase'; // Ensure this path is correct
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
      const [currentUser, setCurrentUser] = useState(null);
      const [userProfile, setUserProfile] = useState(null); // Additional data like Rank, Elo
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                  try {
                        setCurrentUser(user);
                        if (user) {
                              // Fetch or create user profile in Firestore
                              const userRef = doc(db, 'users', user.uid);
                              const userSnap = await getDoc(userRef);

                              if (userSnap.exists()) {
                                    setUserProfile(userSnap.data());
                              } else {
                                    // Initialize new user profile
                                    const newProfile = {
                                          uid: user.uid,
                                          displayName: user.displayName,
                                          email: user.email,
                                          photoURL: user.photoURL,
                                          elo: 1000,
                                          rank: 'Drifter',
                                          major: 'Undecided',
                                          bio: '',
                                          onboarded: false,
                                          createdAt: new Date()
                                    };
                                    await setDoc(userRef, newProfile);
                                    setUserProfile(newProfile);
                              }
                        } else {
                              setUserProfile(null);
                        }
                  } catch (error) {
                        console.error("Auth context error:", error);
                  } finally {
                        setLoading(false);
                  }
            });

            return unsubscribe;
      }, []);

      const login = async () => {
            try {
                  await signInWithPopup(auth, googleProvider);
            } catch (error) {
                  console.error("Login failed", error);
                  throw error;
            }
      };

      const logout = () => {
            return signOut(auth);
      };

      const updateProfile = async (updates) => {
            if (!currentUser) return;
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, updates);
            setUserProfile(prev => ({ ...prev, ...updates }));
      };

      const value = {
            currentUser,
            userProfile,
            login,
            logout,
            updateProfile,
            loading
      };

      return (
            <AuthContext.Provider value={value}>
                  {loading ? (
                        <div className="min-h-screen bg-[#141413] flex items-center justify-center text-[#88a090]">
                              <div className="flex flex-col items-center space-y-4">
                                    <div className="w-8 h-8 border-2 border-[#88a090]/20 border-t-[#88a090] rounded-full animate-spin" />
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50">Initializing Tether</p>
                              </div>
                        </div>
                  ) : children}
            </AuthContext.Provider>
      );
};
