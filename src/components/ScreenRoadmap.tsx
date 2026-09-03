import { Crosshair, ArrowLeft, Clock, History, GraduationCap, Search, ChevronRight, ChevronLeft, Target, Timer, ListTodo, Lightbulb, ClipboardList, Calendar, BookOpen, Plus, X, Trash2, Edit2, Check, Copy, Home, CalendarDays, MessageCircle, User, Bell, MapPin, Flag, Tag, Activity, ListChecks, Image as ImageIcon, Trophy, Bot, Goal , Rocket , NotepadText, Sparkles, Send, Filter, MoreVertical, Loader2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScreenTaskHistory } from "./ScreenTaskHistory";
import { useTasks } from "../hooks/useTasks";
import { useProfile } from "../hooks/useProfile";

const AUDIO_URL = "https://files.catbox.moe/jdkqtg.mp3";
let sharedAudioBuffer: AudioBuffer | null = null;
let sharedAudioContext: AudioContext | null = null;

const preloadAudio = async () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    sharedAudioContext = new AudioContextClass();
    
    const response = await fetch(AUDIO_URL);
    const arrayBuffer = await response.arrayBuffer();
    sharedAudioBuffer = await sharedAudioContext.decodeAudioData(arrayBuffer);
  } catch (err) {
    // Failed to preload audio silently
  }
};

preloadAudio();

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

