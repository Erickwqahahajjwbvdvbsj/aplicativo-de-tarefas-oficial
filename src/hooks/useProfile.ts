import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp, query, collection, where, getDocs, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInAnonymously, linkWithPopup, deleteUser } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firebaseError';

export interface UserProfile {
  name: string;
  photoUrl: string | null;
  dailyReminders: boolean;
  geminiApiKey: string;
  dailyDigestEnabled: boolean;
  dailyDigestTime: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'anônimo',
  photoUrl: null,
  dailyReminders: true,
  geminiApiKey: '',
  dailyDigestEnabled: false,
  dailyDigestTime: '09:00',
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('@app_profile_cache');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_PROFILE;
  });
  const [user, setUser] = useState(auth.currentUser);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const isDeletingRef = useRef(false);

  useEffect(() => {
    let lastUid = auth.currentUser?.uid;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(DEFAULT_PROFILE);
        setIsLoadingProfile(false);
        lastUid = undefined;
      } else {
        if (currentUser.uid !== lastUid) {
          setIsLoadingProfile(true);
          lastUid = currentUser.uid;
        }
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const userDoc = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDoc, (docSnap) => {
      if (isDeletingRef.current) return;
      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<UserProfile, 'ownerId' | 'updatedAt'>;
        const newProfile = {
            name: data.name || DEFAULT_PROFILE.name,
            photoUrl: data.photoUrl || DEFAULT_PROFILE.photoUrl,
            dailyReminders: data.dailyReminders ?? DEFAULT_PROFILE.dailyReminders,
            geminiApiKey: data.geminiApiKey || DEFAULT_PROFILE.geminiApiKey,
            dailyDigestEnabled: data.dailyDigestEnabled ?? DEFAULT_PROFILE.dailyDigestEnabled,
            dailyDigestTime: data.dailyDigestTime || DEFAULT_PROFILE.dailyDigestTime
        };
        setProfile(newProfile);
        localStorage.setItem('@app_profile_cache', JSON.stringify(newProfile));
      } else {
        if (!isDeletingRef.current) {
          // Create initial profile
          setDoc(userDoc, {
            ...DEFAULT_PROFILE,
            photoUrl: DEFAULT_PROFILE.photoUrl || '',
            ownerId: user.uid,
            updatedAt: serverTimestamp()
          }).catch(err => handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`));
        }
      }
      setIsLoadingProfile(false);
    }, (error) => {
      if (!isDeletingRef.current) {
        handleFirestoreError(error, OperationType.GET, `users/${user?.uid}`);
      }
      setIsLoadingProfile(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile); // optimistic update
    localStorage.setItem('@app_profile_cache', JSON.stringify(newProfile));

    try {
        await updateDoc(doc(db, 'users', user.uid), {
            ...updates,
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        await linkWithPopup(auth.currentUser, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
      return true;
    } catch (error: any) {
      if (error?.code === 'auth/credential-already-in-use') {
         await signInWithPopup(auth, provider);
         return true;
      }
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        console.error("Login failed:", error);
      }
      return false;
    }
  };

  const loginAnonymously = async () => {
    try {
      await signInAnonymously(auth);
      return true;
    } catch (error: any) {
      console.error("Anonymous login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem('@app_profile_cache');
    await signOut(auth);
  };

  const resetProfile = async () => {
    if (!user) return;
    try {
        const currentName = profile.name;
        const currentPhoto = profile.photoUrl;
        const currentApiKey = profile.geminiApiKey;

        const updatedDoc = {
            ...DEFAULT_PROFILE,
            name: currentName,
            photoUrl: currentPhoto || '',
            geminiApiKey: currentApiKey || '',
            ownerId: user.uid,
            updatedAt: serverTimestamp()
        };

        // Reset user profile document while keeping user name intact
        await setDoc(doc(db, 'users', user.uid), updatedDoc);
        
        // Delete all tasks for the user
        const tasksQuery = query(collection(db, 'tasks'), where('ownerId', '==', user.uid));
        const tasksSnapshot = await getDocs(tasksQuery);
        const taskDeletePromises = tasksSnapshot.docs.map(docSnap => deleteDoc(doc(db, 'tasks', docSnap.id)));
        
        // Delete all notifications for the user
        const notificationsQuery = query(collection(db, 'notifications'), where('ownerId', '==', user.uid));
        const notificationsSnapshot = await getDocs(notificationsQuery);
        const notificationDeletePromises = notificationsSnapshot.docs.map(docSnap => deleteDoc(doc(db, 'notifications', docSnap.id)));
        
        // Delete all goals for the user
        const goalsQuery = query(collection(db, 'goals'), where('ownerId', '==', user.uid));
        const goalsSnapshot = await getDocs(goalsQuery);
        const goalDeletePromises = goalsSnapshot.docs.map(docSnap => deleteDoc(doc(db, 'goals', docSnap.id)));
        
        await Promise.all([...taskDeletePromises, ...notificationDeletePromises, ...goalDeletePromises]);

        setProfile({
            ...DEFAULT_PROFILE,
            name: currentName,
            photoUrl: currentPhoto || '',
            geminiApiKey: currentApiKey || ''
        });
        localStorage.removeItem('@app_profile_cache');
    } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };


  const deleteAccount = async () => {
    if (!user) return;
    setIsDeletingAccount(true);
    isDeletingRef.current = true;
    sessionStorage.setItem('@app_deleting_account', 'true');
    try {
        // Allow the button inline spinner to animate visibly for 1.2 seconds
        await new Promise(r => setTimeout(r, 1200));

        // Delete user profile document first so Firestore listener ignores it via isDeletingRef
        await deleteDoc(doc(db, 'users', user.uid));
        
        // Delete all tasks for the user
        const tasksQuery = query(collection(db, 'tasks'), where('ownerId', '==', user.uid));
        const tasksSnapshot = await getDocs(tasksQuery);
        const taskDeletePromises = tasksSnapshot.docs.map(docSnap => deleteDoc(doc(db, 'tasks', docSnap.id)));
        
        // Delete all notifications for the user
        const notificationsQuery = query(collection(db, 'notifications'), where('ownerId', '==', user.uid));
        const notificationsSnapshot = await getDocs(notificationsQuery);
        const notificationDeletePromises = notificationsSnapshot.docs.map(docSnap => deleteDoc(doc(db, 'notifications', docSnap.id)));
        
        // Delete all goals for the user
        const goalsQuery = query(collection(db, 'goals'), where('ownerId', '==', user.uid));
        const goalsSnapshot = await getDocs(goalsQuery);
        const goalDeletePromises = goalsSnapshot.docs.map(docSnap => deleteDoc(doc(db, 'goals', docSnap.id)));
        
        await Promise.all([...taskDeletePromises, ...notificationDeletePromises, ...goalDeletePromises]);
        
        localStorage.removeItem('@app_profile_cache');
        sessionStorage.removeItem('@app_has_seen_auth');

        try {
          await deleteUser(user);
        } catch (e: any) {
          if (e?.code === 'auth/requires-recent-login') {
            alert('Por segurança, faça login novamente antes de excluir a conta.');
          }
          await signOut(auth);
        }

        // Wait 2 seconds so splash screen smoothly takes over before clearing deleting flag
        await new Promise(r => setTimeout(r, 2000));
    } catch (err: any) {
        console.error("Failed to delete account:", err);
        alert('Ocorreu um erro ao excluir a conta.');
    } finally {
        setIsDeletingAccount(false);
        isDeletingRef.current = false;
        sessionStorage.removeItem('@app_deleting_account');
        setProfile({ ...DEFAULT_PROFILE, name: '' });
    }
  };

  return { profile, updateProfile, resetProfile, user, loginWithGoogle, loginAnonymously, logout, isLoadingProfile, deleteAccount, isDeletingAccount };
}
