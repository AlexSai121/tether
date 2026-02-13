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
                  setLoading(false);
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
                  {!loading && children}
            </AuthContext.Provider>
      );
};
