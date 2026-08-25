import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  Search, Plus, X, Trash2, Edit2, NotepadText, FileText, Send, Save, ChevronDown,
  CaseSensitive, Palette, 
  AlignLeft, AlignRight, List, ListOrdered, ChevronLeft, ChevronRight, MoreVertical, Loader2
} from "lucide-react";
import { useNotes, Note } from "../hooks/useNotes";

interface ScreenNotesProps {
  onNavigate?: (tab: 'roadmap' | 'home' | 'ai' | 'profile' | 'goals' | 'notifications' | 'notes') => void;
}

const SlideToSubmit = ({ 
  onTrigger, 
  disabled, 
  text 
}: { 
  onTrigger: () => void; 
  disabled: boolean; 
  text: string;
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onTrigger();
      }}
      disabled={disabled}
      className={`w-full h-14 mt-2 rounded-[10px] flex items-center justify-center gap-2 bg-[#ff3838] text-white font-semibold text-[16px] tracking-wide transition-all duration-200 active:scale-[0.98] hover:bg-[#e03030] select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {disabled ? (
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      ) : (
        <>
          <Send className="w-5 h-5 text-white" />
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

const formatNoteDate = (isoString: string) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const monthNames = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day} de ${month} de ${year} as ${hours}:${minutes}`;
};

