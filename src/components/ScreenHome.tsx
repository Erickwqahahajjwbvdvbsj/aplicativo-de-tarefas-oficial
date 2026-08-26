import { ArrowRight, Crosshair, Check, ChevronRight, Copy, Edit2, Trash2, Play, Briefcase, Book, Bell, Search, Settings, Home, CalendarDays, Phone, MessageCircle, User, Wand2, Eye, Target, Box, Monitor, Megaphone, BookOpen, Image as ImageIcon, X, MoreVertical, Calendar, ChevronLeft, Clock, Filter, Trophy, Bot, Goal , Rocket , ListTodo , NotepadText, Timer, CheckCircle2, BarChart2, Flame, Zap, CheckSquare, AlertTriangle, Flag, Shield, PieChart, ChevronDown, ChevronUp } from 'lucide-react';
import { useProfile } from "../hooks/useProfile";
import { useTasks, Task } from "../hooks/useTasks";
import { useGoals } from "../hooks/useGoals";
import { useNotes } from "../hooks/useNotes";
import { useState, useRef, useEffect } from "react";
import { ScreenTaskDetails } from "./ScreenTaskDetails";
import { motion, AnimatePresence } from 'motion/react';
// from "motion/react";


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

export function ScreenHome({
  onNavigate,
}: {
  onNavigate: (tab: "roadmap" | "home" | "ai" | "profile" | "goals" | "notifications" | "notes") => void;
}) {
  const { profile } = useProfile();
  const { tasks, updateTask, deleteTask, addTask } = useTasks();
  const { goals } = useGoals();
  const { notes } = useNotes();
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePriority, setActivePriority] = useState<string | null>(null);
  const [activeEffort, setActiveEffort] = useState<string | null>(null);
  const [activeEndMode, setActiveEndMode] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isRequirementsModalOpen, setIsRequirementsModalOpen] = useState(false);
  const [isTimerSettingsExpanded, setIsTimerSettingsExpanded] = useState(false);
  const [isViewingNextTask, setIsViewingNextTask] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = () => setIsMenuOpen(false);
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [collapsingTaskIds, setCollapsingTaskIds] = useState<string[]>([]);
  const [fillingTaskIds, setFillingTaskIds] = useState<string[]>([]);
  const [slidingTaskIds, setSlidingTaskIds] = useState<string[]>([]);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const setNewTask = (t: any) => {};
  const setInitialTaskState = (t: any) => {};
  const setEditingTaskId = (id: string) => {};
  const setIsAddingTask = (val: boolean) => { onNavigate("roadmap"); };

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

  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const mainBtnRef = useRef<HTMLButtonElement>(null);
  const [isMainBtnFilled, setIsMainBtnFilled] = useState(false);


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (mainBtnRef.current && !mainBtnRef.current.contains(event.target as Node)) {
        setIsMainBtnFilled(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, []);
  
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Goal Tasks Set for Filtering
  const goalTaskIdsForChart = new Set<string>();
  goals.forEach(g => {
    (g.taskIds || []).forEach(tid => goalTaskIdsForChart.add(tid));
    g.stages?.forEach(s => s.tasks?.forEach(st => {
      if (st.id) goalTaskIdsForChart.add(st.id);
    }));
  });

  const isGoalTaskForChart = (t: Task) => {
    if ((t as any).goalId || (t as any).isGoalTask) return true;
    if (goalTaskIdsForChart.has(t.id)) return true;
    return false;
  };

  const activeTasks = tasks.filter((t) => !t.completed && !isGoalTaskForChart(t));

  // Filter & calculate candidates for "Próxima Tarefa" card
  const eligibleNextTasks = tasks.map((t, originalIndex) => {
    if (t.completed) return null;
    if (isGoalTaskForChart(t)) return null;
    if (!t.date || !t.date.trim()) return null;
    if (!t.startTime || !t.startTime.trim()) return null;

    const startDateTime = new Date(`${t.date}T${t.startTime.trim()}:00`);
    if (isNaN(startDateTime.getTime())) return null;

    const hasEndDate = !!(t.endDate && t.endDate.trim());
    const hasEndTime = !!(t.endTime && t.endTime.trim());

    let endDateTime: Date | null = null;
    let hasDeadline = false;

    if (hasEndDate && hasEndTime) {
      const parsed = new Date(`${t.endDate}T${t.endTime}:00`);
      if (!isNaN(parsed.getTime())) {
        endDateTime = parsed;
        hasDeadline = true;
      }
    } else if (hasEndDate && !hasEndTime) {
      // Se tem data final sem horário final -> considera até o final do dia (23:59:59)
      const parsed = new Date(`${t.endDate}T23:59:59`);
      if (!isNaN(parsed.getTime())) {
        endDateTime = parsed;
        hasDeadline = true;
      }
    } else {
      // Se não tem data final, o fim da tarefa é considerado a meia-noite (23:59:59) do próprio dia em que começou
      const parsed = new Date(`${t.date}T23:59:59`);
      if (!isNaN(parsed.getTime())) {
        endDateTime = parsed;
      }
      hasDeadline = false;
    }

    // Se o horário final já passou (seja prazo final explícito ou a meia-noite do dia da tarefa sem prazo) -> descartar do card
    if (endDateTime && now > endDateTime) {
      return null;
    }

    const isInProgress = now >= startDateTime && (endDateTime ? now <= endDateTime : true);
    const isUpcoming = now < startDateTime;

    if (!isInProgress && !isUpcoming) return null;

    let createdMs = 0;
    if (t.createdAt) {
      if (typeof t.createdAt.toMillis === 'function') {
        createdMs = t.createdAt.toMillis();
      } else if (typeof t.createdAt === 'number') {
        createdMs = t.createdAt;
      } else if (typeof t.createdAt === 'string') {
        const parsed = new Date(t.createdAt).getTime();
        if (!isNaN(parsed)) createdMs = parsed;
      }
    }

    return {
      task: t,
      originalIndex,
      startDateTime,
      endDateTime,
      hasDeadline,
      isInProgress,
      isUpcoming,
      createdMs
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  // Sorting candidate tasks for "Próxima Tarefa" / "Em Andamento"
  eligibleNextTasks.sort((a, b) => {
    // 1. In-progress tasks take precedence over future/upcoming tasks
    if (a.isInProgress && !b.isInProgress) return -1;
    if (!a.isInProgress && b.isInProgress) return 1;

    // 2. If both are in-progress: the most recently started task (LATEST startDateTime) takes precedence!
    if (a.isInProgress && b.isInProgress) {
      const diffStart = b.startDateTime.getTime() - a.startDateTime.getTime();
      if (diffStart !== 0) return diffStart;
    }

    // 3. If both are upcoming: the soonest starting task (EARLIEST startDateTime) takes precedence!
    if (a.isUpcoming && b.isUpcoming) {
      const diffStart = a.startDateTime.getTime() - b.startDateTime.getTime();
      if (diffStart !== 0) return diffStart;
    }

    // 4. Tie-breaker for same start time: task created most recently
    if (a.createdMs && b.createdMs && a.createdMs !== b.createdMs) {
      return b.createdMs - a.createdMs;
    }
    return a.originalIndex - b.originalIndex;
  });

  const topEligible = eligibleNextTasks.length > 0 ? eligibleNextTasks[0] : null;
  const upcomingTask = topEligible ? topEligible.task : null;

  // Check if task has all 4 required fields for precise countdown
  const has4Fields = !!(
    upcomingTask?.date?.trim() &&
    upcomingTask?.startTime?.trim() &&
    upcomingTask?.endDate?.trim() &&
    upcomingTask?.endTime?.trim()
  );

  // Format timer string if timer active & in progress & has 4 fields
  let liveTimerStr = "";
  if (upcomingTask?.autoTimerEnabled && topEligible?.isInProgress && has4Fields && topEligible.endDateTime) {
    const remainingMs = topEligible.endDateTime.getTime() - now.getTime();
    if (remainingMs > 0) {
      const totalSec = Math.floor(remainingMs / 1000);
      const hrs = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      if (hrs > 0) {
        liveTimerStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} restante`;
      } else {
        liveTimerStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} restante`;
      }
    } else {
      liveTimerStr = "00:00 (Tempo esgotado)";
    }
  }

  // Dashboard Metrics
  const todayYear = now.getFullYear();
  const todayMonth = String(now.getMonth() + 1).padStart(2, '0');
  const todayDay = String(now.getDate()).padStart(2, '0');
  const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;

  const todayTasksList = tasks.filter((t) => !t.completed && t.date === todayStr);
  const todayTasksCount = todayTasksList.length;
  const overdueTasksCount = tasks.filter((t) => {
    if (t.completed) return false;
    if (isGoalTaskForChart(t)) return false;
    if (!t.endDate || !t.endDate.trim() || !t.endTime || !t.endTime.trim()) return false;

    const endDateTime = new Date(`${t.endDate}T${t.endTime}:00`);
    if (isNaN(endDateTime.getTime())) return false;

    return now > endDateTime;
  }).length;
  const totalActiveTasksCount = tasks.filter((t) => !t.completed && !isGoalTaskForChart(t)).length;
  const totalGoalsCount = goals.filter((g) => !g.completed).length;

  const activeNotesCount = notes.length;

  // Categories Distribution (Trabalho, Pessoal, Estudos)
  const categoriesList = [
    { name: 'Trabalho', icon: Briefcase, color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/10' },
    { name: 'Pessoal', icon: User, color: 'text-[#a855f7]', bg: 'bg-[#a855f7]/10' },
    { name: 'Estudos', icon: BookOpen, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' }
  ];

  const categoryCounts = categoriesList.map(cat => {
    const count = tasks.filter(t => {
      if (t.completed || isGoalTaskForChart(t)) return false;
      if (!t.category || !t.category.trim() || t.category === "Nenhum" || t.category === "Nenhuma") return false;
      return t.category.trim().toLowerCase() === cat.name.toLowerCase();
    }).length;
    return { ...cat, count };
  });

  // Week Chart (Segunda a Domingo)
  const currentDayOfWeek = now.getDay();
  const diffToMonday = (currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek);
  const mondayDate = new Date(now);
  mondayDate.setDate(now.getDate() + diffToMonday);
  mondayDate.setHours(0, 0, 0, 0);

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((label, index) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + index);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    const count = tasks.filter(t => {
      if (isGoalTaskForChart(t)) return false;
      if (!t.completed) return false;
      if (t.completedAt) {
        const cDate = new Date(t.completedAt);
        const cY = cDate.getFullYear();
        const cM = String(cDate.getMonth() + 1).padStart(2, '0');
        const cD = String(cDate.getDate()).padStart(2, '0');
        return `${cY}-${cM}-${cD}` === dateStr;
      }
      return t.date === dateStr;
    }).length;

    const isToday = dateStr === todayStr;

    return { label, count, isToday };
  });

  const maxCompletedInWeek = Math.max(...weekDays.map(w => w.count), 1);

  // Today Completion Rate
  const todayCompletedTasks = tasks.filter(t => t.completed && t.date === todayStr);
  const todayCompletedCount = todayCompletedTasks.length;
  const todayTotalCount = todayTasksCount + todayCompletedCount;

  // Priorities Distribution (Alta, Média, Baixa)
  const prioritiesList = [
    { name: 'Alta', label: 'Alta', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { name: 'Média', label: 'Média', icon: Flag, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Baixa', label: 'Baixa', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  ];

  const priorityCounts = prioritiesList.map(pri => {
    const count = tasks.filter(t => {
      if (t.completed || isGoalTaskForChart(t)) return false;
      if (!t.priority || !t.priority.trim() || t.priority === "Nenhum" || t.priority === "Nenhuma") return false;
      const p = t.priority.trim().toLowerCase();
      if (pri.name === 'Alta') return p === 'alta' || p === 'high';
      if (pri.name === 'Média') return p === 'média' || p === 'media' || p === 'medium';
      if (pri.name === 'Baixa') return p === 'baixa' || p === 'low';
      return false;
    }).length;
    return { ...pri, count };
  });
  
  const isSearching = searchQuery.trim().length > 0;
  
  let filteredTasks = activeTasks;
  if (isSearching) {
    const q = searchQuery.toLowerCase();
    filteredTasks = activeTasks.filter(t => t.title.toLowerCase().includes(q));
  } else {
    filteredTasks = activeTasks.filter(t => {
      const matchCategory = activeCategory
        ? (t.category && t.category.trim().toLowerCase() === activeCategory.trim().toLowerCase())
        : true;

      const matchPriority = activePriority
        ? (t.priority && (
            t.priority.trim().toLowerCase() === activePriority.trim().toLowerCase() ||
            (activePriority === 'Alta' && t.priority.toLowerCase() === 'high') ||
            (activePriority === 'Média' && (t.priority.toLowerCase() === 'medium' || t.priority.toLowerCase() === 'media')) ||
            (activePriority === 'Baixa' && t.priority.toLowerCase() === 'low')
          ))
        : true;

      const matchEffort = activeEffort
        ? (t.effort && (
            t.effort.trim().toLowerCase() === activeEffort.trim().toLowerCase() ||
            (activeEffort === 'Baixa' && (t.effort.toLowerCase() === 'baixo' || t.effort.toLowerCase() === 'low')) ||
            (activeEffort === 'Média' && (t.effort.toLowerCase() === 'médio' || t.effort.toLowerCase() === 'medio' || t.effort.toLowerCase() === 'medium')) ||
            (activeEffort === 'Alta' && (t.effort.toLowerCase() === 'alto' || t.effort.toLowerCase() === 'high'))
          ))
        : true;

      const matchDate = activeDate ? t.date === activeDate : true;

      const hasDeadline = !!(t.date && t.date.trim());

      let matchEndMode = true;
      if (activeEndMode === "Com prazo final") {
        matchEndMode = hasDeadline;
      } else if (activeEndMode === "Sem prazo final") {
        matchEndMode = !hasDeadline;
      }

      return matchCategory && matchPriority && matchEffort && matchDate && matchEndMode;
    });
  }

  let mainCardBgColor = "bg-[#282828]";

  return (
    <div className="w-full h-full bg-[#1f1f1f] relative font-sans overflow-hidden flex flex-col">
      <div className="flex-1 w-full flex flex-col relative z-0 min-h-0">        {/* Header Row */}
        <div className="w-full pt-4 px-4 pb-4 flex items-center justify-between z-30 shrink-0 relative bg-[#1f1f1f] border-b border-white/5 h-[74px]" style={{ backgroundColor: '#1f1f1f' }}>
          {/* Default state elements (Title) */}
          <div className="flex items-center gap-3">
            <h1 className="text-white text-[20px] font-bold leading-tight tracking-tight">
              Dashboard
            </h1>
          </div>

          {/* Right elements container (Calendar Icon) */}
          <div className="flex items-center justify-end absolute right-4 top-4 h-[42px]">
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="w-[42px] h-[42px] shrink-0 rounded-full flex items-center justify-center transform hover:scale-105 active:scale-95 transition-transform bg-transparent cursor-pointer"
              title="Calendário"
            >
              <Calendar className="w-[23px] h-[23px] text-[#aaaaaa]" />
            </button>
          </div>
        </div>

        {/* Native Scrollable Content Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto no-scrollbar pointer-events-auto w-full flex flex-col relative z-10"
        >
          <div className="w-full flex flex-col relative min-h-full pt-8" style={{ paddingBottom: '120px' }}>
          

          <div className="px-4 flex flex-col w-full relative z-10 pb-28">
              {/* Main Feature Card */}
              {upcomingTask ? (
                <div className={`${mainCardBgColor} rounded-[7px] px-4 pt-2.5 pb-3.5 flex flex-col justify-start relative overflow-hidden mb-3 shrink-0 transition-colors duration-300`}>
                  {/* Top Header Row: Title on Left, Settings/Chevron on Right */}
                  <div className="relative z-10 w-full h-[24px] flex items-center justify-between gap-2 select-none">
                    <div 
                      className="flex items-center min-w-0 overflow-hidden"
                    >
                      <span className="text-[#c0c2c4] text-[14px] font-medium shrink-0 -ml-[1px]">
                        {topEligible?.isInProgress ? "Tarefa em andamento" : "Próxima tarefa"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsTimerSettingsExpanded(!isTimerSettingsExpanded);
                      }}
                      className="w-6 h-6 rounded-lg text-white/80 hover:text-white transition-opacity cursor-pointer outline-none shrink-0 flex items-center justify-center p-0"
                      title="Configurações do cronômetro"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isTimerSettingsExpanded ? (
                          <motion.div
                            key="chevron"
                            initial={{ opacity: 0, y: 4, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.8 }}
                            transition={{ duration: 0.14, ease: "easeInOut" }}
                            className="w-4 h-4 flex items-center justify-center"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="settings"
                            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                            transition={{ duration: 0.18, ease: "easeInOut" }}
                            className="w-4 h-4 flex items-center justify-center"
                          >
                            <Settings className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>

                  {/* Task Title */}
                  <div 
                    className="relative z-10 select-none flex flex-col items-start text-left mt-1.5 shrink-0"
                  >
                    <h2 className="text-white text-[20px] font-medium leading-[1.15] text-left">
                      {upcomingTask.title}
                    </h2>
                  </div>

                  <AnimatePresence initial={false}>
                    {isTimerSettingsExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="relative z-10 w-full overflow-hidden"
                      >
                        <div className="border-t border-white/15 pt-[14px] mt-3">
                          <div className="w-full flex items-center justify-between gap-2 text-white select-none">
                          <div className="flex items-center gap-2.5 truncate">
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={upcomingTask.autoTimerEnabled ? 'timer' : 'title'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-[14px] font-medium truncate text-white leading-none block ml-[1px]"
                              >
                                {upcomingTask.autoTimerEnabled
                                  ? (liveTimerStr || "00:00:00")
                                  : 'Ativar cronômetro automático'}
                              </motion.span>
                            </AnimatePresence>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!upcomingTask.autoTimerEnabled && !has4Fields) {
                                setIsRequirementsModalOpen(true);
                                return;
                              }
                              updateTask(upcomingTask.id, {
                                autoTimerEnabled: !upcomingTask.autoTimerEnabled
                              });
                            }}
                            className="w-9 h-[16px] rounded-full p-[2px] bg-white transition-colors relative flex items-center shrink-0 ml-2 cursor-pointer outline-none"
                          >
                            <div
                              className={`w-[12px] h-[12px] rounded-full bg-[#1f1f1f] transition-transform duration-300 transform ${
                                upcomingTask.autoTimerEnabled
                                  ? 'translate-x-[20px]'
                                  : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="w-full flex items-center justify-between gap-2 text-white select-none mt-[10px] pb-1">
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="text-[14px] font-medium truncate text-white leading-none block ml-[1px]">
                              Ver tarefa na tela tarefas
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsViewingNextTask(true);
                              setTimeout(() => {
                                (window as any).pendingTaskToOpen = upcomingTask;
                                window.dispatchEvent(new CustomEvent('openTaskDetails', { detail: upcomingTask }));
                                onNavigate('roadmap');
                                setIsViewingNextTask(false);
                              }, 300);
                            }}
                            className="w-9 h-[16px] rounded-full p-[2px] bg-white transition-colors relative flex items-center shrink-0 ml-2 cursor-pointer outline-none"
                          >
                            <div
                              className={`w-[12px] h-[12px] rounded-full bg-[#1f1f1f] transition-transform duration-300 transform ${
                                isViewingNextTask
                                  ? 'translate-x-[20px]'
                                  : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className={`${mainCardBgColor} rounded-[7px] h-[75px] pt-2.5 pb-3.5 px-4 flex flex-col justify-between relative overflow-hidden mb-3 shrink-0`}>
                  <div className="flex items-center justify-between select-none">
                    <span className="text-[#c0c2c4] text-[14px] font-medium shrink-0 -ml-[1px]">Próxima tarefa</span>
                  </div>
                  <div className="text-white text-[15px] font-medium leading-none text-left mt-1.5">
                    Nenhuma tarefa agendada para este horário.
                  </div>
                </div>
              )}

              {/* Dashboard Info Cards */}
              {/* Grid: Tarefas para hoje & Tarefas concluídas */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Tarefas para hoje */}
                <div className="bg-[#282828] rounded-[7px] pt-2.5 pb-3.5 px-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[#73777d] text-[12px] font-medium">Tarefas para hoje</span>
                  </div>
                  <div className="text-white font-medium text-[20px] leading-none mt-1.5">
                    {todayTotalCount}
                  </div>
                </div>

                {/* Tarefas concluídas hoje */}
                <div className="bg-[#282828] rounded-[7px] pt-2.5 pb-3.5 px-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[#73777d] text-[12px] font-medium">Tarefas concluídas hoje</span>
                  </div>
                  <div className="text-white font-medium text-[20px] leading-none mt-1.5">
                    {todayCompletedCount}
                  </div>
                </div>
              </div>

              {/* Grid 1: Tarefas Ativas & Tarefas Atrasadas */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Total de tarefas ativas */}
                <div className="bg-[#282828] rounded-[7px] pt-2.5 pb-3.5 px-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[#73777d] text-[12px] font-medium">Tarefas ativas</span>
                  </div>
                  <div className="text-white font-medium text-[20px] leading-none mt-1.5">
                    {totalActiveTasksCount}
                  </div>
                </div>

                {/* Tarefas atrasadas */}
                <div className="bg-[#282828] rounded-[7px] pt-2.5 pb-3.5 px-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[#73777d] text-[12px] font-medium">Tarefas atrasadas</span>
                  </div>
                  <div className="text-white font-medium text-[20px] leading-none mt-1.5">
                    {overdueTasksCount}
                  </div>
                </div>
              </div>

              {/* Grid 2: Total de Objetivos & Tempo Estimado Hoje */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Total de objetivos */}
                <div className="bg-[#282828] rounded-[7px] pt-2.5 pb-3.5 px-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[#73777d] text-[12px] font-medium">Objetivos ativos</span>
                  </div>
                  <div className="text-white font-medium text-[20px] leading-none mt-1.5">
                    {totalGoalsCount}
                  </div>
                </div>

                {/* Anotações ativas */}
                <div className="bg-[#282828] rounded-[7px] pt-2.5 pb-3.5 px-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[#73777d] text-[12px] font-medium">Anotações ativas</span>
                  </div>
                  <div className="text-white font-medium text-[20px] leading-none mt-1.5">
                    {activeNotesCount}
                  </div>
                </div>
              </div>

              {/* Distribuição por Categoria */}
              <div className="bg-[#282828] rounded-[7px] pt-3 pb-4 px-4 flex flex-col mb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#73777d] text-[12px] font-medium">Distribuição de tarefas por categoria</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {categoryCounts.map((cat) => (
                    <div key={cat.name} className="bg-[#353535] rounded-[5px] px-2.5 py-2 flex items-center justify-start gap-1.5">
                      <span className="text-[#73777d] text-[12px] font-medium truncate">{cat.name}:</span>
                      <span className="text-white font-medium text-[14px] shrink-0">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribuição por Nível de Prioridade */}
              <div className="bg-[#282828] rounded-[7px] pt-3 pb-4 px-4 flex flex-col mb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#73777d] text-[12px] font-medium">Distribuição de tarefas por Prioridade</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {priorityCounts.map((pri) => (
                    <div key={pri.name} className="bg-[#353535] rounded-[5px] px-2.5 py-2 flex items-center justify-start gap-1.5">
                      <span className="text-[#73777d] text-[12px] font-medium truncate">{pri.label}:</span>
                      <span className="text-white font-medium text-[14px] shrink-0">{pri.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico de Conclusão da Semana (Segunda a Domingo) */}
              <div className="bg-[#282828] rounded-[7px] pt-3 pb-4 px-4 flex flex-col mb-6 transition-all duration-300">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[#73777d] text-[12px] font-medium">
                    Gráfico de tarefas concluídas nesta semana
                  </span>
                </div>

                <div className="flex items-end justify-between gap-2 pt-1 px-1 transition-all duration-300">
                  {weekDays.map((day) => {
                    const clampedCount = Math.min(day.count, 30);
                    const barHeight = day.count === 0 
                      ? 8 
                      : Math.round(14 + ((clampedCount - 1) / 29) * 82);

                    return (
                      <div key={day.label} className="flex-1 flex flex-col items-center gap-1.5 justify-end">
                        <span className={`text-[10px] font-medium ${day.count > 0 ? "text-white" : "text-[#73777d]/60"}`}>
                          {day.count}
                        </span>
                        <div 
                          style={{ height: `${barHeight}px` }} 
                          className={`w-full rounded-[2px] transition-all duration-300 ${
                            day.count > 0 ? "bg-[#ff3838]" : "bg-[#353535]"
                          }`} 
                        />
                        <span className={`text-[11px] font-medium ${day.isToday ? "text-white" : "text-[#73777d]"}`}>
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

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
                        {selectedTask.title}
                      </h3>
                    </div>
                    
                    {/* 3-Dots Menu Button */}
                    <div className="relative shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsTaskMenuOpen(!isTaskMenuOpen);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#cfcfcf] hover:text-white hover:bg-white/10 transition cursor-pointer"
                        title="Opções"
                      >
                        <MoreVertical className="w-[18px] h-[18px] text-[#cfcfcf]" />
                      </button>

                      {/* Floating Menu Popup */}
                      <AnimatePresence>
                        {isTaskMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40 cursor-default"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsTaskMenuOpen(false);
                              }}
                            />
                            <motion.div
                              key="task-menu-home"
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
                                  setIsTaskMenuOpen(false);
                                  setSelectedTask(null);
                                  setIsDescriptionModalOpen(false);
                                  onNavigate("roadmap");
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsTaskMenuOpen(false);
                                  addTask({
                                    title: `${selectedTask.title || ""} • Cópia`,
                                    description: selectedTask.description || "",
                                    category: selectedTask.category || "",
                                    priority: selectedTask.priority || "",
                                    effort: selectedTask.effort || "",
                                  } as any);
                                  setSelectedTask(null);
                                  setIsDescriptionModalOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer"
                              >
                                Duplicar
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsTaskMenuOpen(false);
                                  deleteTask(selectedTask.id);
                                  setSelectedTask(null);
                                  setIsDescriptionModalOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer"
                              >
                                Excluir
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
                                className="text-[#ff3838] text-[14px] font-bold ml-1"
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
                    {selectedTask.endTime && selectedTask.endTime.trim() !== "" && (
                      <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                        <span className="text-[14px] font-normal text-[#73777d] shrink-0">Horário de término:</span>
                        <span className="text-[14px] font-normal text-white truncate">{selectedTask.endTime}</span>
                      </div>
                    )}

                    {selectedTask.reminderEnabled && selectedTask.reminderTime && selectedTask.reminderTime !== "Nenhum" && (
                      <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                        <span className="text-[14px] font-normal text-[#73777d] shrink-0">Lembrete:</span>
                        <span className="text-[14px] font-normal text-white truncate">
                          {selectedTask.reminderTime === 'Personalizado' && selectedTask.reminderCustomMinutes 
                            ? `${selectedTask.reminderCustomMinutes} min antes` 
                            : selectedTask.reminderTime}
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
          <motion.div key="descModal" 
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
                
                <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 -mx-2 px-2 pt-4 pb-12">
                  <p className="text-[14px] text-white leading-relaxed font-normal whitespace-pre-wrap">
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
                  {/* Bottom Nav */}
      <div className="absolute -bottom-[2px] left-0 right-0 h-[90px] pb-[2px] bg-[#313131] rounded-t-[35px] px-6 flex justify-between items-center z-50">
        <button
          onClick={() => onNavigate?.("home")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px]"
        >
          <img src="https://i.ibb.co/BV2ZD0Ws/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-170809-0000.png" alt="Início" className="w-[26px] h-[26px] object-contain pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" />
          <span className="text-[10px] font-bold text-[#aaaaaa] text-center leading-none mt-0.5">Início</span>
        </button>

        <button
          onClick={() => onNavigate?.("roadmap")}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] hover:opacity-80 transition"
        >
          <img src="https://i.ibb.co/FqbdJ8MT/Picsart-26-07-22-22-47-11-226.png" alt="Tarefas" className="w-[28px] h-[28px] object-contain translate-y-[1px] pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" />
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

      {/* Calendar Extra Screen Modal (Sliding from top) */}
      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div
            key="calendarModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 z-[300] flex flex-col justify-start overflow-hidden"
            onClick={() => setIsCalendarOpen(false)}
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0, transition: { type: "spring", damping: 24, stiffness: 200 } }}
              exit={{ y: "-100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
              className="bg-[#1f1f1f] w-full rounded-b-[30px] p-5 pt-7 border-b border-[#4f4f4f] flex flex-col relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Block to prevent top detachment during slide animation */}
              <div className="absolute bottom-[98%] left-0 right-0 h-[120px] bg-[#1f1f1f] pointer-events-none" />
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-white font-normal text-[20px]">Calendário</h3>
                <button
                  onClick={() => setIsCalendarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4 -rotate-90" />
                </button>
              </div>

              <div className="bg-[#2c2c2c] rounded-[24px] p-5">
                <div className="flex justify-between items-center mb-5">
                  <button
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                      } else {
                        setCurrentMonth(currentMonth - 1);
                      }
                    }}
                    className="p-2 bg-[#4f4f4f] hover:bg-[#5a5a5a] rounded-xl transition-colors text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="text-[16px] font-normal text-[#e8e8e9] capitalize">
                    {new Date(currentYear, currentMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </div>
                  <button
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                      } else {
                        setCurrentMonth(currentMonth + 1);
                      }
                    }}
                    className="p-2 bg-[#4f4f4f] hover:bg-[#5a5a5a] rounded-xl transition-colors text-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center mb-3">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <div key={`dow-${i}`} className="text-[12px] font-bold text-gray-400">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }).map((_, i) => {
                    const day = i + 1;
                    const isToday =
                      day === new Date().getDate() &&
                      currentMonth === new Date().getMonth() &&
                      currentYear === new Date().getFullYear();

                    return (
                      <div
                        key={day}
                        className="h-9 flex items-center justify-center"
                      >
                        <span
                          className={`w-8 h-8 rounded-[5px] text-[14px] font-medium flex items-center justify-center transition-all ${
                            isToday
                              ? 'bg-white text-black'
                              : 'text-[#e8e8e9] hover:bg-[#3d3d3d]'
                          }`}
                        >
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requisitos do Cronômetro Modal */}
      <AnimatePresence>
        {isRequirementsModalOpen && (
          <motion.div
            key="requirementsModalOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 z-[120] flex items-center justify-center px-6"
            onClick={(e) => {
              e.stopPropagation();
              setIsRequirementsModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsRequirementsModalOpen(false);
              }}
              className="bg-[#1f1f1f] w-full max-w-[340px] rounded-[14px] p-6 cursor-pointer"
            >
              <h3 className="text-white text-[18px] font-bold mb-0 text-center">Defina as datas e horários</h3>
              <p className="text-[#aaaaaa] text-sm text-center leading-snug mt-[-2px]">
                Para ativar o cronômetro automático, você precisa definir a data de início, horário de início, data final e horário final da tarefa.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
    </div>
  );
}