export function ScreenRoadmap({ onBack, onNavigate }: { onBack: () => void, onNavigate?: (tab: 'roadmap' | 'home' | 'ai' | 'profile' | 'goals' | 'notifications' | 'notes') => void }) {
  const playPopSound = () => {
    try {
      if (sharedAudioContext && sharedAudioBuffer) {
        if (sharedAudioContext.state === 'suspended') {
          sharedAudioContext.resume().catch(() => {});
        }
        const source = sharedAudioContext.createBufferSource();
        source.buffer = sharedAudioBuffer;
        
        const gainNode = sharedAudioContext.createGain();
        gainNode.gain.value = 0.7;
        
        source.connect(gainNode);
        gainNode.connect(sharedAudioContext.destination);
        source.start(0);
      } else {
        preloadAudio();
        const audio = new Audio(AUDIO_URL);
        audio.volume = 0.7;
        audio.play().catch(e => {});
      }
    } catch (e) {
      console.error("Audio play error", e);
    }
  };

  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 to 6

  const weekDates = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - currentDayOfWeek + index);
    return date;
  });

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { user } = useProfile();
  const [isAddingTask, setIsAddingTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [isDuplicatingTask, setIsDuplicatingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePriority, setActivePriority] = useState<string | null>(null);
  const [activeEffort, setActiveEffort] = useState<string | null>(null);
  const [activeEndMode, setActiveEndMode] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [isFiltersScreenOpen, setIsFiltersScreenOpen] = useState(false);
  const [isFilterDatePickerOpen, setIsFilterDatePickerOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isEffortDropdownOpen, setIsEffortDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isImageSheetOpen, setIsImageSheetOpen] = useState(false);
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);
  const [endMode, setEndMode] = useState<"end_time" | "duration">("end_time");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [endCurrentMonth, setEndCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [endCurrentYear, setEndCurrentYear] = useState(new Date().getFullYear());
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTask) {
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [selectedTask]);

  useEffect(() => {
    if ((window as any).pendingTaskToOpen) {
      setSelectedTask((window as any).pendingTaskToOpen);
      (window as any).pendingTaskToOpen = null;
    }

    const handleOpenTaskDetails = (e: any) => {
      if (e.detail) {
        setSelectedTask(e.detail);
      }
    };
    window.addEventListener('openTaskDetails', handleOpenTaskDetails);
    return () => window.removeEventListener('openTaskDetails', handleOpenTaskDetails);
  }, []);

  const [fillingTaskIds, setFillingTaskIds] = useState<string[]>([]);
  const [slidingTaskIds, setSlidingTaskIds] = useState<string[]>([]);
  const [collapsingTaskIds, setCollapsingTaskIds] = useState<string[]>([]);

  const defaultTaskState = {
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    endDate: "",
    durationStr: "",
    duration: "",
    priority: "",
    category: "",
    date: "",
    effort: "",
    location: "",
    images: [] as string[],
  };
  const [newTask, setNewTask] = useState(defaultTaskState);
  const [initialTaskState, setInitialTaskState] = useState(defaultTaskState);

  const [fileError, setFileError] = useState<string | null>(null);

  const handleUnifiedFileChange = (e: any) => {
    setFileError(null);
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    files.forEach(file => {
      const isImage = file.type.startsWith('image/');

      if (!isImage) {
        setFileError(`O arquivo "${file.name}" não é um formato de imagem suportado.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // 60% quality jpeg
          
          setNewTask(prev => {
            if (prev.images.length >= 5) {
              setFileError('Você já atingiu o limite máximo de 5 imagens.');
              return prev;
            }
            return {
              ...prev,
              images: [...prev.images, dataUrl]
            };
          });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };

  const removeFile = (index: number) => {
    setFileError(null);
    setNewTask(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetAddingTaskState = () => {
    setIsAddingTask(false);
    setIsDiscardModalOpen(false);
    setEditingTaskId(null);
    setNewTask(defaultTaskState);
    setInitialTaskState(defaultTaskState);
    setIsDatePickerOpen(false); setIsStartPickerOpen(false);
    setIsTimePickerOpen(false);
    setIsEndPickerOpen(false);
    setIsEndDatePickerOpen(false);
    setIsEndTimePickerOpen(false);
    setIsPriorityDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsEffortDropdownOpen(false);
    setIsLocationSheetOpen(false);
    setIsImageSheetOpen(false);
  };

  const handleCloseAddingTask = () => {
    if (isDiscardModalOpen || !isAddingTask || isSaving) return;
    const normalizeTask = (t: any) => ({
      ...t,
      title: t.title.trim(),
      description: t.description.trim(),
      location: t.location.trim(),
      priority: t.priority === "Nenhum" ? "" : t.priority,
      category: t.category === "Nenhum" ? "" : t.category,
      effort: t.effort === "Nenhum" ? "" : t.effort,
    });

    const isDifferent = JSON.stringify(normalizeTask(newTask)) !== JSON.stringify(normalizeTask(initialTaskState));
                    
    if (isDifferent) {
      setIsDiscardModalOpen(true);
    } else {
      resetAddingTaskState();
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    setIsSaving(true);
    try {
      let style = "light";
      let parsedDuration = 0;
      if (endMode === "duration" && newTask.duration) { 
         parsedDuration = parseInt(newTask.duration) || 0;
      }
      if (editingTaskId) {
        await updateTask(editingTaskId, {
          title: newTask.title,
          description: newTask.description,
          startTime: newTask.startTime || "",
          endTime: newTask.endTime || "",
          endDate: newTask.endDate || "",
          durationStr: newTask.durationStr || "",
          duration: parsedDuration,
          style,
          priority: newTask.priority as any,
          category: newTask.category || "",
          date: newTask.date,
          effort: newTask.effort || "",
          location: newTask.location,
          images: newTask.images,
        });
      } else {
        await addTask({
          title: newTask.title,
          description: newTask.description,
          startTime: newTask.startTime || "",
          endTime: newTask.endTime || "",
          endDate: newTask.endDate || "",
          durationStr: newTask.durationStr || "",
          duration: parsedDuration,
          style,
          priority: newTask.priority as any,
          category: newTask.category || "",
          date: newTask.date,
          effort: newTask.effort || "",
          location: newTask.location,
          images: newTask.images,
        });
      }
      resetAddingTaskState();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateEndTime = (start: string, durationMin: number, endTime?: string) => {
    if (endTime) return endTime;
    if (!start) return "";
    try {
      const [hours, minutes] = start.split(":").map(Number);
      const date = new Date(2000, 0, 1, hours, minutes + (durationMin || 0));
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    } catch (e) {
      return "";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (task.completed) return false;
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (activeCategory && (!task.category || task.category.trim().toLowerCase() !== activeCategory.trim().toLowerCase())) return false;
    if (activePriority) {
      const tp = task.priority ? task.priority.trim().toLowerCase() : '';
      const ap = activePriority.trim().toLowerCase();
      const match = tp === ap || 
        (activePriority === 'Alta' && tp === 'high') || 
        (activePriority === 'Média' && (tp === 'medium' || tp === 'media')) || 
        (activePriority === 'Baixa' && tp === 'low');
      if (!match) return false;
    }
    if (activeEffort) {
      const te = task.effort ? task.effort.trim().toLowerCase() : '';
      const match = te === activeEffort.trim().toLowerCase() ||
        (activeEffort === 'Baixa' && (te === 'baixo' || te === 'low')) ||
        (activeEffort === 'Média' && (te === 'médio' || te === 'medio' || te === 'medium')) ||
        (activeEffort === 'Alta' && (te === 'alto' || te === 'high'));
      if (!match) return false;
    }
    const hasDeadline = !!(task.date && task.date.trim());
    if (activeEndMode === "Com prazo final" && !hasDeadline) return false;
    if (activeEndMode === "Sem prazo final" && hasDeadline) return false;
    if (activeDate && task.date !== activeDate) return false;
    return true;
  });

  return (
    <div className="w-full h-full bg-[#1f1f1f] relative font-sans overflow-hidden flex flex-col">
      <div className="flex-1 w-full flex flex-col relative z-0 min-h-0">
        {/* Header */}
        <div className="w-full pt-4 px-4 pb-4 flex items-center justify-between z-30 shrink-0 h-[74px] relative bg-[#1f1f1f] border-b border-white/5" style={{ backgroundColor: '#1f1f1f' }}>
          {/* Default state elements (Title) */}
          <div className={`flex items-center gap-3 transition-opacity ${isSearchOpen ? 'opacity-0 pointer-events-none duration-150 ease-out' : 'opacity-100 pointer-events-auto duration-300 ease-in'}`}>
            <h1 className="text-white text-[20px] font-bold leading-tight tracking-tight ">
              Entrada de Tarefas
            </h1>
          </div>

          {/* Right elements container (Search + AI + More Options) */}
          <div className="flex items-center justify-end absolute right-4 top-4 h-[42px]">
            
            {/* More Options Button (Three dots) & Dropdown Popover */}
            <div className={`absolute right-0 transition-opacity ${isSearchOpen ? 'opacity-0 pointer-events-none duration-150 ease-out' : 'opacity-100 pointer-events-auto duration-300 ease-in'}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMoreMenuOpen(!isMoreMenuOpen);
                }}
                className="w-[42px] h-[42px] shrink-0 rounded-full flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all bg-transparent text-[#aaaaaa]"
                title="Mais opções"
              >
                <MoreVertical className="w-[25px] h-[25px]" />
              </button>

              {/* Popover Janelinha */}
              <AnimatePresence>
                {isMoreMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMoreMenuOpen(false);
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -5 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-2 top-[46px] bg-[#282828] border border-[#4f4f4f] rounded-[12px] py-[3px] px-1 flex items-center gap-1 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Filter Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMoreMenuOpen(false);
                          setIsFiltersScreenOpen(true);
                        }}
                        className="w-[38px] h-[35px] shrink-0 rounded-[10px] flex items-center justify-center hover:bg-[#383838] active:scale-95 transition-all text-[#aaaaaa] hover:text-white"
                        title="Filtros"
                      >
                        <Filter className="w-[20px] h-[20px]" />
                      </button>

                      {/* History Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMoreMenuOpen(false);
                          setIsHistoryOpen(true);
                        }}
                        className="w-[38px] h-[35px] shrink-0 rounded-[10px] flex items-center justify-center hover:bg-[#383838] active:scale-95 transition-all text-[#aaaaaa] hover:text-white"
                        title="Histórico de Tarefas"
                      >
                        <History className="w-[21px] h-[21px]" />
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Search Component */}
            <div 
              className={`relative flex items-center rounded-full h-[42px] overflow-hidden group z-10 ${
                isSearchOpen 
                  ? 'w-[calc(100vw-32px)] bg-[#1f1f1f] border border-[#4f4f4f]' 
                  : 'w-[42px] bg-transparent border border-transparent mr-[46px]'
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
                    setTimeout(() => document.getElementById('roadmap-search-input')?.focus(), 100);
                  } else if (searchQuery.trim() !== '') {
                    // search action if needed
                  } else {
                    document.getElementById('roadmap-search-input')?.focus();
                  }
                }}
                className={`absolute left-0 w-[42px] h-[42px] flex items-center justify-center text-[#aaaaaa] outline-none focus:ring-0 focus:border-transparent z-20 transition-transform duration-300 active:scale-90 ${isSearchOpen ? 'pointer-events-auto' : 'pointer-events-auto'}`}
              >
                <Search className="w-[22px] h-[22px] text-[#aaaaaa]" />
              </button>

              {/* Input Field */}
              <input 
                id="roadmap-search-input"
                type="text" 
                placeholder="Buscar tarefas" 
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
                <X className="w-5 h-5 text-current" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col px-0 pt-8 pb-44 relative z-10">
          {filteredTasks.length === 0 && isSearchOpen && (
            <div className="text-center text-[13px] font-medium text-[#73777d] py-10 px-6 mt-[70px]">
              Nenhuma tarefa encontrada.
            </div>
          )}
          {filteredTasks.length === 0 && !isSearchOpen && (
            <div className="text-center text-[14px] font-medium text-[#73777d] py-10 px-6 mt-[70px]">
              Não há nenhuma tarefa adicionada.
            </div>
          )}
          {filteredTasks.map((task) => {
            let bgColor = "bg-[#282828]";
            let hoverColor = "hover:opacity-90";
            let textColor = "text-white";

            const isFilling = fillingTaskIds.includes(task.id);
            const isSliding = slidingTaskIds.includes(task.id);
            const isCollapsing = collapsingTaskIds.includes(task.id);

            return (
              <div
                key={task.id}
                className={`w-full shrink-0 px-4 transition-all duration-300 ease-out overflow-hidden ${
                  isCollapsing ? 'max-h-0 opacity-0 mb-0 py-0' : 'max-h-[300px] opacity-100 mb-2.5'
                }`}
              >
                <div
                  onClick={() => setSelectedTask(task)}
                  className={`${bgColor} rounded-[7px] px-4 py-3.5 flex flex-col cursor-pointer ${hoverColor} transition-all duration-300 ease-out ${
                    isSliding ? 'translate-x-[110%] opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'
                  }`}
                >
                  <div className="flex items-start justify-start w-full">
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFilling || isSliding || isCollapsing) return;
                      
                      playPopSound();
                      
                      setFillingTaskIds(prev => [...prev, task.id]);
                      setTimeout(() => {
                        setSlidingTaskIds(prev => [...prev, task.id]);
                        setTimeout(() => {
                          setCollapsingTaskIds(prev => [...prev, task.id]);
                          setTimeout(() => {
                            updateTask(task.id, { completed: true, completedAt: new Date().toISOString(), images: [] });
                            setFillingTaskIds(prev => prev.filter(t => t !== task.id));
                            setSlidingTaskIds(prev => prev.filter(t => t !== task.id));
                            setCollapsingTaskIds(prev => prev.filter(t => t !== task.id));
                          }, 300);
                        }, 250);
                      }, 180);
                    }}
                    className={`w-[22px] h-[22px] rounded-full border ${isFilling || isSliding ? 'bg-[#ff3838] border-[#ff3838]' : 'border-[#cfcfcf] hover:bg-white/20'} flex items-center justify-center shrink-0 mr-3 transition-all duration-200 group`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isFilling || isSliding ? 'text-white opacity-100 scale-100' : 'text-white opacity-0 scale-50 group-hover:opacity-50'} transition-all duration-200`} />
                  </button>
                    <div className="flex flex-col justify-start flex-1 min-w-0">
                      <p
                        className={`${textColor} font-roboto font-normal text-[15px] leading-[22px] line-clamp-3 w-full break-words whitespace-normal`}
                      >
                        {task.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div key="addingTask" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 bg-black/80 z-[100] flex flex-col justify-end overflow-hidden ${isDiscardModalOpen ? 'pointer-events-none' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (isDiscardModalOpen || !isAddingTask || isSaving) return;
              if (isStartPickerOpen) {
                setIsStartPickerOpen(false);
              } else if (isDatePickerOpen) {
                setIsDatePickerOpen(false);
                setIsStartPickerOpen(true);
              } else if (isTimePickerOpen) {
                setIsTimePickerOpen(false);
                setIsStartPickerOpen(true);
              } else if (isEndPickerOpen) {
                setIsEndPickerOpen(false);
              } else if (isEndDatePickerOpen) {
                setIsEndDatePickerOpen(false);
                setIsEndPickerOpen(true);
              } else if (isEndTimePickerOpen) {
                setIsEndTimePickerOpen(false);
                setIsEndPickerOpen(true);
              } else if (isPriorityDropdownOpen) {
                setIsPriorityDropdownOpen(false);
              } else if (isEffortDropdownOpen) {
                setIsEffortDropdownOpen(false);
              } else if (isCategoryDropdownOpen) {
                setIsCategoryDropdownOpen(false);
              } else if (isLocationSheetOpen) {
                setIsLocationSheetOpen(false);
              } else if (isImageSheetOpen) {
                setIsImageSheetOpen(false);
              } else {
                handleCloseAddingTask();
              }
            }}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ 
                y: (isStartPickerOpen || isTimePickerOpen || isEndPickerOpen || isEndDatePickerOpen || isEndTimePickerOpen || isDatePickerOpen || isPriorityDropdownOpen || isEffortDropdownOpen || isCategoryDropdownOpen || isLocationSheetOpen || isImageSheetOpen) ? "100%" : 0,
                transition: { type: "spring", damping: 24, stiffness: 200 }
              }}
              exit={{ 
                y: "100%",
                transition: { type: "spring", damping: 24, stiffness: 200 }
              }}
              className="bg-[#1f1f1f] w-full max-h-[90vh] rounded-t-[40px] p-6 flex flex-col gap-4 relative z-40 border-t border-[#4f4f4f] -mb-[100px] pb-[140px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Extra background block to prevent detachment during the spring bounce */}
              <div className="absolute top-[98%] left-0 right-0 h-[100px] bg-[#1f1f1f] pointer-events-none" />
              
            <div className="flex flex-col gap-4 pb-0 no-scrollbar">
                <input
                type="text"
                maxLength={100}
                placeholder="Título da tarefa: máx. 100 caracteres"
                className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 py-4 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d]"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />

              <textarea
                placeholder="Adicione uma descrição para a tarefa..."
                className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 py-4 text-[14px] text-[#e8e8e9] h-[100px] resize-none outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d] no-scrollbar"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />

              <div className="flex gap-3 overflow-x-auto no-scrollbar snap-mandatory snap-x shrink-0 pb-2 -mx-6 px-6 scroll-px-6">
                <button 
                   onClick={() => {
                      setIsStartPickerOpen(!isStartPickerOpen);
                      setIsEndPickerOpen(false);
                      setIsEndDatePickerOpen(false);
                      setIsEndTimePickerOpen(false);
                      setIsLocationSheetOpen(false);
                      setIsPriorityDropdownOpen(false);
                      setIsEffortDropdownOpen(false);
                      setIsCategoryDropdownOpen(false);
                      setIsImageSheetOpen(false);
                      setIsDatePickerOpen(false);
                      setIsTimePickerOpen(false);
                   }}
                   className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                >
                   <span className="truncate mr-2">{newTask.date || newTask.startTime ? <span className="text-white">{`${newTask.date ? new Date(newTask.date + 'T12:00:00').toLocaleDateString('pt-BR') : ''}${(newTask.date && newTask.startTime) ? ' às ' : ''}${newTask.startTime || ''}`}</span> : <span className="text-[#73777d]">Início da Tarefa</span>}</span>
                   <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${newTask.date || newTask.startTime ? "text-white" : "text-[#73777d]"} ${isStartPickerOpen ? "rotate-90" : ""}`} />
                </button>
                <button 
                   onClick={() => {
                      setIsEndPickerOpen(!isEndPickerOpen);
                      setIsTimePickerOpen(false);
                      setIsDatePickerOpen(false); setIsStartPickerOpen(false);
                      setIsLocationSheetOpen(false);
                      setIsPriorityDropdownOpen(false);
                      setIsEffortDropdownOpen(false);
                      setIsCategoryDropdownOpen(false);
                    setIsImageSheetOpen(false);
                   }}
                   className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                >
                   <span className="truncate mr-2">{newTask.endDate || newTask.endTime ? <span className="text-white">{`${newTask.endDate ? new Date(newTask.endDate + 'T12:00:00').toLocaleDateString('pt-BR') : ''}${(newTask.endDate && newTask.endTime) ? ' às ' : ''}${newTask.endTime || ''}`}</span> : <span className="text-[#73777d]">Prazo Final</span>}</span>
                   <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${newTask.endDate || newTask.endTime ? "text-white" : "text-[#73777d]"} ${isEndPickerOpen ? "rotate-90" : ""}`} />
                </button>

                <button
                  onClick={() => {
                    setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
                    setIsEffortDropdownOpen(false);
                    setIsCategoryDropdownOpen(false);
                    setIsTimePickerOpen(false);
                    setIsEndPickerOpen(false);
    setIsEndDatePickerOpen(false);
    setIsEndTimePickerOpen(false);
                    setIsDatePickerOpen(false); setIsStartPickerOpen(false);
                    setIsLocationSheetOpen(false);
                    setIsImageSheetOpen(false);
                  }}
                  className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                >
                  <span className="truncate mr-2">
                    {newTask.priority ? <span className="text-white">{newTask.priority}</span> : <span className="text-[#73777d]">Prioridade</span>}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${newTask.priority ? "text-white" : "text-[#73777d]"} ${isPriorityDropdownOpen ? "rotate-90" : ""}`}
                  />
                </button>
                <button
                  onClick={() => {
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                    setIsPriorityDropdownOpen(false);
                    setIsEffortDropdownOpen(false);
                    setIsTimePickerOpen(false);
                    setIsEndPickerOpen(false);
    setIsEndDatePickerOpen(false);
    setIsEndTimePickerOpen(false);
                    setIsDatePickerOpen(false); setIsStartPickerOpen(false);
                    setIsLocationSheetOpen(false);
                    setIsImageSheetOpen(false);
                  }}
                  className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                >
                  <span className="truncate mr-2">
                    {newTask.category ? <span className="text-white">{newTask.category}</span> : <span className="text-[#73777d]">Categoria</span>}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${newTask.category ? "text-white" : "text-[#73777d]"} ${isCategoryDropdownOpen ? "rotate-90" : ""}`}
                  />
                </button>
                
                <button
                  onClick={() => {
                    setIsEffortDropdownOpen(!isEffortDropdownOpen);
                    setIsPriorityDropdownOpen(false);
                    setIsCategoryDropdownOpen(false);
                    setIsTimePickerOpen(false);
                    setIsEndPickerOpen(false);
    setIsEndDatePickerOpen(false);
    setIsEndTimePickerOpen(false);
                    setIsDatePickerOpen(false); setIsStartPickerOpen(false);
                    setIsLocationSheetOpen(false);
                    setIsImageSheetOpen(false);
                  }}
                  className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                >
                  <span className="truncate mr-2">
                    {newTask.effort ? <span className="text-white">{newTask.effort === 'Baixa' ? 'Baixo' : newTask.effort === 'Média' ? 'Médio' : 'Alto'}</span> : <span className="text-[#73777d]">Esforço</span>}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${newTask.effort ? "text-white" : "text-[#73777d]"} ${isEffortDropdownOpen ? "rotate-90" : ""}`}
                  />
                </button>
                <button 
                   onClick={() => {
                      setIsLocationSheetOpen(!isLocationSheetOpen);
                      setIsTimePickerOpen(false);
                      setIsEndPickerOpen(false);
    setIsEndDatePickerOpen(false);
    setIsEndTimePickerOpen(false);
                      setIsDatePickerOpen(false); setIsStartPickerOpen(false);
                      setIsPriorityDropdownOpen(false);
                      setIsEffortDropdownOpen(false);
                      setIsCategoryDropdownOpen(false);
                    setIsImageSheetOpen(false);
                   }}
                   className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                >
                   <span className="truncate mr-2">{newTask.location ? <span className="text-white">{newTask.location}</span> : <span className="text-[#73777d]">Local da Tarefa</span>}</span>
                   <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${newTask.location ? "text-white" : "text-[#73777d]"} ${isLocationSheetOpen ? "rotate-90" : ""}`} />
                </button>
                <button
                  onClick={() => {
                    setIsImageSheetOpen(!isImageSheetOpen);
                    setIsPriorityDropdownOpen(false);
                    setIsEffortDropdownOpen(false);
                    setIsCategoryDropdownOpen(false);
                    setIsTimePickerOpen(false);
                    setIsEndPickerOpen(false);
    setIsEndDatePickerOpen(false);
    setIsEndTimePickerOpen(false);
                    setIsDatePickerOpen(false); setIsStartPickerOpen(false);
                    setIsLocationSheetOpen(false);
                  }}
                  className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                >
                  <span className="truncate mr-2">
                    {newTask.images.length > 0 ? (
                      `Imagens ${newTask.images.length}/5`
                    ) : (
                      <span className="text-[#73777d]">Anexar imagens</span>
                    )}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${newTask.images && newTask.images.length > 0 ? "text-white" : "text-[#73777d]"} ${isImageSheetOpen ? "rotate-90" : ""}`}
                  />
                </button>
              </div>





            </div>
            
            <AnimatePresence>
              {newTask.title.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0, marginTop: -16 }}
                  animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 0 }}
                  exit={{ opacity: 0, y: 10, height: 0, marginTop: -16 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <SlideToSubmit 
                    onTrigger={handleAddTask}
                    disabled={isSaving}
                    text={editingTaskId ? 'Clique para salvar as alterações' : 'Clique para salvar a tarefa'}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Bottom Sheets for Pickers */}
          <AnimatePresence>
            {isTimePickerOpen && (
              <motion.div key="timePicker"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[100px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] pt-6 px-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-normal text-[20px]">Horário de Início</h3>
                  <button onClick={() => { setIsTimePickerOpen(false); setIsStartPickerOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 h-[344px] relative overflow-hidden">
                  <div className="overflow-y-auto overscroll-none no-scrollbar flex flex-col items-center gap-2 pb-10 h-full">
                    <div className="text-[12px] text-gray-400 font-normal mb-2 sticky top-0 bg-[#1f1f1f] w-full text-center py-2 z-10">Horas</div><div className="h-6 w-full shrink-0" />
                    {Array.from({length: 24}).map((_, i) => (
                      <button 
                        key={`h-${i}`} 
                        onClick={() => {
                          const h = i.toString().padStart(2, '0');
                          const m = newTask.startTime ? newTask.startTime.split(':')[1] : '00';
                          setNewTask({...newTask, startTime: `${h}:${m}`});
                        }}
                        className={`w-full py-3 rounded-[16px] text-[16px] font-normal transition-colors ${newTask.startTime?.startsWith(i.toString().padStart(2, '0') + ':') ? 'bg-white text-black font-normal' : 'bg-[#2c2c2c] text-[#e8e8e9] hover:bg-[#4f4f4f]'}`}
                      >
                        {i.toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                  <div className="overflow-y-auto overscroll-none no-scrollbar flex flex-col items-center gap-2 pb-10 h-full">
                    <div className="text-[12px] text-gray-400 font-normal mb-2 sticky top-0 bg-[#1f1f1f] w-full text-center py-2 z-10">Minutos</div><div className="h-6 w-full shrink-0" />
                    {Array.from({length: 60}).map((_, i) => (
                      <button 
                        key={`m-${i}`} 
                        onClick={() => {
                          const m = i.toString().padStart(2, '0');
                          const h = newTask.startTime ? newTask.startTime.split(':')[0] : '00';
                          setNewTask({...newTask, startTime: `${h}:${m}`});
                          setIsTimePickerOpen(false); setIsStartPickerOpen(true);
                        }}
                        className={`w-full py-3 rounded-[16px] text-[16px] font-normal transition-colors ${newTask.startTime?.endsWith(':' + i.toString().padStart(2, '0')) ? 'bg-white text-black font-normal' : 'bg-[#2c2c2c] text-[#e8e8e9] hover:bg-[#4f4f4f]'}`}
                      >
                        {i.toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                  {/* Fade out top border */}
                  <div className="absolute top-[32px] left-0 w-full h-14 bg-gradient-to-b from-[#1f1f1f] to-transparent pointer-events-none z-20" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isStartPickerOpen && (
              <motion.div key="startPicker"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] pt-6 px-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-normal text-[20px]">Início da Tarefa</h3>
                  <button onClick={() => setIsStartPickerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 mb-8">
                  <button 
                    onClick={() => {
                        setIsStartPickerOpen(false);
                        setIsDatePickerOpen(true);
                    }}
                    className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
                  >
                    <span className="truncate mr-2">
                        {newTask.date ? <span className="text-white">{new Date(newTask.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span> : <span className="text-[#73777d]">Escolher Data de Início</span>}
                    </span>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${newTask.date ? "text-white" : "text-[#73777d]"}`} />
                  </button>
                  <button 
                    onClick={() => {
                        setIsStartPickerOpen(false);
                        setIsTimePickerOpen(true);
                    }}
                    className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
                  >
                    <span className="truncate mr-2">
                        {newTask.startTime ? <span className="text-white">{newTask.startTime}</span> : <span className="text-[#73777d]">Escolher Horário de Início</span>}
                    </span>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${newTask.startTime ? "text-white" : "text-[#73777d]"}`} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isEndPickerOpen && (
              <motion.div key="endPicker"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] pt-6 px-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-normal text-[20px]">Prazo Final</h3>
                  <button onClick={() => setIsEndPickerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 mb-8">
                  <button 
                    onClick={() => {
                        setIsEndPickerOpen(false);
                        setIsEndDatePickerOpen(true);
                    }}
                    className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
                  >
                    <span className="truncate mr-2">
                        {newTask.endDate ? <span className="text-white">{new Date(newTask.endDate + 'T12:00:00').toLocaleDateString('pt-BR')}</span> : <span className="text-[#73777d]">Escolher Data Final</span>}
                    </span>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${newTask.endDate ? "text-white" : "text-[#73777d]"}`} />
                  </button>
                  <button 
                    onClick={() => {
                        setIsEndPickerOpen(false);
                        setIsEndTimePickerOpen(true);
                    }}
                    className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
                  >
                    <span className="truncate mr-2">
                        {newTask.endTime ? <span className="text-white">{newTask.endTime}</span> : <span className="text-[#73777d]">Escolher Horário Final</span>}
                    </span>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${newTask.endTime ? "text-white" : "text-[#73777d]"}`} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isEndDatePickerOpen && (
              <motion.div key="endDatePicker"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] p-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-normal text-[20px]">Data Final</h3>
                  <button onClick={() => { setIsEndDatePickerOpen(false); setIsEndPickerOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
                <div className="bg-[#2c2c2c] rounded-[24px] p-5">
                  <div className="flex justify-between items-center mb-6">
                      <button onClick={() => {
                          if (endCurrentMonth === 0) {
                              setEndCurrentMonth(11);
                              setEndCurrentYear(endCurrentYear - 1);
                          } else {
                              setEndCurrentMonth(endCurrentMonth - 1);
                          }
                      }} className="p-2 bg-[#4f4f4f] hover:bg-[#5a5a5a] rounded-xl transition-colors text-white"><ChevronLeft className="w-5 h-5" /></button>
                      <div className="text-[16px] font-normal text-[#e8e8e9] capitalize">
                          {new Date(endCurrentYear, endCurrentMonth).toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'})}
                      </div>
                      <button onClick={() => {
                          if (endCurrentMonth === 11) {
                              setEndCurrentMonth(0);
                              setEndCurrentYear(endCurrentYear + 1);
                          } else {
                              setEndCurrentMonth(endCurrentMonth + 1);
                          }
                      }} className="p-2 bg-[#4f4f4f] hover:bg-[#5a5a5a] rounded-xl transition-colors text-white"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center mb-3">
                      {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={`dow-${i}`} className="text-[12px] font-bold text-gray-400">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                      {Array.from({length: new Date(endCurrentYear, endCurrentMonth, 1).getDay()}).map((_, i) => <div key={`empty-${i}`} />)}
                      {Array.from({length: new Date(endCurrentYear, endCurrentMonth + 1, 0).getDate()}).map((_, i) => {
                          const day = i + 1;
                          const dateStr = `${endCurrentYear}-${(endCurrentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                          const isSelected = newTask.endDate === dateStr;
                          const today = new Date();
                          today.setHours(0,0,0,0);
                          const currentBtnDate = new Date(endCurrentYear, endCurrentMonth, day);
                          const isPast = currentBtnDate < today;
                          return (
                              <button 
                                  key={day}
                                  onClick={() => {
                                      if (isPast) return;
                                      setNewTask({...newTask, endDate: dateStr});
                                      setIsEndDatePickerOpen(false);
                                      setIsEndPickerOpen(true);
                                  }}
                                  className="h-9 flex items-center justify-center"
                              >
                                  <span className={`w-8 h-8 rounded-[5px] text-[14px] font-medium flex items-center justify-center transition-all ${
                                      isSelected 
                                          ? 'bg-white text-black font-normal' 
                                          : isPast 
                                          ? 'text-[#73777d] cursor-not-allowed opacity-40' 
                                          : 'text-[#e8e8e9] hover:bg-[#3d3d3d]'
                                  }`}>
                                      {day}
                                  </span>
                              </button>
                          )
                      })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isEndTimePickerOpen && (
              <motion.div key="endTimePicker"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[100px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] pt-6 px-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-normal text-[20px]">Horário Final</h3>
                  <button onClick={() => { setIsEndTimePickerOpen(false); setIsEndPickerOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 h-[344px] relative overflow-hidden">
                  <div className="overflow-y-auto overscroll-none no-scrollbar flex flex-col items-center gap-2 pb-10 h-full">
                    <div className="text-[12px] text-gray-400 font-normal mb-2 sticky top-0 bg-[#1f1f1f] w-full text-center py-2 z-10">Horas</div><div className="h-6 w-full shrink-0" />
                    {Array.from({length: 24}).map((_, i) => (
                      <button 
                        key={`eh-${i}`} 
                        onClick={() => {
                          const h = i.toString().padStart(2, '0');
                          const m = newTask.endTime ? newTask.endTime.split(':')[1] : '00';
                          setNewTask({...newTask, endTime: `${h}:${m}`, duration: "", durationStr: ""});
                        }}
                        className={`w-full py-3 rounded-[16px] text-[16px] font-normal transition-colors ${newTask.endTime?.startsWith(i.toString().padStart(2, '0') + ':') ? 'bg-white text-black font-normal' : 'bg-[#2c2c2c] text-[#e8e8e9] hover:bg-[#4f4f4f]'}`}
                      >
                        {i.toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                  <div className="overflow-y-auto overscroll-none no-scrollbar flex flex-col items-center gap-2 pb-10 h-full">
                    <div className="text-[12px] text-gray-400 font-normal mb-2 sticky top-0 bg-[#1f1f1f] w-full text-center py-2 z-10">Minutos</div><div className="h-6 w-full shrink-0" />
                    {Array.from({length: 60}).map((_, i) => (
                      <button 
                        key={`em-${i}`} 
                        onClick={() => {
                          const m = i.toString().padStart(2, '0');
                          const h = newTask.endTime ? newTask.endTime.split(':')[0] : '00';
                          setNewTask({...newTask, endTime: `${h}:${m}`, duration: "", durationStr: ""});
                          setIsEndTimePickerOpen(false);
                          setIsEndPickerOpen(true);
                        }}
                        className={`w-full py-3 rounded-[16px] text-[16px] font-normal transition-colors ${newTask.endTime?.endsWith(':' + i.toString().padStart(2, '0')) ? 'bg-white text-black font-normal' : 'bg-[#2c2c2c] text-[#e8e8e9] hover:bg-[#4f4f4f]'}`}
                      >
                        {i.toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                  <div className="absolute top-[32px] left-0 w-full h-14 bg-gradient-to-b from-[#1f1f1f] to-transparent pointer-events-none z-20" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isDatePickerOpen && (
              <motion.div key="datePicker"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] p-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-normal text-[20px]">Data de Início</h3>
                  <button onClick={() => { setIsDatePickerOpen(false); setIsStartPickerOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
                <div className="bg-[#2c2c2c] rounded-[24px] p-5">
                  <div className="flex justify-between items-center mb-6">
                      <button onClick={() => {
                          if (currentMonth === 0) {
                              setCurrentMonth(11);
                              setCurrentYear(currentYear - 1);
                          } else {
                              setCurrentMonth(currentMonth - 1);
                          }
                      }} className="p-2 bg-[#4f4f4f] hover:bg-[#5a5a5a] rounded-xl transition-colors text-white"><ChevronLeft className="w-5 h-5" /></button>
                      <div className="text-[16px] font-normal text-[#e8e8e9] capitalize">
                          {new Date(currentYear, currentMonth).toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'})}
                      </div>
                      <button onClick={() => {
                          if (currentMonth === 11) {
                              setCurrentMonth(0);
                              setCurrentYear(currentYear + 1);
                          } else {
                              setCurrentMonth(currentMonth + 1);
                          }
                      }} className="p-2 bg-[#4f4f4f] hover:bg-[#5a5a5a] rounded-xl transition-colors text-white"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center mb-3">
                      {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={`dow-${i}`} className="text-[12px] font-bold text-gray-400">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                      {Array.from({length: new Date(currentYear, currentMonth, 1).getDay()}).map((_, i) => <div key={`empty-${i}`} />)}
                      {Array.from({length: new Date(currentYear, currentMonth + 1, 0).getDate()}).map((_, i) => {
                          const day = i + 1;
                          const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                          const isSelected = newTask.date === dateStr;
                          const today = new Date();
                          today.setHours(0,0,0,0);
                          const currentBtnDate = new Date(currentYear, currentMonth, day);
                          const isPast = currentBtnDate < today;
                          
                          return (
                              <button 
                                  key={day}
                                  onClick={() => {
                                      if (isPast) return;
                                      setNewTask({...newTask, date: dateStr});
                                      setIsDatePickerOpen(false); setIsStartPickerOpen(true);
                                  }}
                                  className="h-9 flex items-center justify-center"
                              >
                                  <span className={`w-8 h-8 rounded-[5px] text-[14px] font-medium flex items-center justify-center transition-all ${
                                      isSelected 
                                          ? 'bg-white text-black font-normal' 
                                          : isPast 
                                          ? 'text-[#73777d] cursor-not-allowed opacity-40' 
                                          : 'text-[#e8e8e9] hover:bg-[#3d3d3d]'
                                  }`}>
                                      {day}
                                  </span>
                              </button>
                          )
                      })}
                  </div>
                </div>
              </motion.div>
            )}

            {isPriorityDropdownOpen && (
              <motion.div key="priorityPicker"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] p-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-normal text-[20px]">Prioridade</h3>
                  <button onClick={() => setIsPriorityDropdownOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    "Nenhum",
                    "Baixa",
                    "Média",
                    "Alta"
                  ].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setNewTask({ ...newTask, priority: opt === "Nenhum" ? "" : opt });
                        setIsPriorityDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-5 py-4 rounded-[14px] transition-all ${((opt === "Nenhum" && !newTask.priority) || (newTask.priority === opt)) ? "bg-white text-black" : "bg-[#2c2c2c] text-[#e8e8e9] border border-transparent hover:bg-[#4f4f4f]"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-normal">
                          {opt}
                        </span>
                      </div>
                      {((opt === "Nenhum" && !newTask.priority) || (newTask.priority === opt)) && <Check className="w-5 h-5 text-black" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {isEffortDropdownOpen && (
              <motion.div key="effortPicker"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] p-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-normal text-[20px]">Nível de Esforço</h3>
                  <button onClick={() => setIsEffortDropdownOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { value: "Nenhum", label: "Nenhum" },
                    { value: "Baixa", label: "Baixo" },
                    { value: "Média", label: "Médio" },
                    { value: "Alta", label: "Alto" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setNewTask({ ...newTask, effort: opt.value === "Nenhum" ? "" : opt.value });
                        setIsEffortDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-5 py-4 rounded-[14px] transition-all ${((opt.value === "Nenhum" && !newTask.effort) || (newTask.effort === opt.value)) ? "bg-white text-black" : "bg-[#2c2c2c] text-[#e8e8e9] border border-transparent hover:bg-[#4f4f4f]"}`}
                    >
                      <span className="text-[15px] font-normal">
                        {opt.label}
                      </span>
                      {((opt.value === "Nenhum" && !newTask.effort) || (newTask.effort === opt.value)) && <Check className="w-5 h-5 text-black" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {isCategoryDropdownOpen && (
              <motion.div key="categoryPicker"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] p-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-normal text-[20px]">Categoria</h3>
                  <button onClick={() => setIsCategoryDropdownOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {["Nenhum", "Trabalho", "Estudos", "Pessoal"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setNewTask({ ...newTask, category: opt === "Nenhum" ? "" : opt });
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-5 py-4 rounded-[14px] transition-all ${((opt === "Nenhum" && !newTask.category) || (newTask.category === opt)) ? "bg-white text-black" : "bg-[#2c2c2c] text-[#e8e8e9] border border-transparent hover:bg-[#4f4f4f]"}`}
                    >
                      <span className="text-[15px] font-normal">
                        {opt}
                      </span>
                      {((opt === "Nenhum" && !newTask.category) || (newTask.category === opt)) && <Check className="w-5 h-5 text-black" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {isLocationSheetOpen && (
              <motion.div key="locationSheet"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] p-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-normal text-[20px]">Local da Tarefa</h3>
                  <button onClick={() => setIsLocationSheetOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    maxLength={40} placeholder="Local de realização: máx. 40 caracteres"
                    className="w-full bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 py-4 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d]"
                    value={newTask.location}
                    onChange={(e) =>
                      setNewTask({ ...newTask, location: e.target.value })
                    }
                  />
                </div>
              </motion.div>
            )}

            {isImageSheetOpen && (
              <motion.div key="imageSheet"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] p-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-normal text-[20px]">Anexar imagens</h3>
                  <button onClick={() => setIsImageSheetOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="w-full bg-[#2c2c2c] rounded-[14px] px-5 py-4 min-h-[56px] flex items-center justify-between">
                    {newTask.images.length === 0 ? (
                      <label className="text-[14px] text-[#73777d] cursor-pointer w-full text-left">
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          className="hidden" 
                          onChange={handleUnifiedFileChange} 
                        />
                        Clique aqui para adicionar: máx. 5 imagens
                      </label>
                    ) : (
                      <>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar items-center">
                          {newTask.images.map((img, idx) => (
                            <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                              <img src={img} alt={`Anexo ${idx}`} className="w-full h-full object-cover" />
                              <button onClick={() => removeFile(idx)} className="absolute top-1 right-1 bg-black/60 rounded-full w-4 h-4 flex items-center justify-center text-white text-[10px]">
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        {newTask.images.length < 5 && (
                          <label className="cursor-pointer ml-2 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-[5px] bg-[#ff3838] hover:bg-[#ff3838]/90 transition-colors text-white">
                            <input 
                              type="file" 
                              accept="image/*" 
                              multiple 
                              className="hidden" 
                              onChange={handleUnifiedFileChange} 
                            />
                            <Plus className="w-4 h-4 text-white" />
                          </label>
                        )}
                      </>
                    )}
                  </div>
                  {fileError && (
                    <div className="text-white text-[12px] font-normal leading-snug pl-1">
                      {fileError}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
        )}
      </AnimatePresence>

      {/* View Task Details Modal */}
      <AnimatePresence>
      {selectedTask && (() => {
let taskStatusText = "";
        let taskStatusColor = "";
        const isCompleted = selectedTask.completed;
        const [tYear, tMonth, tDay] = (selectedTask.date || "").split('-').map(Number);
        const startH = parseInt((selectedTask.startTime || "00:00").split(':')[0] || '0');
        const startM = parseInt((selectedTask.startTime || "00:00").split(':')[1] || '0');
        const durH = Math.floor((selectedTask.duration || 0) / 60);
        const durM = (selectedTask.duration || 0) % 60;
        const endH = startH + durH + Math.floor((startM + durM) / 60);
        const endM = (startM + durM) % 60;
        
        let startDateTime = new Date();
        let endDateTime = new Date();
        if (tYear) {
          startDateTime = new Date(tYear, tMonth - 1, tDay, startH, startM);
          endDateTime = new Date(tYear, tMonth - 1, tDay, endH, endM);
        }
        return (
        
        <motion.div key="selectedTaskModal" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 z-[100] flex flex-col justify-end overflow-hidden" 
            onClick={(e) => {
              e.stopPropagation();
              if (isDescriptionModalOpen) {
                setIsDescriptionModalOpen(false);
              } else {
                setSelectedTask(null);
                setIsDescriptionModalOpen(false);
              }
            }}>
          
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ 
                  y: isDescriptionModalOpen ? "100%" : 0, 
                  transition: { type: "spring", damping: 24, stiffness: 200 } 
                }}
                exit={{ 
                  y: "100%", 
                  transition: { type: "spring", damping: 24, stiffness: 200 } 
                }}
                className="bg-[#1f1f1f] w-full h-[720px] max-h-[92vh] rounded-t-[40px] pt-6 px-6 pb-[100px] flex flex-col relative border-t border-[#4f4f4f] z-40 -mb-[100px]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Extra background block to prevent detachment during the spring bounce */}
                <div className="absolute top-[98%] left-0 right-0 h-[100px] bg-[#1f1f1f] pointer-events-none" />

                {/* Fixed Header */}
                <div className="flex flex-col shrink-0 relative z-20 pb-4 border-b border-[#2c2c2c]">
                  <div className="flex justify-between items-center shrink-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[22px] font-normal text-white leading-tight truncate">
                        Detalhes da sua tarefa
                      </h3>
                    </div>

                    {/* 3-Dots Menu Button */}
                    <div className="relative shrink-0 ml-3 -mr-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsTaskMenuOpen(!isTaskMenuOpen);
                        }}
                        className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[#cfcfcf] hover:text-white hover:bg-white/10 transition cursor-pointer"
                        title="Opções"
                      >
                        <MoreVertical className="w-[20px] h-[20px] text-[#cfcfcf]" />
                      </button>

                      {/* Floating Menu Popup */}
                      <AnimatePresence>
                        {isTaskMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40 cursor-default"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isDuplicatingTask || isDeletingTask) return;
                                setIsTaskMenuOpen(false);
                              }}
                            />
                            <motion.div
                              key="task-menu-roadmap"
                              initial={{ opacity: 0, scale: 0.92, y: -6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.92, y: -6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-1.5 top-10 bg-[#282828] border border-[#4f4f4f] rounded-[16px] p-1.5 z-50 flex flex-col min-w-[160px]"
                            >
                              <button
                                type="button"
                                disabled={isDuplicatingTask || isDeletingTask}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isDuplicatingTask || isDeletingTask) return;
                                  updateTask(selectedTask.id, { isPinned: !selectedTask.isPinned, pinnedAt: new Date().toISOString() });
                                  setIsTaskMenuOpen(false);
                                  setSelectedTask(null);
                                  setIsDescriptionModalOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer"
                              >
                                {selectedTask.isPinned ? "Desafixar tarefa" : "Fixar tarefa"}
                              </button>
                              <button
                                type="button"
                                disabled={isDuplicatingTask || isDeletingTask}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isDuplicatingTask || isDeletingTask) return;
                                  setIsTaskMenuOpen(false);
                                  const taskToEdit = {
                                    title: selectedTask.title || "",
                                    description: selectedTask.description || "",
                                    startTime: selectedTask.startTime || "",
                                    endTime: selectedTask.endTime || "",
                                    endDate: selectedTask.endDate || "",
                                    durationStr: selectedTask.durationStr || "",
                                    duration: selectedTask.duration ? selectedTask.duration.toString() : "",
                                    priority: selectedTask.priority || "",
                                    category: selectedTask.category || "",
                                    date: selectedTask.date || "",
                                    effort: selectedTask.effort || "",
                                    location: selectedTask.location || "",
                                    images: selectedTask.images || [],
                                  };
                                  setNewTask(taskToEdit);
                                  setInitialTaskState(taskToEdit);
                                  setEditingTaskId(selectedTask.id);
                                  setIsAddingTask(true);
                                  setSelectedTask(null);
                                  setIsDescriptionModalOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                disabled={isDuplicatingTask || isDeletingTask}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isDuplicatingTask || isDeletingTask) return;
                                  setIsDuplicatingTask(true);
                                  setTimeout(() => {
                                    addTask({
                                      title: `${selectedTask.title || ""} • Cópia`,
                                      description: selectedTask.description || "",
                                      category: selectedTask.category || "",
                                      priority: selectedTask.priority || "",
                                      effort: selectedTask.effort || "",
                                    } as any);
                                    setIsDuplicatingTask(false);
                                    setIsTaskMenuOpen(false);
                                    setSelectedTask(null);
                                    setIsDescriptionModalOpen(false);
                                  }, 2000);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer flex items-center justify-start min-h-[36px]"
                              >
                                {isDuplicatingTask ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                                  </div>
                                ) : (
                                  "Duplicar"
                                )}
                              </button>
                              <button
                                type="button"
                                disabled={isDuplicatingTask || isDeletingTask}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isDuplicatingTask || isDeletingTask) return;
                                  setIsDeletingTask(true);
                                  setTimeout(async () => {
                                    const taskIdToDelete = selectedTask.id;
                                    await deleteTask(taskIdToDelete);
                                    setIsDeletingTask(false);
                                    setIsTaskMenuOpen(false);
                                    setSelectedTask(null);
                                    setIsDescriptionModalOpen(false);
                                  }, 2000);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer flex items-center justify-start min-h-[36px]"
                              >
                                {isDeletingTask ? (
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

                  {selectedTask.description && selectedTask.description.trim() !== "" && (
                    <div className="flex flex-col mt-3">
                      <span className="text-[14px] font-normal text-[#73777d] mb-1">Descrição:</span>
                      <div className="relative">
                        <p className="text-[14px] text-white leading-relaxed font-normal">
                          {selectedTask.description.length > 120 ? (
                            <>
                              {selectedTask.description.substring(0, 120)}...
                              <button 
                                onClick={() => setIsDescriptionModalOpen(true)}
                                className="text-[#ff3838] text-[14px] font-normal ml-1"
                              >
                                Expandir descrição
                              </button>
                            </>
                          ) : (
                            selectedTask.description
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scrollable Content Wrapper */}
                <div className="relative flex-1 overflow-hidden flex flex-col -mx-2">
                  <div className="overflow-y-auto no-scrollbar px-2 flex flex-col gap-3 pb-12 relative z-10 flex-1 pt-4">
                    
                    {selectedTask.date && selectedTask.date.trim() !== "" && (
                      <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                        <span className="text-[14px] font-normal text-[#73777d] shrink-0">Data de início:</span>
                        <span className="text-[14px] font-normal text-white truncate">
                          {new Date(selectedTask.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                    
                    {selectedTask.startTime && selectedTask.startTime.trim() !== "" && (
                      <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                        <span className="text-[14px] font-normal text-[#73777d] shrink-0">Horário de início:</span>
                        <span className="text-[14px] font-normal text-white truncate">{selectedTask.startTime}</span>
                      </div>
                    )}

                    {selectedTask.endDate && selectedTask.endDate.trim() !== "" && (
                      <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                        <span className="text-[14px] font-normal text-[#73777d] shrink-0">Data de término:</span>
                        <span className="text-[14px] font-normal text-white truncate">
                          {new Date(selectedTask.endDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}

                    {selectedTask.endTime ? (
                      <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                        <span className="text-[14px] font-normal text-[#73777d] shrink-0">Horário de término:</span>
                        <span className="text-[14px] font-normal text-white truncate">{selectedTask.endTime}</span>
                      </div>
                    ) : selectedTask.duration > 0 && (
                      <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                        <span className="text-[14px] font-normal text-[#73777d] shrink-0">Duração:</span>
                        <span className="text-[14px] font-normal text-white truncate">
                          {(() => {
                            const h = Math.floor(selectedTask.duration / 60);
                            const m = selectedTask.duration % 60;
                            if (h > 0 && m > 0) return `${h} ${h === 1 ? 'hora' : 'horas'} e ${m} ${m === 1 ? 'minuto' : 'minutos'}`;
                            if (h > 0) return `${h} ${h === 1 ? 'hora' : 'horas'}`;
                            return `${m} ${m === 1 ? 'minuto' : 'minutos'}`;
                          })()}
                        </span>
                      </div>
                    )}


                    {selectedTask.priority && selectedTask.priority !== "Nenhum" && selectedTask.priority !== "" && (
                      <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                        <span className="text-[14px] font-normal text-[#73777d] shrink-0">Prioridade:</span>
                        <span className="text-[14px] font-normal text-white truncate">
                          {selectedTask.priority}
                        </span>
                      </div>
                    )}
                    
                    {selectedTask.category && selectedTask.category !== "Nenhum" && selectedTask.category !== "" && (
                      <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                        <span className="text-[14px] font-normal text-[#73777d] shrink-0">Categoria:</span>
                        <span className="text-[14px] font-normal text-white truncate">{selectedTask.category}</span>
                      </div>
                    )}

                    {selectedTask.effort && selectedTask.effort !== "Nenhum" && selectedTask.effort !== "" && (
                      <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                        <span className="text-[14px] font-normal text-[#73777d] shrink-0">Esforço:</span>
                        <span className="text-[14px] font-normal text-white truncate">{selectedTask.effort}</span>
                      </div>
                    )}

                    {selectedTask.location && selectedTask.location.trim() !== "" && (
                      <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                        <span className="text-[14px] font-normal text-[#73777d] shrink-0">Local:</span>
                        <span className="text-[14px] font-normal text-white truncate">{selectedTask.location}</span>
                      </div>
                    )}
                    
                    {selectedTask.images && selectedTask.images.length > 0 && (
                      <div className="bg-[#2c2c2c] rounded-[14px] p-5 flex flex-col gap-3 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-normal text-[#73777d]">Imagens anexadas:</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 w-full">
                          {selectedTask.images.map((img: string, idx: number) => (
                            <img 
                              key={idx} 
                              src={img} 
                              onClick={() => setFullscreenImage(img)}
                              className="w-full aspect-square rounded-[14px] object-cover shrink-0 cursor-pointer border border-[#3d3d3d] hover:opacity-80 transition"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>

        <AnimatePresence>
            {isDescriptionModalOpen && (
              <motion.div
                key="descModal"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className="absolute -bottom-[100px] pb-[100px] left-0 w-full h-[720px] max-h-[92vh] flex flex-col bg-[#1f1f1f] rounded-t-[40px] pt-6 px-6 z-[110] border-t border-[#4f4f4f]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Extra background block to prevent detachment during the spring bounce */}
                <div className="absolute top-[98%] left-0 right-0 h-[100px] bg-[#1f1f1f] pointer-events-none" />

                <div className="flex items-center justify-between shrink-0 pb-4 border-b border-[#2c2c2c] relative z-20 bg-[#1f1f1f]">
                  <h3 className="text-white font-normal text-[20px]">
                    Descrição da Tarefa
                  </h3>
                  <button onClick={() => setIsDescriptionModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pt-4 pb-12">
                  <p className="text-[15px] text-white leading-relaxed font-normal whitespace-pre-wrap">
                    {selectedTask.description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        );
      })()}
      </AnimatePresence>

      
      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div key="fullImg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 z-[200] flex items-center justify-center p-4"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImage(null);
            }}
          >
            <button 
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
              onClick={() => setFullscreenImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={fullscreenImage}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB (Speed Dial) */}
      <AnimatePresence initial={false}>
        {!isAddingTask && (
          <motion.div 
            className="absolute bottom-[104px] right-6 z-40 flex flex-col items-end"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.button
              key="main-fab"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!user) {
                  onNavigate?.('profile');
                } else {
                  setNewTask(defaultTaskState);
                  setInitialTaskState(defaultTaskState);
                  setEditingTaskId(null);
                  setIsAddingTask(true);
                }
              }}
              className="w-14 h-14 rounded-[13px] bg-[#ff3838] flex items-center justify-center shadow-lg"
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
{/* Discard Modal */}
      <AnimatePresence>
        {isDiscardModalOpen && (
          <motion.div key="discardModal"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDiscardModalOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-[14px] text-white text-[14px] font-semibold bg-[#2c2c2c] hover:bg-[#333333] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAddingTaskState();
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

      {/* Filters Modal */}
      <AnimatePresence>
        {isFiltersScreenOpen && (
          <motion.div key="isFiltersScreenOpenModal"
            initial={{ y: "100%" }}
            animate={{ y: isFilterDatePickerOpen ? "100%" : "0%" }}
            exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="absolute top-0 left-0 right-0 -bottom-[150px] pb-[150px] bg-[#1f1f1f] z-[1000] flex flex-col font-sans overflow-hidden"
          >
            <div className="flex justify-between items-center px-6 pt-6 pb-6 shrink-0 border-b border-white/[0.04]">
              <h2 className="text-white font-bold text-[18px]">Filtros de tarefas</h2>
              <button onClick={() => setIsFiltersScreenOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white transition active:scale-95">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-7 pb-6 flex flex-col gap-7">
              
              {/* Categoria */}
              <div>
                <h3 className="text-[#73777d] text-[14px] font-normal mb-2.5">Categoria</h3>
                <div className="flex gap-2">
                  {[
                    "Trabalho",
                    "Estudos",
                    "Pessoal"
                  ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                      className={`bg-[#303030] border ${activeCategory === cat ? "border-white" : "border-transparent"} text-white px-3 h-[46px] rounded-[13px] flex items-center justify-center gap-2 text-[13px] font-normal flex-1 transition-all duration-300`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prioridade */}
              <div>
                <h3 className="text-[#73777d] text-[14px] font-normal mb-2.5">Prioridade</h3>
                <div className="flex gap-2">
                  {["Baixa", "Média", "Alta"].map(pri => (
                    <button
                      key={pri}
                      onClick={() => setActivePriority(activePriority === pri ? null : pri)}
                      className={`bg-[#303030] border ${activePriority === pri ? "border-white" : "border-transparent"} text-white px-3 h-[46px] rounded-[13px] flex items-center justify-center text-[13px] font-normal flex-1 transition-all duration-300`}
                    >
                      {pri}
                    </button>
                  ))}
                </div>
              </div>

              {/* Esforço */}
              <div>
                <h3 className="text-[#73777d] text-[14px] font-normal mb-2.5">Esforço</h3>
                <div className="flex gap-2">
                  {["Baixa", "Média", "Alta"].map(eff => (
                    <button
                      key={eff}
                      onClick={() => setActiveEffort(activeEffort === eff ? null : eff)}
                      className={`bg-[#303030] border ${activeEffort === eff ? "border-white" : "border-transparent"} text-white px-3 h-[46px] rounded-[13px] flex items-center justify-center text-[13px] font-normal flex-1 transition-all duration-300`}
                    >
                      {eff === "Baixa" ? "Baixo" : eff === "Média" ? "Médio" : "Alto"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Tarefa */}
              <div>
                <h3 className="text-[#73777d] text-[14px] font-normal mb-2.5">Tipo de tarefa</h3>
                <div className="flex gap-2">
                  {["Com prazo final", "Sem prazo final"].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setActiveEndMode(activeEndMode === mode ? null : mode)}
                      className={`bg-[#303030] border ${activeEndMode === mode ? "border-white" : "border-transparent"} text-white px-3 h-[46px] rounded-[13px] flex items-center justify-center text-[13px] font-normal flex-1 transition-all duration-300`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data da Tarefa */}
              <div>
                <h3 className="text-[#73777d] text-[14px] font-normal mb-2.5">Data específica da tarefa</h3>
                <div
                  onClick={() => setIsFilterDatePickerOpen(true)}
                  className={`w-full bg-[#303030] border ${activeDate ? "border-white" : "border-transparent"} rounded-[13px] px-3.5 h-[46px] flex items-center justify-between text-white transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex items-center">
                    <span className="font-normal text-[13px]">
                      {activeDate ? new Date(activeDate + 'T12:00:00').toLocaleDateString('pt-BR') : "Qualquer data"}
                    </span>
                  </div>
                  {activeDate ? (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDate(null);
                      }}
                      className="w-7 h-7 flex items-center justify-center cursor-pointer transition-opacity"
                    >
                      <X className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter DatePicker Modal */}
      <AnimatePresence>
        {isFilterDatePickerOpen && (
          <motion.div key="isFilterDatePickerOpenModalBg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 z-[1090]"
            onClick={(e) => {
              e.stopPropagation();
              setIsFilterDatePickerOpen(false);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isFilterDatePickerOpen && (
          <motion.div key="isFilterDatePickerOpenModalContent"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] p-6 z-[1100] border-t border-[#4f4f4f]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-normal text-[20px]">Data específica da tarefa</h3>
              <button onClick={() => setIsFilterDatePickerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <div className="bg-[#2c2c2c] rounded-[24px] p-5">
              <div className="flex justify-between items-center mb-6">
                  <button onClick={() => {
                      if (filterMonth === 0) {
                          setFilterMonth(11);
                          setFilterYear(filterYear - 1);
                      } else {
                          setFilterMonth(filterMonth - 1);
                      }
                  }} className="p-2 bg-[#4f4f4f] hover:bg-[#5a5a5a] rounded-xl transition-colors text-white"><ChevronLeft className="w-5 h-5" /></button>
                  <div className="text-[16px] font-normal text-[#e8e8e9] capitalize">
                      {new Date(filterYear, filterMonth).toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'})}
                  </div>
                  <button onClick={() => {
                      if (filterMonth === 11) {
                          setFilterMonth(0);
                          setFilterYear(filterYear + 1);
                      } else {
                          setFilterMonth(filterMonth + 1);
                      }
                  }} className="p-2 bg-[#4f4f4f] hover:bg-[#5a5a5a] rounded-xl transition-colors text-white"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center mb-3">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={`dow-${i}`} className="text-[12px] font-bold text-gray-400">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                  {Array.from({length: new Date(filterYear, filterMonth, 1).getDay()}).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({length: new Date(filterYear, filterMonth + 1, 0).getDate()}).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${filterYear}-${(filterMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                      const isSelected = activeDate === dateStr;
                      return (
                          <button 
                              key={day}
                              onClick={() => {
                                  setActiveDate(dateStr);
                                  setIsFilterDatePickerOpen(false);
                              }}
                              className="h-9 flex items-center justify-center"
                          >
                              <span className={`w-8 h-8 rounded-[5px] text-[14px] font-medium flex items-center justify-center transition-all ${
                                  isSelected 
                                      ? 'bg-white text-black font-normal' 
                                      : 'text-[#e8e8e9] hover:bg-[#3d3d3d]'
                              }`}>
                                  {day}
                              </span>
                          </button>
                      );
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div key="historyModal" 
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="absolute top-0 left-0 right-0 -bottom-[150px] pb-[150px] z-[1000] bg-[#1f1f1f] flex flex-col font-sans overflow-hidden"
          >
            <ScreenTaskHistory onBack={() => setIsHistoryOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

                  {/* Bottom Nav */}
      <div className="absolute -bottom-[2px] left-0 right-0 h-[90px] pb-[2px] bg-[#313131] rounded-t-[35px] px-6 flex justify-between items-center z-50">
        <button
          onClick={() => onNavigate?.("home")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] hover:opacity-80 transition"
        >
          <img src="https://i.ibb.co/JNnKTWq/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-170502-0000.png" alt="Início" className="w-[26px] h-[26px] object-contain pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" />
          <span className="text-[10px] font-bold text-[#aaaaaa] text-center leading-none mt-0.5">Início</span>
        </button>

        <button
          onClick={() => onNavigate?.("roadmap")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px]"
        >
          <img src="https://i.ibb.co/LzzjQ8Xh/Picsart-26-07-22-22-47-56-320.png" alt="Tarefas" className="w-[28px] h-[28px] object-contain translate-y-[1px] pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" />
          <span className="text-[10px] font-bold text-[#aaaaaa] text-center leading-none mt-0.5">Tarefas</span>
        </button>

        <button
          onClick={() => onNavigate?.("goals")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] hover:opacity-80 transition"
        >
          <img src="https://i.ibb.co/B2YpNgVD/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-165417-0000.png" alt="Objetivos" className="w-[26px] h-[26px] object-contain pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" />
          <span className="text-[10px] font-bold text-[#aaaaaa] text-center leading-none mt-0.5">Objetivos</span>
        </button>

        <button
          onClick={() => onNavigate?.("notes")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] hover:opacity-80 transition"
        >
          <img src="https://i.ibb.co/v4fChL23/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260812-130637-0000.png" alt="Anotações" className="w-[27px] h-[27px] object-contain pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" />
          <span className="text-[10px] font-bold text-[#aaaaaa] text-center leading-none mt-0.5">Anotações</span>
        </button>

        <button
          onClick={() => onNavigate?.("profile")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] hover:opacity-80 transition"
        >
          <img src="https://i.ibb.co/bg19xYN8/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-212607-0000.png" alt="Seu perfil" className="w-[25px] h-[25px] object-contain pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" />
          <span className="text-[10px] font-bold text-[#aaaaaa] text-center leading-none mt-0.5">Seu perfil</span>
        </button>
      </div>
    </div>
  );
}
