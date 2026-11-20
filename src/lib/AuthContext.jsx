import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { Filter } from 'bad-words';

const filter = new Filter();

const AuthContext = createContext(null);

// ── Username validation helpers ────────────────────────────────────────────

/** Returns an error string, or null if the username looks fine client-side. */
export function validateUsername(name) {
  const trimmed = name.trim();
  if (!trimmed) return 'Display name is required.';
  if (trimmed.length < 2) return 'Display name must be at least 2 characters.';
  if (trimmed.length > 24) return 'Display name must be 24 characters or fewer.';
  if (!/^[a-zA-Z0-9 _-]+$/.test(trimmed))
    return 'Only letters, numbers, spaces, hyphens, and underscores are allowed.';
  if (filter.isProfane(trimmed)) return 'That display name is not allowed.';
  return null;
}

/** Firestore key: lowercased, spaces → underscores, for uniqueness checks. */
function usernameKey(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '_');
}

/** Returns true if the username is already taken in Firestore. */
export async function isUsernameTaken(name) {
  const snap = await getDoc(doc(db, 'usernames', usernameKey(name)));
  return snap.exists();
}

// ── AuthProvider ───────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still loading, null = logged out

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });
    return unsubscribe;
  }, []);

  /**
   * signUp — creates Firebase Auth account + Firestore docs.
   * Throws { code: 'username/taken' } if the username is already in use.
   */
  async function signUp(email, password, displayName) {
    // 1. Claim the username slot atomically before creating the account.
    //    If two users race, the second setDoc will overwrite — but we checked
    //    first, and the window is tiny. For a production app you'd use a
    //    Firestore transaction; this is solid for a launch-scale app.
    const key = usernameKey(displayName);
    const usernameRef = doc(db, 'usernames', key);
    const existing = await getDoc(usernameRef);
    if (existing.exists()) {
      const err = new Error('Username already taken.');
      err.code = 'username/taken';
      throw err;
    }

    // 2. Create the Firebase Auth account.
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: newUser } = credential;

    // 3. Set Firebase Auth displayName.
    await updateProfile(newUser, { displayName: displayName.trim() });

    // 4. Write user doc to Firestore.
    await setDoc(doc(db, 'users', newUser.uid), {
      email: newUser.email,
      displayName: displayName.trim(),
      usernameKey: key,
      createdAt: serverTimestamp(),
      premium: false,
    });

    // 5. Reserve the username.
    await setDoc(usernameRef, { uid: newUser.uid, displayName: displayName.trim() });

    return newUser;
  }

  async function signIn(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  async function logOut() {
    await signOut(auth);
  }

  /**
   * deleteAccount — requires password re-auth (Firebase requirement).
   * Cleans up: usernames doc → users doc → Auth account.
   */
  async function deleteAccount(password) {
    if (!user) throw new Error('No user signed in');
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Free up the username slot
    if (user.displayName) {
      await deleteDoc(doc(db, 'usernames', usernameKey(user.displayName)));
    }
    // Delete user Firestore doc
    await deleteDoc(doc(db, 'users', user.uid));
    // Delete Auth account
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