const handleCopyNote = (content: string) => {
  try {
    const tempEl = document.createElement("div");
    tempEl.innerHTML = content || "";
    const plainText = tempEl.innerText || tempEl.textContent || "";
    navigator.clipboard.writeText(plainText.trim() || content);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

const isNoteContentLong = (content: string) => {
  if (!content) return false;
  const tempEl = document.createElement("div");
  tempEl.innerHTML = content;
  const plainText = (tempEl.innerText || tempEl.textContent || "").trim();
  const breakCount = (content.match(/<br|<p|<li/gi) || []).length;
  return plainText.length >= 240 || breakCount >= 5;
};

export function ScreenNotes({ onNavigate }: ScreenNotesProps) {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  
  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state (Add / Edit Note)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [initialNoteTitle, setInitialNoteTitle] = useState("");
  const [initialNoteContent, setInitialNoteContent] = useState("");
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Floating menu & Full View sheet states
  const [openMenuNoteId, setOpenMenuNoteId] = useState<string | null>(null);
  const [selectedViewNote, setSelectedViewNote] = useState<Note | null>(null);
  const [copyingNoteId, setCopyingNoteId] = useState<string | null>(null);
  const [deletingMenuNoteId, setDeletingMenuNoteId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        // If the visual viewport is significantly smaller than the window height, assume keyboard is open.
        setIsKeyboardOpen(window.visualViewport.height < window.innerHeight - 150);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      handleResize(); // Initial check
      return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }
  }, []);

  // Rich Text Editor states
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [activePopup, setActivePopup] = useState<'case' | 'size' | 'color' | 'align' | 'list' | null>(null);
  const [fontSizePx, setFontSizePx] = useState<number>(11);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    strikeThrough: false,
    underline: false,
    alignLeft: false,
    alignRight: false,
    orderedList: false,
    unorderedList: false,
  });

  const customColors = [
    { name: 'Branco', hex: '#ffffff' },
    { name: 'Vermelho', hex: '#ff3838' },
    { name: 'Laranja', hex: '#ff9500' },
    { name: 'Amarelo', hex: '#ffcc00' },
    { name: 'Verde', hex: '#34c759' },
    { name: 'Menta', hex: '#2dd4bf' },
    { name: 'Ciano', hex: '#32ade6' },
    { name: 'Azul', hex: '#007aff' },
    { name: 'Índigo', hex: '#5856d6' },
    { name: 'Roxo', hex: '#af52de' },
    { name: 'Lavanda', hex: '#c084fc' },
    { name: 'Rosa', hex: '#ff2d55' },
    { name: 'Coral', hex: '#ff6b6b' },
    { name: 'Dourado', hex: '#f59e0b' },
    { name: 'Lima', hex: '#a3e635' },
    { name: 'Cinza', hex: '#a2a2a7' },
  ];

  // Delete confirm modal state
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const updateActiveFormats = () => {
    if (!editorRef.current) return;
    try {
      const sel = window.getSelection();
      const hasTextSelected = !!(
        sel && 
        sel.rangeCount > 0 && 
        !sel.isCollapsed && 
        sel.toString().trim() !== '' &&
        editorRef.current.contains(sel.anchorNode)
      );

      if (hasTextSelected) {
        setActiveFormats({
          bold: document.queryCommandState('bold'),
          italic: document.queryCommandState('italic'),
          strikeThrough: document.queryCommandState('strikeThrough'),
          underline: document.queryCommandState('underline'),
          alignLeft: false,
          alignRight: false,
          orderedList: false,
          unorderedList: false,
        });
      } else {
        setActiveFormats({
          bold: false,
          italic: false,
          strikeThrough: false,
          underline: false,
          alignLeft: false,
          alignRight: false,
          orderedList: false,
          unorderedList: false,
        });
      }
    } catch {
      // safe fallback
    }
  };

  // Selection change listener for real-time format indicator updates
  useEffect(() => {
    const handleSelectionChange = () => {
      if (editorRef.current && document.activeElement && editorRef.current.contains(document.activeElement)) {
        updateActiveFormats();
        saveSelection();
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Sync editor content when modal opens
  useEffect(() => {
    if (isNoteModalOpen) {
      setActivePopup(null);
      
      // Attempt to force the browser to use inline styles instead of semantic tags
      // This prevents Tailwind CSS resets from breaking the formatting on some devices
      try {
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand('defaultParagraphSeparator', false, 'div');
      } catch (e) {
        // Safe fallback for browsers that don't support these commands
      }

      const timer = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = noteContent || "";
          updateActiveFormats();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isNoteModalOpen]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current && editorRef.current) {
      const sel = window.getSelection();
      if (sel) {
        if (sel.rangeCount > 0 && editorRef.current.contains(sel.getRangeAt(0).commonAncestorContainer)) {
          return; // Selection is already within the editor, leave it alone to preserve pending formatting
        }
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    } else if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const textOnly = editorRef.current.innerText.trim();
      if (!textOnly && (html === '<br>' || html === '<div><br></div>')) {
        setNoteContent('');
      } else {
        setNoteContent(html);
      }
    }
    updateActiveFormats();
  };

  const trimRangeWhitespace = (range: Range): Range => {
    try {
      const selText = range.toString();
      if (!selText) return range;

      const startNode = range.startContainer;
      const endNode = range.endContainer;

      if (startNode === endNode && startNode.nodeType === Node.TEXT_NODE) {
        const text = startNode.nodeValue || '';
        const sub = text.substring(range.startOffset, range.endOffset);
        const startMatch = sub.search(/\S/);
        const lastMatch = sub.search(/\S\s*$/);
        if (startMatch !== -1 && lastMatch !== -1) {
          const newRange = document.createRange();
          newRange.setStart(startNode, range.startOffset + startMatch);
          newRange.setEnd(startNode, range.startOffset + lastMatch + 1);
          return newRange;
        }
      }
    } catch {
      // fallback
    }
    return range;
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    restoreSelection();

    if (['bold', 'italic', 'strikeThrough', 'underline'].includes(command)) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const selectedText = range.toString();
        // Ignore if selection is strictly whitespace
        if (selectedText.length > 0 && selectedText.trim() === '') {
          return;
        }
        // Trim leading and trailing whitespace from selection
        if (selectedText.length > 0 && selectedText.trim() !== '') {
          const trimmedRange = trimRangeWhitespace(range);
          sel.removeAllRanges();
          sel.addRange(trimmedRange);
        }
      }
    }

    document.execCommand(command, false, value);
    handleEditorInput();
    updateActiveFormats();
  };

  const transformTextCase = (mode: 'upper' | 'lower' | 'capitalize') => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      setActivePopup(null);
      return;
    }

    // If selection is collapsed, select current word
    if (sel.isCollapsed) {
      sel.modify('move', 'backward', 'word');
      sel.modify('extend', 'forward', 'word');
    }

    const range = sel.getRangeAt(0);
    const text = range.toString();
    if (!text || text.trim() === '') {
      setActivePopup(null);
      return;
    }

    let transformed = text;
    if (mode === 'upper') {
      transformed = text.toUpperCase();
    } else if (mode === 'lower') {
      transformed = text.toLowerCase();
    } else if (mode === 'capitalize') {
      transformed = text.toLowerCase().replace(/(?:^|\s|\b)\w/g, (c) => c.toUpperCase());
    }
    range.deleteContents();
    const node = document.createTextNode(transformed);
    range.insertNode(node);
    const newRange = document.createRange();
    newRange.selectNodeContents(node);
    sel.removeAllRanges();
    sel.addRange(newRange);
    savedRangeRef.current = newRange;

    handleEditorInput();
    updateActiveFormats();
    setActivePopup(null);
  };

  const applyFontSize = (size: number) => {
    if (size < 11 || size > 18 || size === fontSizePx) return;
    setFontSizePx(size);
    restoreSelection();
    
    try {
      document.execCommand('styleWithCSS', false, 'false');
    } catch(e) {}
    
    document.execCommand('fontSize', false, '7');
    
    try {
      document.execCommand('styleWithCSS', false, 'true');
    } catch(e) {}
    
    // Exact standard document pt-to-px scale (1pt = 1.3333px, matching Google Docs 11pt = 14.67px, 12pt = 16px, 18pt = 24px)
    const targetPx = (size * 4 / 3).toFixed(2);

    if (editorRef.current) {
      const fonts = editorRef.current.querySelectorAll('font[size="7"]');
      fonts.forEach(font => {
        font.removeAttribute('size');
        font.style.fontSize = `${targetPx}px`;
        // Ensure the font tag inherits the editor's leading-relaxed line height
        // to prevent the text from shifting vertically
        font.style.lineHeight = 'inherit';
      });
    }
    handleEditorInput();
    updateActiveFormats();
  };

  const applyTextColor = (colorHex: string) => {
    restoreSelection();
    document.execCommand('foreColor', false, colorHex);
    handleEditorInput();
    updateActiveFormats();
    setActivePopup(null);
  };

  const resetNoteModalState = () => {
    setIsNoteModalOpen(false);
    setIsDiscardModalOpen(false);
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setInitialNoteTitle("");
    setInitialNoteContent("");
  };

  const handleOpenAddModal = () => {
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setInitialNoteTitle("");
    setInitialNoteContent("");
    setIsDiscardModalOpen(false);
    setIsNoteModalOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setInitialNoteTitle(note.title);
    setInitialNoteContent(note.content);
    setIsDiscardModalOpen(false);
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    if (isDiscardModalOpen || !isNoteModalOpen || isSaving) return;

    const clean = (str: string) => {
      let t = str.trim();
      if (t === '<br>' || t === '<div><br></div>' || t === '<p><br></p>') return '';
      return t;
    };

    const isTitleChanged = noteTitle.trim() !== initialNoteTitle.trim();
    const isContentChanged = clean(noteContent) !== clean(initialNoteContent);

    if (isTitleChanged || isContentChanged) {
      setIsDiscardModalOpen(true);
    } else {
      resetNoteModalState();
    }
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim() || isSaving) return;

    setIsSaving(true);
    try {
      if (editingNote) {
        await updateNote(editingNote.id, {
          title: noteTitle.trim(),
          content: noteContent.trim(),
        });
      } else {
        await addNote(noteTitle.trim(), noteContent.trim());
      }
      resetNoteModalState();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingNoteId) {
      const idToDelete = deletingNoteId;
      setDeletingNoteId(null);
      if (selectedViewNote?.id === idToDelete) {
        setSelectedViewNote(null);
      }
      await deleteNote(idToDelete);
    }
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full h-full bg-[#1f1f1f] text-white flex flex-col relative overflow-hidden font-sans select-none">
      {/* Header */}
      <div
        className="w-full pt-4 px-4 pb-4 flex items-center justify-between z-30 shrink-0 h-[74px] relative bg-[#1f1f1f] border-b border-white/5"
        style={{ backgroundColor: "#1f1f1f" }}
      >
        <div
          className={`flex items-center gap-3 transition-opacity ${
            isSearchOpen
              ? "opacity-0 pointer-events-none duration-150 ease-out"
              : "opacity-100 pointer-events-auto duration-300 ease-in"
          }`}
        >
          <h1 className="text-white text-[20px] font-bold leading-tight tracking-tight">
            Anotações
          </h1>
        </div>

        {/* Right elements container (Search) */}
        <div className="flex items-center justify-end absolute right-4 top-4 h-[42px]">
          {/* Custom Search Component */}
          <div 
            className={`relative flex items-center rounded-full h-[42px] overflow-hidden group z-10 ${
              isSearchOpen 
                ? 'w-[calc(100vw-32px)] bg-[#1f1f1f] border border-[#4f4f4f]' 
                : 'w-[42px] bg-transparent border border-transparent mr-0'
            }`}
            style={{
              transition: 'width 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s ease, box-shadow 0.5s ease, background-color 0.3s ease, border-color 0.3s ease, margin-right 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Search Button (Left) */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (!isSearchOpen) {
                  setIsSearchOpen(true);
                  setTimeout(() => document.getElementById('notes-search-input')?.focus(), 100);
                } else {
                  document.getElementById('notes-search-input')?.focus();
                }
              }}
              className="absolute left-0 w-[42px] h-[42px] flex items-center justify-center text-[#aaaaaa] outline-none focus:ring-0 focus:border-transparent z-20 transition-transform duration-300 active:scale-90 pointer-events-auto"
            >
              <Search className="w-[22px] h-[22px] text-[#aaaaaa]" />
            </button>

            {/* Input Field */}
            <input 
              id="notes-search-input"
              type="text" 
              placeholder="Buscar anotações" 
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }
              }}
              className={`absolute left-[42px] right-[42px] h-full bg-transparent outline-none focus:ring-0 focus:border-transparent text-[#aaaaaa] text-[15px] font-medium placeholder-[#aaaaaa]/50 ${isSearchOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4 pointer-events-none'}`}
              style={{
                 transition: isSearchOpen ? 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)' : 'all 0.15s ease-out'
              }}
            />

            {/* Close Button (Right) */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className={`absolute right-0 w-[42px] h-[42px] flex items-center justify-center text-[#aaaaaa] outline-none focus:ring-0 focus:border-transparent z-20 transition-all duration-300 active:scale-90 ${
                isSearchOpen 
                  ? 'opacity-100 pointer-events-auto rotate-0' 
                  : 'opacity-0 pointer-events-none rotate-90'
              }`}
            >
              <X className="w-5 h-5 text-[#aaaaaa]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-8 px-4 pb-44 flex flex-col space-y-3">
        {filteredNotes.length === 0 && isSearchOpen && (
          <div className="text-center text-[13px] font-medium text-[#73777d] py-10 px-6 mt-[70px]">
            Nenhuma anotação encontrada.
          </div>
        )}
        {filteredNotes.length === 0 && !isSearchOpen && (
          <div className="text-center text-[14px] font-medium text-[#73777d] py-10 px-6 mt-[70px]">
            Não há nenhuma anotação adicionada.
          </div>
        )}
        {filteredNotes.length > 0 &&
          filteredNotes.map((note) => {
            return (
              <div
                key={note.id}
                onClick={() => setSelectedViewNote(note)}
                className="w-full bg-[#282828] hover:bg-[#343434] transition-colors rounded-[7px] px-4 py-3.5 relative border border-transparent hover:border-[#4f4f4f]/40 group mb-2.5 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5 relative">
                  <h3 className="text-white font-bold text-[17px] leading-snug break-words flex-1 min-w-0">
                    {note.title || "Sem título"}
                  </h3>

                  {/* 3-Dots Menu Button */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuNoteId(openMenuNoteId === note.id ? null : note.id);
                      }}
                      className="w-7 h-7 -mr-1.5 rounded-full flex items-center justify-center text-[#cfcfcf] hover:text-white hover:bg-white/10 transition cursor-pointer"
                      title="Opções"
                    >
                      <MoreVertical className="w-[18px] h-[18px] text-[#cfcfcf]" />
                    </button>

                    {/* Floating Menu Popup */}
                    <AnimatePresence>
                      {openMenuNoteId === note.id && (
                        <>
                          {/* Invisible Backdrop to close popup on outside click */}
                          <div
                            className="fixed inset-0 z-40 cursor-default"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuNoteId(null);
                            }}
                          />
                          <motion.div
                            key={`note-menu-${note.id}`}
                            initial={{ opacity: 0, scale: 0.92, y: -6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: -6 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-9 bg-[#282828] border border-[#4f4f4f] rounded-[16px] p-1.5 z-50 flex flex-col min-w-[160px]"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateNote(note.id, { isPinned: !note.isPinned });
                                setOpenMenuNoteId(null);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer"
                            >
                              {note.isPinned ? "Desfixar anotação" : "Fixar anotação"}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditModal(note);
                                setOpenMenuNoteId(null);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              disabled={copyingNoteId === note.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyNote(note.content);
                                setCopyingNoteId(note.id);
                                setTimeout(() => {
                                  setCopyingNoteId(null);
                                }, 2000);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer flex items-center justify-start min-h-[36px]"
                            >
                              {copyingNoteId === note.id ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                                </div>
                              ) : (
                                "Copiar anotação"
                              )}
                            </button>
                            <button
                              type="button"
                              disabled={deletingMenuNoteId === note.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (deletingMenuNoteId === note.id) return;
                                setDeletingMenuNoteId(note.id);
                                setTimeout(async () => {
                                  const noteIdToDelete = note.id;
                                  if (selectedViewNote?.id === noteIdToDelete) {
                                    setSelectedViewNote(null);
                                  }
                                  await deleteNote(noteIdToDelete);
                                  setDeletingMenuNoteId(null);
                                  setOpenMenuNoteId(null);
                                }, 2000);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer flex items-center justify-start min-h-[36px]"
                            >
                              {deletingMenuNoteId === note.id ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                                </div>
                              ) : (
                                "Excluir"
                              )}
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {note.content && (
                  <div className="mb-1.5">
                    <div 
                      className="text-[#cfcfcf] text-[14px] leading-relaxed line-clamp-5 break-words [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_s]:line-through [&_strike]:line-through"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-[#808080] font-medium">
                  <span>{formatNoteDate(note.updatedAt)}</span>
                  {note.isPinned && <span>Fixada</span>}
                </div>
              </div>
            );
          })}
      </div>

      {/* Floating Action Button (+) */}
      <AnimatePresence initial={false}>
        {!isNoteModalOpen && (
          <motion.button
            key="add-note-fab"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAddModal}
            className="absolute bottom-[104px] right-6 w-14 h-14 rounded-[13px] bg-[#ff3838] flex items-center justify-center z-40"
          >
            <Plus className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="absolute -bottom-[2px] left-0 right-0 h-[90px] pb-[2px] bg-[#313131] rounded-t-[35px] px-6 flex justify-between items-center z-50">
        <button
          onClick={() => onNavigate?.("home")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] hover:opacity-80 transition"
        >
          <img
            src="https://i.ibb.co/JNnKTWq/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-170502-0000.png"
            alt="Início"
            className="w-[26px] h-[26px] object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] font-bold text-[#aaaaaa] text-center leading-none mt-0.5">
            Início
          </span>
        </button>

        <button
          onClick={() => onNavigate?.("roadmap")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] hover:opacity-80 transition"
        >
          <img
            src="https://i.ibb.co/FqbdJ8MT/Picsart-26-07-22-22-47-11-226.png"
            alt="Tarefas"
            className="w-[28px] h-[28px] object-contain translate-y-[1px]"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] font-bold text-[#aaaaaa] text-center leading-none mt-0.5">
            Tarefas
          </span>
        </button>

        <button
          onClick={() => onNavigate?.("goals")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] hover:opacity-80 transition"
        >
          <img
            src="https://i.ibb.co/B2YpNgVD/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-165417-0000.png"
            alt="Objetivos"
            className="w-[26px] h-[26px] object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] font-bold text-[#aaaaaa] text-center leading-none mt-0.5">
            Objetivos
          </span>
        </button>

        <button
          onClick={() => onNavigate?.("notes")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px]"
        >
          <div className="relative w-[27px] h-[27px]">
            <img src="https://i.ibb.co/v4fChL23/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260812-130637-0000.png" alt="Anotações" className="absolute inset-0 w-full h-full object-contain" referrerPolicy="no-referrer" />
            <img src="https://i.ibb.co/ZpzY7Hxs/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260812-130517-0000.png" alt="Anotações Ativo" className="absolute inset-0 w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <span className="text-[10px] font-bold text-[#aaaaaa] text-center leading-none mt-0.5">
            Anotações
          </span>
        </button>

        <button
          onClick={() => onNavigate?.("profile")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] hover:opacity-80 transition"
        >
          <img
            src="https://i.ibb.co/bg19xYN8/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-212607-0000.png"
            alt="Seu perfil"
            className="w-[25px] h-[25px] object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] font-bold text-[#aaaaaa] text-center leading-none mt-0.5">
            Seu perfil
          </span>
        </button>
      </div>

      {/* Add / Edit Note Modal Sheet */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <motion.div
            key="noteModalOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 bg-black/80 z-[100] flex flex-col justify-end overflow-hidden font-sans ${isDiscardModalOpen ? 'pointer-events-none' : ''}`}
            onClick={() => handleCloseNoteModal()}
          >
            <motion.div
              key="noteModalSheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
              transition={{ type: "spring", damping: 24, stiffness: 200 }}
              className="bg-[#1f1f1f] w-full max-h-[90vh] rounded-t-[40px] p-6 flex flex-col gap-4 relative z-40 border-t border-[#4f4f4f] -mb-[100px] pb-[140px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Extra background block to prevent detachment during spring bounce */}
              <div className="absolute top-[98%] left-0 right-0 h-[100px] bg-[#1f1f1f] pointer-events-none" />

              {/* Modal Top Header Bar */}
              <div className="flex items-center justify-between w-full pb-4 border-b border-[#343434]/50">
                {/* Save button on Top Left */}
                <div className="min-h-[32px] flex items-center">
                  {noteTitle.trim() !== '' && noteContent.trim() !== '' && noteContent !== '<br>' && noteContent !== '<div><br></div>' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveNote();
                      }}
                      disabled={isSaving}
                      className={`h-8 px-3.5 bg-[#2c2c2c] hover:bg-[#3c3c3c] text-gray-400 hover:text-white font-bold text-[13px] rounded-full flex items-center justify-center gap-1.5 transition-colors transition-transform active:scale-95 select-none group ${isSaving ? 'cursor-default min-w-[76px] opacity-50' : 'cursor-pointer'}`}
                    >
                      {isSaving ? (
                        <Loader2 className="w-[18px] h-[18px] text-white animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                          <span>Salvar</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Close Button (Down Arrow) on Top Right */}
                <button
                  type="button"
                  onClick={() => handleCloseNoteModal()}
                  className="w-8 h-8 rounded-full bg-[#2c2c2c] hover:bg-[#3c3c3c] flex items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                  title="Fechar"
                >
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex flex-col gap-4 pb-0 no-scrollbar w-full overflow-y-auto">
                {/* Note Title Input */}
                <input
                  type="text"
                  maxLength={40}
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value.slice(0, 40))}
                  placeholder="Qual é o título da sua anotação? max: 40 caracteres"
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 py-4 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d]"
                />

                {/* Note Rich Text Block */}
                <div className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[10px] overflow-hidden flex flex-col transition-all relative">
                  {/* EDITABLE CONTENT AREA */}
                  <div 
                    className="relative w-full min-h-[180px] max-h-[260px] overflow-y-auto p-4 text-[#e8e8e9] outline-none"
                    style={{ fontSize: '14.67px' }}
                    onClick={() => editorRef.current?.focus()}
                  >
                    {(!noteContent || noteContent.trim() === '' || noteContent === '<br>' || noteContent === '<div><br></div>') && (
                      <div className="absolute top-4 left-4 text-[#73777d] pointer-events-none select-none" style={{ fontSize: '14.67px' }}>
                        Escreva sua anotação aqui...
                      </div>
                    )}
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleEditorInput}
                      onKeyDown={(e) => {
                        if (e.key === ' ') {
                          const sel = window.getSelection();
                          if (sel && sel.rangeCount > 0 && sel.isCollapsed) {
                            const range = sel.getRangeAt(0);
                            let node: Node | null = range.startContainer;
                            if (node.nodeType === Node.TEXT_NODE) {
                              node = node.parentNode;
                            }
                            const fmtTags = ['B', 'I', 'U', 'S', 'STRONG', 'EM', 'STRIKE'];
                            let fmtElement: HTMLElement | null = null;
                            let curr = node as HTMLElement | null;
                            while (curr && curr !== editorRef.current) {
                              if (curr.tagName && fmtTags.includes(curr.tagName.toUpperCase())) {
                                fmtElement = curr;
                                break;
                              }
                              curr = curr.parentElement;
                            }

                            if (fmtElement && editorRef.current) {
                              if (range.startOffset >= (range.startContainer.nodeValue?.length || 0)) {
                                e.preventDefault();
                                const spaceNode = document.createTextNode('\u00A0');
                                if (fmtElement.nextSibling) {
                                  fmtElement.parentNode?.insertBefore(spaceNode, fmtElement.nextSibling);
                                } else {
                                  fmtElement.parentNode?.appendChild(spaceNode);
                                }
                                const newRange = document.createRange();
                                newRange.setStartAfter(spaceNode);
                                newRange.collapse(true);
                                sel.removeAllRanges();
                                sel.addRange(newRange);
                                handleEditorInput();
                              }
                            }
                          }
                        }
                      }}
                      onKeyUp={updateActiveFormats}
                      onMouseUp={updateActiveFormats}
                      onTouchEnd={updateActiveFormats}
                      style={{ fontSize: '14.67px' }}
                      className="outline-none min-h-[220px] leading-relaxed text-[#e8e8e9] [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:my-1.5 [&_li]:pl-1 [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_s]:line-through [&_strike]:line-through"
                    />
                  </div>

                  {/* BOTTOM TOOLBAR */}
                  <div className="bg-[#242424] px-6 py-2.5 border-t border-[#3a3a3a] flex items-center justify-between w-full text-[#e8e8e9] shrink-0 relative select-none">
                    <button
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        executeCommand('bold');
                      }}
                      className={`w-8 h-8 rounded-md font-extrabold text-[14px] flex items-center justify-center shrink-0 transition active:scale-95 cursor-pointer ${
                        activeFormats.bold
                          ? 'bg-[#ff3838] text-white'
                          : 'text-[#e8e8e9] hover:bg-[#343434] hover:text-white'
                      }`}
                      title="Negrito"
                    >
                      N
                    </button>
                    <button
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        executeCommand('italic');
                      }}
                      className={`w-8 h-8 rounded-md italic font-serif font-bold text-[15px] flex items-center justify-center shrink-0 transition active:scale-95 cursor-pointer ${
                        activeFormats.italic
                          ? 'bg-[#ff3838] text-white'
                          : 'text-[#e8e8e9] hover:bg-[#343434] hover:text-white'
                      }`}
                      title="Itálico"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        executeCommand('strikeThrough');
                      }}
                      className={`w-8 h-8 rounded-md font-bold text-[14px] flex items-center justify-center shrink-0 transition active:scale-95 cursor-pointer ${
                        activeFormats.strikeThrough
                          ? 'bg-[#ff3838] text-white'
                          : 'text-[#e8e8e9] hover:bg-[#343434] hover:text-white'
                      }`}
                      title="Tachado"
                    >
                      T
                    </button>
                    <button
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        executeCommand('underline');
                      }}
                      className={`w-8 h-8 rounded-md underline underline-offset-2 font-bold text-[14px] flex items-center justify-center shrink-0 transition active:scale-95 cursor-pointer ${
                        activeFormats.underline
                          ? 'bg-[#ff3838] text-white'
                          : 'text-[#e8e8e9] hover:bg-[#343434] hover:text-white'
                      }`}
                      title="Sublinhado"
                    >
                      U
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discard Note Changes Confirmation Modal */}
      <AnimatePresence>
        {isDiscardModalOpen && (
          <motion.div
            key="discardNoteModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 z-[120] flex items-center justify-center px-6"
            onClick={(e) => {
              e.stopPropagation();
              setIsDiscardModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1f1f1f] w-full max-w-[340px] rounded-[14px] p-6"
            >
              <h3 className="text-white text-[18px] font-bold mb-0 text-center">Descartar alterações?</h3>
              <p className="text-[#aaaaaa] text-sm text-center mb-6 leading-snug mt-[-2px]">
                Todas as alterações serão perdidas.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDiscardModalOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-[14px] text-white text-[14px] font-semibold bg-[#2c2c2c] hover:bg-[#333333] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetNoteModalState();
                  }}
                  className="flex-1 py-2.5 rounded-[14px] text-white text-[14px] font-semibold bg-[#ff3838] hover:bg-[#ff5555] transition-colors"
                >
                  Descartar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Note View Sheet */}
      <AnimatePresence>
        {selectedViewNote && (
          <motion.div
            key="viewNoteOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-[100] flex flex-col justify-end overflow-hidden font-sans"
            onClick={() => setSelectedViewNote(null)}
          >
            <motion.div
              key="viewNoteSheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
              transition={{ type: "spring", damping: 24, stiffness: 200 }}
              className="relative w-full z-40"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Extra background block extending down to prevent detachment during spring bounce */}
              <div className="absolute top-[80%] left-0 right-0 h-[400px] bg-[#1f1f1f] pointer-events-none" />

              <div className="bg-[#1f1f1f] w-full h-[660px] max-h-[90vh] rounded-t-[40px] px-6 flex flex-col relative border-t border-[#4f4f4f] overflow-hidden -mb-[100px] pb-[100px]">
                {/* Scrollable Content (Full Note Content, No Truncation) */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 text-[#e8e8e9] text-[15px] leading-relaxed break-words [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_s]:line-through [&_strike]:line-through space-y-2 pt-7 pb-12">
                  <div dangerouslySetInnerHTML={{ __html: selectedViewNote.content }} />
                </div>

                {/* Bottom fade gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1f1f1f] to-transparent pointer-events-none z-20" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingNoteId && (
          <motion.div
            key="deleteModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 z-[120] flex items-center justify-center px-6"
            onClick={() => setDeletingNoteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2c2c2c] w-full max-w-[340px] rounded-[24px] p-6 text-center border border-[#4f4f4f]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-bold text-[18px] mb-2">
                Excluir anotação?
              </h3>
              <p className="text-[#aaaaaa] text-[14px] leading-relaxed mb-6">
                Esta ação não poderá ser desfeita.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingNoteId(null)}
                  className="flex-1 py-3 rounded-[14px] bg-[#3a3a3a] text-white font-semibold text-[14px] hover:bg-[#4a4a4a] transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-3 rounded-[14px] bg-[#ff3838] text-white font-semibold text-[14px] hover:bg-[#ff5555] transition"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
