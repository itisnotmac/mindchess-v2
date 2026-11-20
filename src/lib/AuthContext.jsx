import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still loading, null = logged out

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });
    return unsubscribe;
  }, []);

  async function signUp(email, password) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // Create the user's Firestore doc
    await setDoc(doc(db, 'users', credential.user.uid), {
      email: credential.user.email,
      createdAt: serverTimestamp(),
      premium: false,
    });
    return credential.user;
  }

  async function signIn(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  async function logOut() {
    await signOut(auth);
  }

  // Requires the user's password to re-auth before deletion (Firebase requirement)
  async function deleteAccount(password) {
    if (!user) throw new Error('No user signed in');
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    // Delete Firestore doc first
    await deleteDoc(doc(db, 'users', user.uid));
    // Then delete the Auth account
    await deleteUser(user);
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, logOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
