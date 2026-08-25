import { useState, useEffect } from "react";
import { useProfile } from "./useProfile";
import { db, storage } from "../lib/firebase";
import { collection, doc, onSnapshot, setDoc, deleteDoc, query, where, serverTimestamp, getDocs } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { handleFirestoreError, OperationType } from "../lib/firebaseError";

export type TaskPriority = "Baixa" | "Média" | "Alta";

export interface Task {
  isPinned?: boolean;
  pinnedAt?: string;
  id: string;
  title: string;
  description: string;
  startTime: string;
  duration: number;
  priority: TaskPriority;
  category: string;
  date: string;
  effort: string;
  location: string;
  images?: string[];
  style?: string;
  completed?: boolean;
  completedAt?: string;
  createdAt?: any;
  endTime?: string;
  endDate?: string;
  durationStr?: string;
  autoTimerEnabled?: boolean;
}

// Global event target for local sync without context
const taskEventTarget = new EventTarget();

export function useTasks() {
  const getTimestamp = (val: any, fallbackId?: string) => {
  if (!val) return fallbackId ? (parseInt(fallbackId) || 0) : 0;
  if (typeof val === 'string') return new Date(val).getTime();
  if (typeof val === 'number') return val;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val.seconds === 'number') return val.seconds * 1000;
  return fallbackId ? (parseInt(fallbackId) || 0) : 0;
};
  const { user } = useProfile();
  const [tasks, setTasksState] = useState<Task[]>(() => {
    const cached = localStorage.getItem("@app_tasks_cache");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSync = (e: any) => setTasksState(e.detail);
    const handleLoadSync = (e: any) => setIsLoading(e.detail);
    taskEventTarget.addEventListener('tasksUpdated', handleSync);
    taskEventTarget.addEventListener('tasksLoaded', handleLoadSync);
    return () => {
      taskEventTarget.removeEventListener('tasksUpdated', handleSync);
      taskEventTarget.removeEventListener('tasksLoaded', handleLoadSync);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setTasksState([]);
      setIsLoading(true);
      localStorage.removeItem("@app_tasks_cache");
      setTimeout(() => {
        taskEventTarget.dispatchEvent(new CustomEvent('tasksUpdated', { detail: [] }));
        taskEventTarget.dispatchEvent(new CustomEvent('tasksLoaded', { detail: true }));
      }, 0);
      return;
    }

    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('ownerId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const now = new Date();
      
      let goalTaskIds = new Set<string>();
      try {
        const goalsSnapshot = await getDocs(query(collection(db, 'goals'), where('ownerId', '==', user.uid)));
        goalsSnapshot.forEach(g => {
          const data = g.data();
          (data.taskIds || []).forEach((tid: string) => goalTaskIds.add(tid));
        });
      } catch (e: any) {
        if (e?.code === 'permission-denied' || String(e).includes('Missing or insufficient permissions')) {
          // ignore logout errors
        } else {
          console.error("Error fetching goals for cleanup check", e);
        }
      }

      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const docsToDelete: string[] = [];
      const newTasks = snapshot.docs.reduce((acc, docSnapshot) => {
        const data = docSnapshot.data();
        if (data.completed && data.completedAt) {
          const completedDate = new Date(data.completedAt);
          if (!isNaN(completedDate.getTime())) {
            const completedDayStart = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate()).getTime();
            const diffDays = Math.floor((todayStart - completedDayStart) / (1000 * 60 * 60 * 24));
            // Deleta somente a meia-noite apos completar 7 dias corridos completos
            if (diffDays > 7 && !goalTaskIds.has(docSnapshot.id)) {
              docsToDelete.push(docSnapshot.id);
              return acc;
            }
          }
        }
        
        acc.push({
          id: docSnapshot.id,
          ...data
        } as Task);
        return acc;
      }, [] as Task[]);

      // Asynchronously delete expired completed tasks from Firestore
      docsToDelete.forEach(id => {
        deleteDoc(doc(db, 'tasks', id)).catch(err => {
          console.error("Failed to delete expired task:", err);
        });
      });

      newTasks.sort((a, b) => {
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
      setTasksState(newTasks);
      setIsLoading(false);
      localStorage.setItem("@app_tasks_cache", JSON.stringify(newTasks));
      setTimeout(() => {
        taskEventTarget.dispatchEvent(new CustomEvent('tasksUpdated', { detail: newTasks }));
        taskEventTarget.dispatchEvent(new CustomEvent('tasksLoaded', { detail: false }));
      }, 0);
    }, (error: any) => {
      setIsLoading(false);
      setTimeout(() => taskEventTarget.dispatchEvent(new CustomEvent('tasksLoaded', { detail: false })), 0);
      if (error?.code === 'permission-denied' || String(error).includes('Missing or insufficient permissions')) {
        // ignore
      } else {
        handleFirestoreError(error, OperationType.GET, 'tasks');
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const updateLocalTasks = (updater: (prev: Task[]) => Task[]) => {
    setTasksState((prev) => {
      const newTasks = updater(prev);
      newTasks.sort((a, b) => {
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
      localStorage.setItem("@app_tasks_cache", JSON.stringify(newTasks));
      setTimeout(() => {
        taskEventTarget.dispatchEvent(new CustomEvent('tasksUpdated', { detail: newTasks }));
      }, 0);
      return newTasks;
    });
  };

  const setTasks = (newTasks: Task[]) => {
    if (!user) return; // Do not save if not logged in
    updateLocalTasks(() => newTasks);
  };

  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    if (!user) return; // Do not save if not logged in
    const taskId = Date.now().toString() + "_" + Math.random().toString(36).substring(2, 7);
    const newTask = { ...task, id: taskId, completed: false, createdAt: new Date().toISOString() } as Task;
    
    // optimistic update
    updateLocalTasks((prev) => [newTask, ...prev]);
    
    try {
        let finalImages = task.images || [];

        const docData: Record<string, any> = {
            ...task,
            id: taskId,
            images: finalImages,
            ownerId: user.uid,
            completed: false
        };
        const removeUndefined = (obj: any) => {
            const newObj: any = {};
            Object.keys(obj).forEach(key => {
                if (obj[key] !== undefined) {
                    newObj[key] = obj[key];
                }
            });
            return newObj;
        };
        const finalDocData = removeUndefined(docData);
        finalDocData.createdAt = serverTimestamp();
        await setDoc(doc(db, 'tasks', taskId), finalDocData);
    } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `tasks/${taskId}`);
    }
  };
  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;
    
    let oldImages: string[] = [];
    
    // optimistic update
    updateLocalTasks((prev) => {
        const t = prev.find(t => t.id === id);
        if (t && t.images) {
            oldImages = [...t.images];
        }
        return prev.map(t => t.id === id ? { ...t, ...updates } : t);
    });
    
    try {
        let finalUpdates = { ...updates, ownerId: user.uid };
        const removeUndefined = (obj: any) => {
            const newObj: any = {};
            Object.keys(obj).forEach(key => {
                if (obj[key] !== undefined) {
                    newObj[key] = obj[key];
                }
            });
            return newObj;
        };
        finalUpdates = removeUndefined(finalUpdates);
        // Keep images as base64 in Firestore directly
        // finalUpdates.images remains unchanged

        await setDoc(doc(db, 'tasks', id), finalUpdates, { merge: true });
    } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `tasks/${id}`);
    }
  };
  const deleteTask = async (id: string) => {
    if (!user) return;
    
    let oldImages: string[] = [];
    // optimistic update
    updateLocalTasks((prev) => {
        const t = prev.find(t => t.id === id);
        if (t && t.images) {
            oldImages = [...t.images];
        }
        return prev.filter(t => t.id !== id);
    });
        
    try {
        // delete associated images from storage
        for (const img of oldImages) {
            if (img.startsWith('http')) {
                try {
                    await deleteObject(ref(storage, img));
                } catch(e) { 
                    console.error("Failed to delete image on task deletion:", e);
                }
            }
        }
        await deleteDoc(doc(db, 'tasks', id));
    } catch(err) {
        handleFirestoreError(err, OperationType.DELETE, `tasks/${id}`);
    }
  }
  return { tasks, setTasks, addTask, updateTask, deleteTask, isLoading };
}
