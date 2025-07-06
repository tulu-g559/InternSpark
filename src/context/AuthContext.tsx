
'use client';

import { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: newUser } = userCredential;
    
    // Create user profile in Firestore
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      await setDoc(doc(db, 'users', newUser.uid), {
        uid: newUser.uid,
        name,
        email,
        createdAt: serverTimestamp(),
      });
    } else {
        console.log('Firebase is not configured. Skipping Firestore user profile creation.');
    }

    return userCredential;
  }, []);

  const login = useCallback((email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    // User state will be updated by onAuthStateChanged listener
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    signup,
    login,
    logout,
  }), [user, loading, signup, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
