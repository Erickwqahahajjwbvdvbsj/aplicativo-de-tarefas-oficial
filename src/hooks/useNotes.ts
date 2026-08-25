import { useState, useEffect } from "react";
import { useProfile } from "./useProfile";
import { db, auth } from "../lib/firebase";
import { collection, doc, onSnapshot, setDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firebaseError";

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned?: boolean;
  pinnedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const notesEventTarget = new EventTarget();

export function useNotes() {
  const { user } = useProfile();
  const [notes, setNotesState] = useState<Note[]>(() => {
    const cached = localStorage.getItem("@app_notes_cache");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Error parsing cached notes", e);
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSync = (e: any) => setNotesState(e.detail);
    const handleLoadSync = (e: any) => setIsLoading(e.detail);
    notesEventTarget.addEventListener('notesUpdated', handleSync);
    notesEventTarget.addEventListener('notesLoaded', handleLoadSync);
    return () => {
      notesEventTarget.removeEventListener('notesUpdated', handleSync);
      notesEventTarget.removeEventListener('notesLoaded', handleLoadSync);
    };
  }, []);

  const updateNotesState = (newNotes: Note[]) => {
    const sorted = [...newNotes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.isPinned && b.isPinned) {
        const pinA = new Date(a.pinnedAt || a.updatedAt || a.createdAt || 0).getTime();
        const pinB = new Date(b.pinnedAt || b.updatedAt || b.createdAt || 0).getTime();
        return pinB - pinA;
      }
      const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    });
    setNotesState(sorted);
    localStorage.setItem("@app_notes_cache", JSON.stringify(sorted));
    notesEventTarget.dispatchEvent(new CustomEvent('notesUpdated', { detail: sorted }));
  };

  useEffect(() => {
    if (!user) {
      setNotesState([]);
      setIsLoading(true);
      localStorage.removeItem("@app_notes_cache");
      notesEventTarget.dispatchEvent(new CustomEvent('notesUpdated', { detail: [] }));
      notesEventTarget.dispatchEvent(new CustomEvent('notesLoaded', { detail: true }));
      return;
    }

    try {
      const q = query(collection(db, "notes"), where("ownerId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedNotes: Note[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const createdAtStr = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString());
          const updatedAtStr = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString());
          const pinnedAtStr = data.pinnedAt?.toDate
            ? data.pinnedAt.toDate().toISOString()
            : (typeof data.pinnedAt === 'string'
                ? data.pinnedAt
                : (data.isPinned ? (updatedAtStr || createdAtStr) : undefined));
          fetchedNotes.push({
            id: docSnap.id,
            title: data.title || "",
            content: data.content || "",
            isPinned: !!data.isPinned,
            pinnedAt: pinnedAtStr,
            createdAt: createdAtStr,
            updatedAt: updatedAtStr,
          });
        });
        // Sort by isPinned first (newest pinned first), then by createdAt descending
        fetchedNotes.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          if (a.isPinned && b.isPinned) {
            const pinA = new Date(a.pinnedAt || a.updatedAt || a.createdAt || 0).getTime();
            const pinB = new Date(b.pinnedAt || b.updatedAt || b.createdAt || 0).getTime();
            return pinB - pinA;
          }
          const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
          const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
          return timeB - timeA;
        });
        updateNotesState(fetchedNotes);
        setIsLoading(false);
        notesEventTarget.dispatchEvent(new CustomEvent('notesLoaded', { detail: false }));
      }, (error) => {
        setIsLoading(false);
        setTimeout(() => notesEventTarget.dispatchEvent(new CustomEvent('notesLoaded', { detail: false })), 0);
        handleFirestoreError(error, OperationType.GET, "notes");
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up notes listener:", err);
    }
  }, [user?.uid]);

  const addNote = async (title: string, content: string) => {
    const newNoteId = Date.now().toString() + "_" + Math.random().toString(36).substring(2, 7);
    const nowIso = new Date().toISOString();
    const newNote: Note = {
      id: newNoteId,
      title: title.trim() || "Sem título",
      content: content.trim(),
      isPinned: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    const updated = [newNote, ...notes];
    updateNotesState(updated);
    const currentUser = user || auth.currentUser;
    if (currentUser) {
      try {
        const payload = { title: newNote.title, content: newNote.content, isPinned: false, ownerId: currentUser.uid };
        const cleanPayload = JSON.parse(JSON.stringify(payload));
        cleanPayload.createdAt = serverTimestamp();
        cleanPayload.updatedAt = serverTimestamp();
        await setDoc(doc(db, "notes", newNoteId), cleanPayload);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `notes/${newNoteId}`);
      }
    }
    return newNote;
  };

  const updateNote = async (id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'isPinned' | 'pinnedAt'>>) => {
    const isOnlyPinToggle = Object.keys(updates).length === 1 && 'isPinned' in updates;
    const nowIso = new Date().toISOString();
    
    const extraFields: Partial<Note> = {};
    if (updates.isPinned === true) {
      extraFields.pinnedAt = nowIso;
    } else if (updates.isPinned === false) {
      extraFields.pinnedAt = undefined;
    }

    const updated = notes.map((note) => {
      if (note.id === id) {
        const newObj = {
          ...note,
          ...updates,
          ...extraFields,
          updatedAt: isOnlyPinToggle ? note.updatedAt : nowIso,
        };
        if (updates.isPinned === false) {
          delete newObj.pinnedAt;
        }
        return newObj;
      }
      return note;
    });
    updateNotesState(updated);

    const currentUser = user || auth.currentUser;
    if (currentUser) {
      try {
        const payload: any = { ...updates, ownerId: currentUser.uid };
        if (updates.isPinned === true) {
          payload.pinnedAt = nowIso;
        } else if (updates.isPinned === false) {
          payload.pinnedAt = null;
        }
        const cleanPayload = JSON.parse(JSON.stringify(payload));
        if (!isOnlyPinToggle) {
          cleanPayload.updatedAt = serverTimestamp();
        }
        await setDoc(doc(db, "notes", id), cleanPayload, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `notes/${id}`);
      }
    }
  };

  const deleteNote = async (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    updateNotesState(updated);

    const currentUser = user || auth.currentUser;
    if (currentUser) {
      try {
        await deleteDoc(doc(db, "notes", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `notes/${id}`);
      }
    }
  };

  return { notes, addNote, updateNote, deleteNote, isLoading };
}
