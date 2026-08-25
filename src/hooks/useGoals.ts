import { useState, useEffect } from "react";
import { useProfile } from "./useProfile";
import { db, auth } from "../lib/firebase";
import { collection, doc, onSnapshot, setDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firebaseError";

export interface GoalStageTask {
  id: string;
  title: string;
  completed?: boolean;
  completedAt?: string | null;
}

export interface GoalStage {
  id: string;
  title: string;
  description?: string;
  tasks: GoalStageTask[];
}

export interface Goal {
  isPinned?: boolean;
  pinnedAt?: string;
  id: string;
  title: string;
  description?: string;
  stages?: GoalStage[];
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  ownerId?: string;
  completed?: boolean;
  completedAt?: any;
  createdAt?: any;
}

const goalEventTarget = new EventTarget();

export function useGoals() {
  const getTimestamp = (val: any, fallbackId?: string) => {
  if (!val) return fallbackId ? (parseInt(fallbackId) || 0) : 0;
  if (typeof val === 'string') return new Date(val).getTime();
  if (typeof val === 'number') return val;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val.seconds === 'number') return val.seconds * 1000;
  return fallbackId ? (parseInt(fallbackId) || 0) : 0;
};
  const { user } = useProfile();
  const [goals, setGoalsState] = useState<Goal[]>(() => {
    const cached = localStorage.getItem("@app_goals_cache");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSync = (e: any) => setGoalsState(e.detail);
    const handleLoadSync = (e: any) => setIsLoading(e.detail);
    goalEventTarget.addEventListener('goalsUpdated', handleSync);
    goalEventTarget.addEventListener('goalsLoaded', handleLoadSync);
    return () => {
      goalEventTarget.removeEventListener('goalsUpdated', handleSync);
      goalEventTarget.removeEventListener('goalsLoaded', handleLoadSync);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setGoalsState([]);
      setIsLoading(true);
      localStorage.removeItem("@app_goals_cache");
      setTimeout(() => {
        goalEventTarget.dispatchEvent(new CustomEvent('goalsUpdated', { detail: [] }));
        goalEventTarget.dispatchEvent(new CustomEvent('goalsLoaded', { detail: true }));
      }, 0);
      return;
    }

    const goalsRef = collection(db, 'goals');
    const q = query(goalsRef, where('ownerId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newGoals = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as Goal));

      newGoals.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        const getMillis = (item: any) => {
          if (item.pinnedAt) return getTimestamp(item.pinnedAt);
          if (item.updatedAt) return getTimestamp(item.updatedAt);
          if (item.createdAt) return getTimestamp(item.createdAt, item.id);
          return parseInt(item.id) || 0;
        };

        if (a.isPinned && b.isPinned) {
          const pinA = getMillis(a);
          const pinB = getMillis(b);
          if (pinB !== pinA) return pinB - pinA;
        }
        
        const timeA = getTimestamp(a.createdAt, a.id);
        const timeB = getTimestamp(b.createdAt, b.id);
        return timeB - timeA;
      });

      setGoalsState(newGoals);
      setIsLoading(false);
      // localStorage.removeItem('@app_goals_cache'); // localStorage.setItem('@app_goals_cache', JSON.stringify(newGoals));
      setTimeout(() => {
        goalEventTarget.dispatchEvent(new CustomEvent('goalsUpdated', { detail: newGoals }));
        goalEventTarget.dispatchEvent(new CustomEvent('goalsLoaded', { detail: false }));
      }, 0);
    }, (error: any) => {
      setIsLoading(false);
      setTimeout(() => goalEventTarget.dispatchEvent(new CustomEvent('goalsLoaded', { detail: false })), 0);
      if (error?.code === 'permission-denied' || String(error).includes('Missing or insufficient permissions')) {
        // ignore logout errors
      } else {
        handleFirestoreError(error, OperationType.GET, 'goals');
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const updateLocalGoals = (updater: (prev: Goal[]) => Goal[]) => {
    setGoalsState((prev) => {
      const newGoals = updater(prev);
      newGoals.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        const getMillis = (item: any) => {
          if (item.pinnedAt) return getTimestamp(item.pinnedAt);
          if (item.updatedAt) return getTimestamp(item.updatedAt);
          if (item.createdAt) return getTimestamp(item.createdAt, item.id);
          return parseInt(item.id) || 0;
        };

        if (a.isPinned && b.isPinned) {
          const pinA = getMillis(a);
          const pinB = getMillis(b);
          if (pinB !== pinA) return pinB - pinA;
        }
        
        const timeA = getTimestamp(a.createdAt, a.id);
        const timeB = getTimestamp(b.createdAt, b.id);
        return timeB - timeA;
      });
      // localStorage.removeItem('@app_goals_cache'); // localStorage.setItem('@app_goals_cache', JSON.stringify(newGoals));
      setTimeout(() => {
        goalEventTarget.dispatchEvent(new CustomEvent('goalsUpdated', { detail: newGoals }));
      }, 0);
      return newGoals;
    });
  };

  const addGoal = async (goal: Omit<Goal, "id" | "createdAt" | "ownerId">) => {
    const currentUser = user || auth.currentUser;
    if (!currentUser) return;
    const goalId = Date.now().toString() + "_" + Math.random().toString(36).substring(2, 7);
    const newGoal = { ...goal, id: goalId, ownerId: currentUser.uid } as Goal;

    updateLocalGoals((prev) => [newGoal, ...prev]);

    try {
      const cleanGoal = JSON.parse(JSON.stringify(newGoal));
      await setDoc(doc(db, 'goals', goalId), cleanGoal);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `goals/${goalId}`);
    }
    return newGoal;
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const currentUser = user || auth.currentUser;
    if (!currentUser) return;

    updateLocalGoals((prev) => prev.map(g => g.id === id ? { ...g, ...updates } : g));

    try {
      const payload: any = { ...updates, ownerId: currentUser.uid };
      const cleanPayload = JSON.parse(JSON.stringify(payload));
      await setDoc(doc(db, 'goals', id), cleanPayload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `goals/${id}`);
    }
  };

  const deleteGoal = async (id: string) => {
    const currentUser = user || auth.currentUser;
    if (!currentUser) return;

    updateLocalGoals((prev) => prev.filter(g => g.id !== id));

    try {
      await deleteDoc(doc(db, 'goals', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `goals/${id}`);
    }
  };

  return { goals, addGoal, updateGoal, deleteGoal, isLoading };
}
