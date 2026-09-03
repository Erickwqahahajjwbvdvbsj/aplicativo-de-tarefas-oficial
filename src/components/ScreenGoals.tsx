import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreVertical, ChevronDown, Crosshair, Target, CheckCircle2, Circle, Plus, X, ChevronRight, MessageCircle, CalendarDays, Home, User, CheckSquare, Search, Check, Trophy, Bot, Goal as GoalIcon , Rocket , ListTodo , NotepadText, ChevronLeft, Trash2, Edit2, Copy, Lock, Flag, Send, Loader2 } from 'lucide-react';
import { useGoals, Goal, GoalStage } from '../hooks/useGoals';
import { useTasks, Task } from '../hooks/useTasks';
import { POP_SOUND_DATA_URI } from '../assets/popSound';

const GOAL_COMPLETE_AUDIO_URL = "https://files.catbox.moe/jdkqtg.mp3";
const STAGE_TASK_AUDIO_URL = POP_SOUND_DATA_URI;

let sharedPopAudioBuffer: AudioBuffer | null = null;
let sharedPopAudioContext: AudioContext | null = null;

let sharedGoalAudioBuffer: AudioBuffer | null = null;
let sharedGoalAudioContext: AudioContext | null = null;

const dataUriToArrayBuffer = (dataUri: string): ArrayBuffer => {
  const base64 = dataUri.split(',')[1];
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const preloadPopAudio = async () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!sharedPopAudioContext) {
      sharedPopAudioContext = new AudioContextClass();
    }
    if (sharedPopAudioContext.state === 'suspended') {
      sharedPopAudioContext.resume().catch(() => {});
    }
    
    const arrayBuffer = dataUriToArrayBuffer(STAGE_TASK_AUDIO_URL);
    sharedPopAudioBuffer = await sharedPopAudioContext.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn('Failed to preload pop audio:', err);
  }
};

const preloadGoalAudio = async () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!sharedGoalAudioContext) {
      sharedGoalAudioContext = new AudioContextClass();
    }
    if (sharedGoalAudioContext.state === 'suspended') {
      sharedGoalAudioContext.resume().catch(() => {});
    }
    
    const response = await fetch(GOAL_COMPLETE_AUDIO_URL);
    const arrayBuffer = await response.arrayBuffer();
    sharedGoalAudioBuffer = await sharedGoalAudioContext.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn('Failed to preload goal audio:', err);
  }
};

const setupAudioUnlock = () => {
  if (typeof window === 'undefined') return;
  const unlock = () => {
    if (sharedPopAudioContext && sharedPopAudioContext.state === 'suspended') {
      sharedPopAudioContext.resume().catch(() => {});
    }
    if (!sharedPopAudioBuffer) {
      preloadPopAudio();
    }
    if (sharedGoalAudioContext && sharedGoalAudioContext.state === 'suspended') {
      sharedGoalAudioContext.resume().catch(() => {});
    }
    if (!sharedGoalAudioBuffer) {
      preloadGoalAudio();
    }
  };
  window.addEventListener('click', unlock, { passive: true });
  window.addEventListener('touchstart', unlock, { passive: true });
};

preloadPopAudio();
preloadGoalAudio();
setupAudioUnlock();

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


export function ScreenGoals({ onNavigate }: { onNavigate: (tab: 'roadmap' | 'home' | 'ai' | 'profile' | 'goals' | 'notifications' | 'notes') => void }) {
  const { goals, addGoal, deleteGoal, updateGoal } = useGoals();
  const { tasks, updateTask, deleteTask } = useTasks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
      const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [goalStages, setGoalStages] = useState<GoalStage[]>([]);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [openStageMenuId, setOpenStageMenuId] = useState<string | null>(null);
  const [isDeletingStageMenuId, setIsDeletingStageMenuId] = useState<string | null>(null);
    const [managingTasksForStageId, setManagingTasksForStageId] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isGoalMenuOpen, setIsGoalMenuOpen] = useState(false);
  const [isDeletingGoal, setIsDeletingGoal] = useState(false);
  const [isCompletingGoal, setIsCompletingGoal] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [openDetailCategory, setOpenDetailCategory] = useState<'start' | 'end' | 'stages' | 'tasks' | 'time' | null>(null);
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  const [goalDetailsView, setGoalDetailsView] = useState<'timeline' | 'details'>('timeline');
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [isTaskSelectionOpen, setIsTaskSelectionOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [stageUnlockNotification, setStageUnlockNotification] = useState<{ isFinal: boolean; id: string } | null>(null);
  const previousStageIdxRef = useRef<number | null>(null);
  const previousGoalIdRef = useRef<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fillingGoalIds, setFillingGoalIds] = useState<string[]>([]);
  const [slidingGoalIds, setSlidingGoalIds] = useState<string[]>([]);
  const [collapsingGoalIds, setCollapsingGoalIds] = useState<string[]>([]);
  const [newGoalStartDate, setNewGoalStartDate] = useState<string>('');
  const [newGoalEndDate, setNewGoalEndDate] = useState<string>('');
  const [newGoalEndTime, setNewGoalEndTime] = useState<string>('');
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);
  const [endCurrentMonth, setEndCurrentMonth] = useState(new Date().getMonth());
  const [endCurrentYear, setEndCurrentYear] = useState(new Date().getFullYear());
  const [newGoalStartTime, setNewGoalStartTime] = useState<string>('');
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingStageLoading, setIsAddingStageLoading] = useState(false);
  const [isAddingSubTaskLoading, setIsAddingSubTaskLoading] = useState(false);
  
  const playPopSound = () => {
    try {
      if (sharedPopAudioContext && sharedPopAudioBuffer) {
        if (sharedPopAudioContext.state === 'suspended') {
          sharedPopAudioContext.resume().catch(() => {});
        }
        const source = sharedPopAudioContext.createBufferSource();
        source.buffer = sharedPopAudioBuffer;
        
        const gainNode = sharedPopAudioContext.createGain();
        gainNode.gain.value = 0.9;
        source.connect(gainNode);
        gainNode.connect(sharedPopAudioContext.destination);
        
        source.start(0);
      } else {
        preloadPopAudio();
        const audio = new Audio(POP_SOUND_DATA_URI);
        audio.volume = 0.9;
        audio.play().catch(e => console.log('Audio error:', e));
      }
    } catch (e) { }
  };

  const playNotificationSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;
      
      const tones = [
        { freq: 659.25, start: 0, dur: 0.35, gain: 0.16 },
        { freq: 880, start: 0.09, dur: 0.55, gain: 0.2 },
        { freq: 1174.66, start: 0.18, dur: 0.7, gain: 0.22 }
      ];

      tones.forEach(({ freq, start, dur, gain: vol }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + start);

        gainNode.gain.setValueAtTime(0.0001, now + start);
        gainNode.gain.linearRampToValueAtTime(vol, now + start + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + dur);
      });
    } catch (err) { }
  };

  const playGoalCompleteSound = () => {
    try {
      if (sharedGoalAudioContext && sharedGoalAudioBuffer) {
        if (sharedGoalAudioContext.state === 'suspended') {
          sharedGoalAudioContext.resume().catch(() => {});
        }
        const source = sharedGoalAudioContext.createBufferSource();
        source.buffer = sharedGoalAudioBuffer;
        source.connect(sharedGoalAudioContext.destination);
        source.start(0);
      } else {
        preloadGoalAudio();
        const audio = new Audio(GOAL_COMPLETE_AUDIO_URL);
        audio.volume = 1;
        audio.play().catch(e => console.log('Audio error:', e));
      }
    } catch (err) { }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const allTasks = tasks;

  const resetAddModalState = () => {
    setIsDiscardModalOpen(false);
    setIsAddModalOpen(false);
    setIsEndPickerOpen(false);
    setIsEndDatePickerOpen(false);
    setIsEndTimePickerOpen(false);
    setIsStartDatePickerOpen(false);
    setIsStartTimePickerOpen(false);
    setIsTaskSelectionOpen(false);
    setEditingGoalId(null);
    setNewGoalTitle('');
    setNewGoalDescription('');
    setGoalStages([]);
    setEditingStageId(null);
    setManagingTasksForStageId(null);
    setOpenStageMenuId(null);
    setNewGoalStartDate('');
    setNewGoalStartTime('');
    setNewGoalEndDate('');
    setNewGoalEndTime('');
  };

  const handleCreateGoal = async () => {
    if (newGoalTitle.trim() && goalStages.length > 0 && newGoalStartDate !== '' && newGoalEndDate !== '') {
      setIsSaving(true);
      try {
        if (editingGoalId) {
          await updateGoal(editingGoalId, {
            title: newGoalTitle.trim(),
            description: newGoalDescription.trim(),
            stages: goalStages,
            startDate: newGoalStartDate,
            startTime: newGoalStartTime,
            endDate: newGoalEndDate,
            endTime: newGoalEndTime,
          });
        } else {
          await addGoal({
            title: newGoalTitle.trim(),
            description: newGoalDescription.trim(),
            stages: goalStages,
            startDate: newGoalStartDate,
            startTime: newGoalStartTime,
            endDate: newGoalEndDate,
            endTime: newGoalEndTime,
          });
        }
        setIsAddModalOpen(false);
        setIsEndPickerOpen(false);
        setIsEndDatePickerOpen(false);
        setIsEndTimePickerOpen(false);
        setIsStartDatePickerOpen(false);
        setIsStartTimePickerOpen(false);
        setIsTaskSelectionOpen(false);
        setNewGoalTitle('');
        setNewGoalDescription('');
        setGoalStages([]);
                  setEditingStageId(null);
        setNewGoalStartDate('');
        setNewGoalStartTime('');
        setNewGoalEndDate('');
        setNewGoalEndTime('');
        setEditingGoalId(null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSaving(false);
      }
    }
  };


  useEffect(() => {
    if (selectedGoal) {
      const firstIncompleteStageIdx = selectedGoal.stages?.findIndex(s => !s.tasks || s.tasks.length === 0 || s.tasks.some(t => !t.completed)) ?? -1;
      const currentStageIdx = firstIncompleteStageIdx === -1 ? (selectedGoal.stages?.length || 0) : firstIncompleteStageIdx;
      
      if (previousGoalIdRef.current === selectedGoal.id && previousStageIdxRef.current !== null && currentStageIdx > previousStageIdxRef.current) {
        const isFinal = currentStageIdx >= (selectedGoal.stages?.length || 0);
        setTimeout(() => {
          setStageUnlockNotification({
            isFinal,
            id: Date.now().toString(),
          });
          playNotificationSound();
        }, 350);
      }
      
      previousStageIdxRef.current = currentStageIdx;
      previousGoalIdRef.current = selectedGoal.id;
    } else {
      previousStageIdxRef.current = null;
      previousGoalIdRef.current = null;
    }
  }, [selectedGoal]);

  useEffect(() => {
    if (stageUnlockNotification) {
      const timer = setTimeout(() => {
        setStageUnlockNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [stageUnlockNotification]);

    const getTimestamp = (val: any, fallbackId?: string) => {
  if (!val) return fallbackId ? (parseInt(fallbackId) || 0) : 0;
  if (typeof val === 'string') return new Date(val).getTime();
  if (typeof val === 'number') return val;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val.seconds === 'number') return val.seconds * 1000;
  return fallbackId ? (parseInt(fallbackId) || 0) : 0;
};
  const getStableGoalNumber = (goalId: string) => {
    const goalsByCreation = [...goals].sort((a, b) => {
      const timeA = getTimestamp(a.createdAt, a.id);
      const timeB = getTimestamp(b.createdAt, b.id);
      return timeA - timeB;
    });
    const index = goalsByCreation.findIndex(g => g.id === goalId);
    return String(index + 1).padStart(2, '0');
  };

  const filteredGoals = goals.filter(goal => !goal.completed && goal.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full h-full bg-[#1f1f1f] relative font-sans overflow-hidden flex flex-col">
      <div className="w-full pt-4 px-4 pb-4 flex items-center justify-between z-30 shrink-0 h-[74px] relative bg-[#1f1f1f] border-b border-white/5" style={{ backgroundColor: '#1f1f1f' }}>
        <div className={`flex items-center gap-3 transition-opacity ${isSearchOpen ? 'opacity-0 pointer-events-none duration-150 ease-out' : 'opacity-100 pointer-events-auto duration-300 ease-in'}`}>
          <h1 className="text-white text-[20px] font-bold leading-tight tracking-tight ">
            Seus objetivos
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
                  setTimeout(() => document.getElementById('goals-search-input')?.focus(), 100);
                } else if (searchQuery.trim() !== '') {
                  // search action if needed
                } else {
                  document.getElementById('goals-search-input')?.focus();
                }
              }}
              className={`absolute left-0 w-[42px] h-[42px] flex items-center justify-center text-[#aaaaaa] outline-none focus:ring-0 focus:border-transparent z-20 transition-transform duration-300 active:scale-90 ${isSearchOpen ? 'pointer-events-auto' : 'pointer-events-auto'}`}
            >
              <Search className="w-[22px] h-[22px] text-[#aaaaaa]" />
            </button>

            {/* Input Field */}
            <input 
              id="goals-search-input"
              type="text" 
              placeholder="Buscar objetivos" 
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

      <div className="flex-1 overflow-y-auto no-scrollbar pt-8 px-4 pb-44 flex flex-col">
        {filteredGoals.length === 0 && isSearchOpen && (
          <div className="text-center text-[13px] font-medium text-[#73777d] py-10 px-6 mt-[70px]">
            Nenhum objetivo encontrado.
          </div>
        )}
        {filteredGoals.length === 0 && !isSearchOpen && (
          <div className="text-center text-[14px] font-medium text-[#73777d] py-10 px-6 mt-[70px]">
            Não há nenhum objetivo adicionado.
          </div>
        )}
        {filteredGoals.map(goal => {
            const allStagesTasks = goal.stages?.flatMap(s => s.tasks) || [];
            const completedCount = allStagesTasks.filter(t => t.completed).length;
            const totalCount = allStagesTasks.length;
            const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            

            return (
              <div 
                key={goal.id} 
                className={`transition-all duration-500 ease-in-out ${collapsingGoalIds.includes(goal.id) ? 'max-h-0 opacity-0 mb-0 overflow-hidden' : 'max-h-[500px] opacity-100 mb-2.5'}`}
              >
                <div 
                  className={`w-full bg-[#282828] hover:bg-[#343434] hover:border-[#4f4f4f]/40 border border-transparent rounded-[7px] px-4 py-3.5 cursor-pointer relative group transition-all duration-300 ease-out flex-shrink-0 ${slidingGoalIds.includes(goal.id) ? 'opacity-0 translate-x-[150%] scale-95' : 'opacity-100 translate-x-0 scale-100'}`}
                  onClick={() => {
                    setSelectedGoal(goal);
                    setExpandedStages({});
                    setGoalDetailsView('timeline');
                  }}
                >
                      
                  <div className="flex items-center justify-between gap-3 mb-1.5 relative min-h-[28px]">
                        <h3 className="text-white font-bold text-[17px] leading-snug break-words flex-1 min-w-0">
                          Objetivo {getStableGoalNumber(goal.id)}
                        </h3>
                        
                      </div>
                                    <div>
                    <div className="text-[#cfcfcf] text-[14px] leading-relaxed line-clamp-5 break-words">
                      {goal.title}
                    </div>                                      
                  </div>
                </div>
                
              </div>
            );
          })}

      </div>

      {/* FAB (Speed Dial) */}
      <AnimatePresence initial={false}>
        {!isAddModalOpen && (
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
                setIsAddModalOpen(true);
              }}
              className="w-14 h-14 rounded-[13px] bg-[#ff3838] flex items-center justify-center shadow-lg relative"
            >
              <div className="w-full h-full flex items-center justify-center absolute inset-0">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      
            

      {/* Selected Goal Modal */}
      <AnimatePresence>
        {selectedGoal && (() => {
          const allTasks = selectedGoal.stages?.flatMap(s => s.tasks || []) || [];
          const completedCount = allTasks.filter(t => t.completed).length;
          const totalCount = allTasks.length;
          const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
          const allTasksCompleted = completedCount === totalCount && totalCount > 0;
          
          const pendingCount = totalCount - completedCount;
          
          const firstIncompleteStageIdx = selectedGoal.stages?.findIndex(s => !s.tasks || s.tasks.length === 0 || s.tasks.some(t => !t.completed)) ?? -1;
          const totalStagesCount = selectedGoal.stages?.length || 0;
          const completedStagesCount = firstIncompleteStageIdx === -1 ? totalStagesCount : firstIncompleteStageIdx;
          const pendingStagesCount = totalStagesCount - completedStagesCount;

          let daysRemainingText = "Não definido";
          if (selectedGoal.endDate) {
            const endDateTime = new Date(`${selectedGoal.endDate}T${selectedGoal.endTime || '23:59:59'}`);
            const now = new Date();
            const diffTime = endDateTime.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
              daysRemainingText = `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
            } else if (diffDays === 0) {
              daysRemainingText = "Vence hoje";
            } else {
              daysRemainingText = "Atrasado";
            }
          }

          let daysInProgressText = "Não definido";
          let daysInProgress = 0;

          if (selectedGoal.startDate) {
            const startDateTime = new Date(`${selectedGoal.startDate}T${selectedGoal.startTime || '00:00:00'}`);
            const now = new Date();
            const diffTime = now.getTime() - startDateTime.getTime();
            daysInProgress = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (daysInProgress < 0) daysInProgress = 0;
            daysInProgressText = `${daysInProgress} dia${daysInProgress !== 1 ? 's' : ''}`;
          } else if (selectedGoal.createdAt) {
            const startDateTime = selectedGoal.createdAt?.toDate ? selectedGoal.createdAt.toDate() : new Date(selectedGoal.createdAt);
            if (!isNaN(startDateTime.getTime())) {
              const now = new Date();
              const diffTime = now.getTime() - startDateTime.getTime();
              daysInProgress = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              if (daysInProgress < 0) daysInProgress = 0;
              daysInProgressText = `${daysInProgress} dia${daysInProgress !== 1 ? 's' : ''}`;
            }
          }

          return (
            <motion.div key="selectedGoalModal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 z-[100] flex flex-col justify-end overflow-hidden"
              onClick={(e) => { 
                e.stopPropagation();
                if (stageUnlockNotification) return; // Trava enquanto a notificação estiver ativa na tela
                if (isDescriptionModalOpen) {
                  setIsDescriptionModalOpen(false);
                } else if (openDetailCategory) {
                  setOpenDetailCategory(null);
                } else {
                  setSelectedGoal(null); 
                }
              }}
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ 
                  y: (isDescriptionModalOpen || openDetailCategory) ? "100%" : 0, 
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
                  <div className="flex justify-between items-center shrink-0 mt-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[22px] font-normal text-white leading-tight truncate">
                        {goalDetailsView === 'details' ? "Detalhes da sua jornada" : "Sua jornada"}
                      </h3>
                    </div>

                    {/* 3-Dots Menu Button */}
                    <div className="relative shrink-0 ml-3 -mr-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsGoalMenuOpen(!isGoalMenuOpen);
                        }}
                        className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[#cfcfcf] hover:text-white hover:bg-white/10 transition cursor-pointer"
                        title="Opções"
                      >
                        <MoreVertical className="w-[20px] h-[20px] text-[#cfcfcf]" />
                      </button>

                      {/* Floating Menu Popup */}
                      <AnimatePresence>
                        {isGoalMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40 cursor-default"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isDeletingGoal || isCompletingGoal) return;
                                setIsGoalMenuOpen(false);
                              }}
                            />
                            <motion.div
                              key="goal-menu-pop"
                              initial={{ opacity: 0, scale: 0.92, y: -6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.92, y: -6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-1.5 top-10 bg-[#282828] border border-[#4f4f4f] rounded-[16px] p-1.5 z-50 flex flex-col min-w-[160px]"
                            >
                              <button
                                type="button"
                                disabled={isDeletingGoal || isCompletingGoal}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isDeletingGoal || isCompletingGoal) return;
                                  updateGoal(selectedGoal.id, { isPinned: !selectedGoal.isPinned, pinnedAt: new Date().toISOString() });
                                  setIsGoalMenuOpen(false);
                                  setSelectedGoal(null);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer"
                              >
                                {selectedGoal.isPinned ? "Desfixar objetivo" : "Fixar objetivo"}
                              </button>
                              <button
                                type="button"
                                disabled={isDeletingGoal || isCompletingGoal}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isDeletingGoal || isCompletingGoal) return;
                                  setGoalDetailsView(goalDetailsView === 'timeline' ? 'details' : 'timeline');
                                  setIsGoalMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer"
                              >
                                {goalDetailsView === 'timeline' ? 'Detalhes' : 'Jornada'}
                              </button>
                              <button
                                type="button"
                                disabled={isDeletingGoal || isCompletingGoal}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isDeletingGoal || isCompletingGoal) return;
                                  setIsCompletingGoal(true);
                                  setTimeout(async () => {
                                    const goalIdToDelete = selectedGoal.id;
                                    await deleteGoal(goalIdToDelete);
                                    setIsCompletingGoal(false);
                                    setIsGoalMenuOpen(false);
                                    setSelectedGoal(null);
                                  }, 2000);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer flex items-center justify-start min-h-[36px]"
                              >
                                {isCompletingGoal ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                                  </div>
                                ) : (
                                  "Concluir"
                                )}
                              </button>
                              
                              <button
                                type="button"
                                disabled={isDeletingGoal || isCompletingGoal}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isDeletingGoal || isCompletingGoal) return;
                                  setIsGoalMenuOpen(false);
                                  setNewGoalTitle(selectedGoal.title);
                                  setGoalStages(selectedGoal.stages || []);
                                  setNewGoalStartDate(selectedGoal.startDate || '');
                                  setNewGoalStartTime(selectedGoal.startTime || '');
                                  setNewGoalEndDate(selectedGoal.endDate || '');
                                  setNewGoalEndTime(selectedGoal.endTime || '');
                                  setNewGoalDescription(selectedGoal.description || '');
                                  setEditingGoalId(selectedGoal.id);
                                  setSelectedGoal(null);
                                  setIsAddModalOpen(true);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                disabled={isDeletingGoal || isCompletingGoal}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isDeletingGoal || isCompletingGoal) return;
                                  setIsDeletingGoal(true);
                                  setTimeout(async () => {
                                    const goalIdToDelete = selectedGoal.id;
                                    await deleteGoal(goalIdToDelete);
                                    setIsDeletingGoal(false);
                                    setIsGoalMenuOpen(false);
                                    setSelectedGoal(null);
                                  }, 2000);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-[#383838] transition cursor-pointer flex items-center justify-start min-h-[36px]"
                              >
                                {isDeletingGoal ? (
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
                  {/* Progress bar removed as requested */}
                  
                  {selectedGoal.description && selectedGoal.description.trim() !== "" && (
                    <div className="flex flex-col mt-3">
                      <span className="text-[14px] font-normal text-[#73777d] mb-1">Descrição:</span>
                      <div className="relative">
                        <p className="text-[14px] text-white leading-relaxed font-normal">
                          {selectedGoal.description.length > 120 ? (
                            <>
                              {selectedGoal.description.substring(0, 120)}...
                              <button 
                                onClick={() => setIsDescriptionModalOpen(true)}
                                className="text-[#ff3838] text-[14px] font-normal ml-1"
                              >
                                Expandir descrição
                              </button>
                            </>
                          ) : (
                            selectedGoal.description
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                                {/* Scrollable Content */}
                <div className="flex-1 relative overflow-hidden flex -mx-6">
                  
                  {/* Timeline View */}
                  <motion.div
                    initial={false}
                    animate={{ x: goalDetailsView === 'timeline' ? '0%' : '-100%' }}
                    transition={{ type: 'spring', damping: 24, stiffness: 200 }}
                    className="w-full shrink-0 h-full overflow-y-auto no-scrollbar relative z-10 px-6 pt-4 pb-12"
                  >
                    <div className="flex flex-col relative pb-2">

                      
                      {(!selectedGoal.stages || selectedGoal.stages.length === 0) && (
                         <div className="text-center text-[#73777d] text-[14px] py-8">Nenhuma etapa adicionada.</div>
                      )}

                      {(() => {
                        const firstIncompleteStageIdx = selectedGoal.stages?.findIndex(s => !s.tasks || s.tasks.length === 0 || s.tasks.some(t => !t.completed)) ?? -1;
                        const currentStageIdx = firstIncompleteStageIdx === -1 ? (selectedGoal.stages?.length || 0) : firstIncompleteStageIdx;

                        return selectedGoal.stages?.map((stage, idx) => {
                          const tasksCount = stage.tasks?.length || 0;
                          const completedTasksCount = stage.tasks?.filter(t => t.completed).length || 0;
                          const progressPercentage = tasksCount > 0 ? (completedTasksCount / tasksCount) * 100 : 0;
                          
                          const isCompleted = idx < currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          const isLocked = idx > currentStageIdx;
                          
                          const isExpanded = expandedStages[stage.id] !== undefined ? expandedStages[stage.id] : isCurrent;
                          
                          const hasTasks = isExpanded && stage.tasks && stage.tasks.length > 0;
                          return (
                          <div key={stage.id} className={`relative min-h-[110px] ${hasTasks ? 'pb-0' : 'pb-6'}`}>
                            {/* Vertical Line to next stage */}
                            <div 
                              className="absolute w-0.5 bg-[#555555] z-0 overflow-hidden"
                              style={{ left: '8.5px', top: '16px', bottom: idx === (selectedGoal.stages?.length || 0) - 1 ? '-6px' : '-16px' }}
                            >
                              <div 
                                className="w-full bg-[#dadada] transition-all duration-500 ease-in-out origin-top"
                                style={{ height: isCompleted ? '100%' : (isCurrent ? `${progressPercentage}%` : '0%') }}
                              />
                            </div>
                            {/* Timeline Dot & Stage Title */}
                            <div 
                               className="flex items-center gap-4 relative z-10 pt-1 cursor-pointer select-none group"
                               onClick={() => {
                                  setExpandedStages(prev => {
                                     const currentlyExpanded = prev[stage.id] !== undefined ? prev[stage.id] : isCurrent;
                                     return { ...prev, [stage.id]: !currentlyExpanded };
                                  });
                               }}
                            >
                              <div className="relative w-[19px] h-[19px] shrink-0 flex items-center justify-center bg-[#1f1f1f] rounded-full z-10">
                                <AnimatePresence mode="wait">
                                  {isLocked ? (
                                    <motion.div
                                      key="lock"
                                      initial={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="absolute flex items-center justify-center bg-[#1f1f1f] w-[28px] h-[28px] rounded-full"
                                    >
                                      <img src="https://i.ibb.co/RkjZrzH6/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260819-132338-0000.png" alt="Bloqueada" className="absolute max-w-none w-[33px] h-[33px] object-contain pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" />
                                    </motion.div>
                                  ) : (
                                    <motion.div 
                                      key="dot"
                                      initial={{ scale: 0, opacity: 0 }} 
                                      animate={{ scale: 1, opacity: 1 }} 
                                      transition={{ duration: 0.3 }}
                                      className="absolute inset-0 rounded-full bg-[#dadada] flex items-center justify-center"
                                    >
                                      {isCompleted && <Check className="w-3 h-3 text-[#1f1f1f]" strokeWidth={4} />}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <span className={`font-normal text-[17px] leading-[22px] transition-colors flex items-center gap-2 ${isLocked ? 'text-[#555555]' : 'text-[#dadada]'}`}>
                                Etapa {idx + 1}
                                <ChevronRight className={`w-4 h-4 ${isLocked ? 'text-[#555555]' : 'text-[#dadada]'} transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </span>
                            </div>
                            
                            {/* Stage Content */}
                            <div className="pl-9 flex flex-col gap-1 mt-0">
                              {(stage.title || stage.description) && (
                                <div className="pt-0.5 pb-0 flex flex-col gap-1">
                                  {stage.title && <p className={`font-normal text-[15px] leading-[22px] whitespace-normal break-words ${isLocked ? 'text-[#555555]' : 'text-[#dadada]'}`}>{stage.title}</p>}
                                  {stage.description && <span className={`text-[14px] whitespace-normal break-words ${isLocked ? 'text-[#555555]' : 'text-[#a0a0a0]'}`}>{stage.description}</span>}
                                </div>
                              )}
                              
                              <AnimatePresence initial={false}>
                                {isExpanded && stage.tasks && stage.tasks.length > 0 && (
                                  <motion.div 
                                     initial={{ height: 0, opacity: 0 }}
                                     animate={{ height: 'auto', opacity: 1 }}
                                     exit={{ height: 0, opacity: 0 }}
                                     transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                     className="overflow-hidden"
                                  >
                                    {/* Tasks inside stage */}
                                    <div className="flex flex-col gap-3 mt-[18px] mb-[18px] pl-0">
                                      {stage.tasks.map((t, taskIdx) => (
                                          <motion.div 
                                              key={t.id} 
                                              initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                              animate={{ opacity: 1, y: 0, scale: 1 }}
                                              transition={{ duration: 0.22, delay: taskIdx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                              className={`flex items-start gap-3 ${isLocked || t.completed ? 'cursor-default' : 'cursor-pointer group'}`} 
                                              onClick={(e) => {
                                              e.stopPropagation();
                                              if (isLocked || t.completed) return;
                                              playPopSound();
                                              
                                              setSelectedGoal(prev => {
                                                if (!prev) return prev;
                                                const newStages = prev.stages?.map(s => s.id === stage.id ? { ...s, tasks: s.tasks.map(task => task.id === t.id ? { ...task, completed: true, completedAt: new Date().toISOString() } : task) } : s) || [];
                                                
                                                updateGoal(prev.id, { stages: newStages });
                                                
                                                const currentStage = newStages.find(s => s.id === stage.id);
                                                const stageNowCompleted = currentStage?.tasks.every(task => task.completed);
                                                
                                                if (stageNowCompleted) {
                                                  setExpandedStages(prevExpanded => {
                                                    const nextState = { ...prevExpanded, [stage.id]: false };
                                                    const nextStage = newStages[idx + 1];
                                                    if (nextStage) {
                                                      delete nextState[nextStage.id];
                                                    }
                                                    return nextState;
                                                  });
                                                } else if (isCompleted) {
                                                  setExpandedStages(prevExpanded => ({ ...prevExpanded, [stage.id]: false }));
                                                }
                                                
                                                return { ...prev, stages: newStages };
                                              });
                                          }}>
                                              <div className={`w-[18px] h-[18px] rounded-full border ${t.completed ? 'bg-[#dadada] border-[#dadada]' : (isLocked ? 'border-[#555555]' : 'border-[#cfcfcf] group-hover:bg-[#dadada]/10')} flex items-center justify-center shrink-0 transition-colors mt-[1px]`}>
                                                <Check className={`w-3 h-3 ${t.completed ? 'text-[#1f1f1f] opacity-100' : 'text-[#dadada] opacity-0'} transition-opacity`} strokeWidth={3} />
                                              </div>
                                              <span className={`text-[15px] leading-[22px] flex-1 whitespace-normal break-words transition-colors ${isLocked ? 'text-[#555555]' : 'text-[#dadada]'}`}>{t.title}</span>
                                          </motion.div>
                                        ))}
                                      </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        );
                        });
                      })()}

                      {(() => {
                        if (!selectedGoal.stages || selectedGoal.stages.length === 0) return null;
                        const isGoalCompleted = selectedGoal.stages.findIndex(s => !s.tasks || s.tasks.length === 0 || s.tasks.some(t => !t.completed)) === -1;
                        return (
                          <div className="relative min-h-[70px] pb-4">
                            <div className="flex items-center gap-4 relative z-10 pt-1 select-none">
                              <div className="relative w-[19px] h-[19px] shrink-0 flex items-center justify-center bg-[#1f1f1f] rounded-full z-10">
                                <AnimatePresence mode="wait">
                                  {!isGoalCompleted ? (
                                    <motion.div
                                      key="final-lock"
                                      initial={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="absolute flex items-center justify-center bg-[#1f1f1f] w-[28px] h-[28px] rounded-full"
                                    >
                                      <img src="https://i.ibb.co/RkjZrzH6/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260819-132338-0000.png" alt="Bloqueada" className="absolute max-w-none w-[33px] h-[33px] object-contain pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" />
                                    </motion.div>
                                  ) : (
                                    <motion.div 
                                      key="final-dot-complete"
                                      initial={{ scale: 0, opacity: 0 }} 
                                      animate={{ scale: 1, opacity: 1 }} 
                                      transition={{ duration: 0.3 }}
                                      className="absolute inset-0 rounded-full bg-[#dadada] flex items-center justify-center"
                                    >
                                      <Check className="w-3 h-3 text-[#1f1f1f]" strokeWidth={4} />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <span className={`font-bold text-[17px] leading-[22px] transition-colors flex items-center gap-2 ${isGoalCompleted ? 'text-[#dadada]' : 'text-[#555555]'}`}>
                                Objetivo Final
                              </span>
                            </div>
                            <div className="pl-9 flex flex-col gap-1 mt-0">
                              <div className="pt-0.5 pb-0 flex flex-col gap-1">
                                <p className={`font-normal text-[15px] leading-[22px] whitespace-normal break-words ${isGoalCompleted ? 'text-[#dadada]' : 'text-[#555555]'}`}>{selectedGoal.title}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>

                  {/* Details View */}
                  <motion.div
                    initial={false}
                    animate={{ x: goalDetailsView === 'timeline' ? '0%' : '-100%' }}
                    transition={{ type: 'spring', damping: 24, stiffness: 200 }}
                    className="w-full shrink-0 h-full overflow-y-auto no-scrollbar relative z-10 px-6 pt-4 pb-12"
                  >
                     <div className="flex flex-col gap-3 pb-2">
                       <button onClick={() => setOpenDetailCategory('start')} className="w-full bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center justify-between overflow-hidden shrink-0">
                         <span className="text-[14px] font-normal text-white shrink-0">Início do objetivo</span>
                         <ChevronRight className="w-4 h-4 text-white shrink-0" />
                       </button>

                       <button onClick={() => setOpenDetailCategory('end')} className="w-full bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center justify-between overflow-hidden shrink-0">
                         <span className="text-[14px] font-normal text-white shrink-0">Prazo final</span>
                         <ChevronRight className="w-4 h-4 text-white shrink-0" />
                       </button>

                       <button onClick={() => setOpenDetailCategory('time')} className="w-full bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center justify-between overflow-hidden shrink-0">
                         <span className="text-[14px] font-normal text-white shrink-0">Ritmo do objetivo</span>
                         <ChevronRight className="w-4 h-4 text-white shrink-0" />
                       </button>

                       <button onClick={() => setOpenDetailCategory('stages')} className="w-full bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center justify-between overflow-hidden shrink-0">
                         <span className="text-[14px] font-normal text-white shrink-0">Etapas</span>
                         <ChevronRight className="w-4 h-4 text-white shrink-0" />
                       </button>

                       <button onClick={() => setOpenDetailCategory('tasks')} className="w-full bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center justify-between overflow-hidden shrink-0">
                         <span className="text-[14px] font-normal text-white shrink-0">Tarefas</span>
                         <ChevronRight className="w-4 h-4 text-white shrink-0" />
                       </button>
                     </div>
                  </motion.div>
                </div>
              </motion.div>
                
              {/* Description Modal */}
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
                        Descrição do Objetivo
                      </h3>
                      <button onClick={() => setIsDescriptionModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pt-4 pb-12">
                      <p className="text-[15px] text-white leading-relaxed font-normal whitespace-pre-wrap">
                        {selectedGoal.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category Details Modal */}
              <AnimatePresence>
                {openDetailCategory && (
                  <motion.div
                    key="categoryModal"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
                    transition={{ type: "spring", damping: 24, stiffness: 200 }}
                    className="absolute -bottom-[100px] pb-[100px] left-0 w-full z-[110]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Extra background block extending down to prevent detachment during spring bounce */}
                    <div className="absolute top-[50%] left-0 right-0 h-[500px] bg-[#1f1f1f] pointer-events-none" />

                    <div className="w-full h-[75vh] max-h-[90vh] flex flex-col bg-[#1f1f1f] rounded-t-[30px] border-t border-[#4f4f4f] overflow-hidden relative">
                      <div className="flex items-center justify-between p-6 shrink-0 border-b border-white/[0.04] relative z-20 bg-[#1f1f1f]">
                        <h3 className="text-white font-normal text-[20px]">
                          {openDetailCategory === 'time' ? 'Ritmo do objetivo' : openDetailCategory === 'start' ? 'Início do objetivo' : openDetailCategory === 'end' ? 'Prazo final' : openDetailCategory === 'stages' ? 'Etapas' : 'Tarefas'}
                        </h3>
                        <button onClick={() => setOpenDetailCategory(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        </button>
                      </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-6 pt-4 pb-12">
                      <div className="flex flex-col gap-3">
                        {openDetailCategory === 'time' && (
                          <>
                           <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                             <span className="text-[14px] font-normal text-[#73777d] shrink-0">Dias em andamento:</span>
                             <span className="text-[14px] font-normal text-white truncate">
                               {daysInProgressText}
                             </span>
                           </div>
                           <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                             <span className="text-[14px] font-normal text-[#73777d] shrink-0">Dias restantes:</span>
                             <span className="text-[14px] font-normal text-white truncate">
                               {daysRemainingText}
                             </span>
                           </div>
                          </>
                        )}
                        {openDetailCategory === 'start' && (
                          <>
                           <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                             <span className="text-[14px] font-normal text-[#73777d] shrink-0">Data de início:</span>
                             <span className="text-[14px] font-normal text-white truncate">
                               {selectedGoal.startDate ? new Date(selectedGoal.startDate + 'T12:00:00').toLocaleDateString('pt-BR') : "Não definido"}
                             </span>
                           </div>
                           {selectedGoal.startTime && selectedGoal.startTime.trim() !== "" && (
                             <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                               <span className="text-[14px] font-normal text-[#73777d] shrink-0">Horário de início:</span>
                               <span className="text-[14px] font-normal text-white truncate">{selectedGoal.startTime}</span>
                             </div>
                           )}
                          </>
                        )}
                        {openDetailCategory === 'end' && (
                          <>
                           <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                             <span className="text-[14px] font-normal text-[#73777d] shrink-0">Data de término:</span>
                             <span className="text-[14px] font-normal text-white truncate">
                               {selectedGoal.endDate ? new Date(selectedGoal.endDate + 'T12:00:00').toLocaleDateString('pt-BR') : "Não definido"}
                             </span>
                           </div>
                           {selectedGoal.endTime && selectedGoal.endTime.trim() !== "" && (
                             <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                               <span className="text-[14px] font-normal text-[#73777d] shrink-0">Horário de término:</span>
                               <span className="text-[14px] font-normal text-white truncate">{selectedGoal.endTime}</span>
                             </div>
                           )}
                          </>
                        )}
                        {openDetailCategory === 'stages' && (
                          <>
                           <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                             <span className="text-[14px] font-normal text-[#73777d] shrink-0">Total de etapas:</span>
                             <span className="text-[14px] font-normal text-white truncate">
                               {totalStagesCount}
                             </span>
                           </div>
                           <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                             <span className="text-[14px] font-normal text-[#73777d] shrink-0">Etapas concluídas:</span>
                             <span className="text-[14px] font-normal text-white truncate">
                               {completedStagesCount}
                             </span>
                           </div>
                           <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                             <span className="text-[14px] font-normal text-[#73777d] shrink-0">Etapas pendentes:</span>
                             <span className="text-[14px] font-normal text-white truncate">
                               {pendingStagesCount}
                             </span>
                           </div>
                          </>
                        )}
                        {openDetailCategory === 'tasks' && (
                          <>
                           <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                             <span className="text-[14px] font-normal text-[#73777d] shrink-0">Total de tarefas:</span>
                             <span className="text-[14px] font-normal text-white truncate">
                               {totalCount}
                             </span>
                           </div>
                           <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                             <span className="text-[14px] font-normal text-[#73777d] shrink-0">Tarefas concluídas:</span>
                             <span className="text-[14px] font-normal text-white truncate">
                               {completedCount}
                             </span>
                           </div>
                           <div className="bg-[#2c2c2c] rounded-[14px] min-h-[48px] px-5 flex items-center gap-1.5 overflow-hidden shrink-0">
                             <span className="text-[14px] font-normal text-[#73777d] shrink-0">Tarefas pendentes:</span>
                             <span className="text-[14px] font-normal text-white truncate">
                               {pendingCount}
                             </span>
                           </div>
                          </>
                        )}
                      </div>
                    </div>
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
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] hover:opacity-80 transition"
        >
          <img src="https://i.ibb.co/JNnKTWq/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-170502-0000.png" alt="Início" className="w-[26px] h-[26px] object-contain pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" />
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
          className="flex flex-col items-center justify-center gap-1 min-w-[56px]"
        >
          <img src="https://i.ibb.co/93y6xTwJ/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-171109-0000.png" alt="Objetivos" className="w-[26px] h-[26px] object-contain pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" />
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

      {/* Add Goal Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div key="isAddModalOpenModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 bg-black/80 z-[100] flex flex-col justify-end overflow-hidden font-sans ${isDiscardModalOpen ? 'pointer-events-none' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (isDiscardModalOpen || !isAddModalOpen || isSaving) return;
              if (openStageMenuId) {
                setOpenStageMenuId(null);
              } else if (managingTasksForStageId) {
                setGoalStages(goalStages.map(s => s.id === managingTasksForStageId ? { ...s, tasks: s.tasks.filter(t => t.title.trim() !== '') } : s));
                setManagingTasksForStageId(null);
              } else if (editingStageId) {
                setEditingStageId(null);
              } else if (isTaskSelectionOpen) {
                setIsTaskSelectionOpen(false);
              } else if (isStartPickerOpen) {
                setIsStartPickerOpen(false);
              } else if (isStartDatePickerOpen) {
                setIsStartDatePickerOpen(false);
                setIsStartPickerOpen(true);
              } else if (isStartTimePickerOpen) {
                setIsStartTimePickerOpen(false);
                setIsStartPickerOpen(true);
              } else if (isEndPickerOpen) {
                setIsEndPickerOpen(false);
              } else if (isEndDatePickerOpen) {
                setIsEndDatePickerOpen(false);
                setIsEndPickerOpen(true);
              } else if (isEndTimePickerOpen) {
                setIsEndTimePickerOpen(false);
                setIsEndPickerOpen(true);
              } else {
                let hasChanges = false;
                if (editingGoalId) {
                  const originalGoal = goals.find(g => g.id === editingGoalId);
                  if (originalGoal) {
                    const titleChanged = newGoalTitle.trim() !== originalGoal.title;
                    const descriptionChanged = newGoalDescription.trim() !== (originalGoal.description || '');
                    const tasksChanged = JSON.stringify(goalStages) !== JSON.stringify(originalGoal.stages);
                    const startDateChanged = newGoalStartDate !== (originalGoal.startDate || '');
                    const startTimeChanged = newGoalStartTime !== (originalGoal.startTime || '');
                    const endDateChanged = newGoalEndDate !== (originalGoal.endDate || '');
                    const endTimeChanged = newGoalEndTime !== (originalGoal.endTime || '');
                    hasChanges = titleChanged || descriptionChanged || tasksChanged || startDateChanged || startTimeChanged || endDateChanged || endTimeChanged;
                  }
                } else {
                  hasChanges = newGoalTitle.trim() !== '' || newGoalDescription.trim() !== '' || goalStages.length > 0 || newGoalStartDate !== '' || newGoalStartTime !== '' || newGoalEndDate !== '' || newGoalEndTime !== '';
                }
                
                if (hasChanges) {
                  setIsDiscardModalOpen(true);
                } else {
                  resetAddModalState();
                }
              }
            }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: (isTaskSelectionOpen || isStartPickerOpen || isStartDatePickerOpen || isStartTimePickerOpen || isEndPickerOpen || isEndDatePickerOpen || isEndTimePickerOpen || editingStageId !== null || managingTasksForStageId !== null ) ? "100%" : 0, transition: { type: "spring", damping: 24, stiffness: 200 } }}
              exit={{ 
                y: "100%",
                transition: { type: "spring", damping: 24, stiffness: 200 }
              }}
              className="bg-[#1f1f1f] w-full max-h-[90vh] rounded-t-[40px] p-6 flex flex-col gap-4 relative z-40 border-t border-[#4f4f4f] -mb-[100px] pb-[140px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Extra background block to prevent detachment during the spring bounce */}
              <div className="absolute top-[98%] left-0 right-0 h-[100px] bg-[#1f1f1f] pointer-events-none" />

                            <div className="flex flex-col gap-4 pb-0 no-scrollbar w-full">
                <input
                  type="text"
                  maxLength={100}
                  placeholder="Qual é o seu objetivo? máx. 100 caracteres"
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 py-4 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d]"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                />
                
                <textarea
                  placeholder="Adicione uma descrição para o seu objetivo..."
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 py-4 text-[14px] text-[#e8e8e9] h-[100px] resize-none outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d] no-scrollbar"
                  value={newGoalDescription}
                  onChange={(e) => setNewGoalDescription(e.target.value)}
                />

                <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory shrink-0 pb-2 -mx-6 px-6 scroll-px-6">
                  <button
                    onClick={() => {
                      setIsTaskSelectionOpen(true);
                      setIsStartDatePickerOpen(false);
                      setIsStartTimePickerOpen(false);
                      setIsEndDatePickerOpen(false);
                      setIsEndPickerOpen(false);
                      setIsEndTimePickerOpen(false);
                    }}
                    className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                  >
                    <span className="truncate mr-2">
                      {goalStages.length > 0 ? <span className="text-white">{goalStages.length === 1 ? "1 etapa" : `${goalStages.length} etapas`}</span> : <span className="text-[#73777d]">Criar etapas</span>}
                    </span>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${goalStages.length > 0 ? "text-white" : "text-[#73777d]"} ${isTaskSelectionOpen ? "rotate-90" : ""}`} />
                  </button>
                  <button 
                     onClick={() => {
                        setIsStartPickerOpen(!isStartPickerOpen);
                        setIsStartDatePickerOpen(false);
                        setIsStartTimePickerOpen(false);
                        setIsEndDatePickerOpen(false);
                        setIsEndPickerOpen(false);
                        setIsEndTimePickerOpen(false);
                     }}
                     className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                  >
                     <span className="truncate mr-2">{newGoalStartDate || newGoalStartTime ? <span className="text-white">{`${newGoalStartDate ? new Date(newGoalStartDate + 'T12:00:00').toLocaleDateString('pt-BR') : ''}${(newGoalStartDate && newGoalStartTime) ? ' às ' : ''}${newGoalStartTime || ''}`}</span> : <span className="text-[#73777d]">Início do Objetivo</span>}</span>
                     <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${newGoalStartDate || newGoalStartTime ? "text-white" : "text-[#73777d]"} ${isStartPickerOpen ? "rotate-90" : ""}`} />
                  </button>
                  <button 
                     onClick={() => {
                        setIsEndPickerOpen(!isEndPickerOpen);
                        setIsEndDatePickerOpen(false);
                        setIsEndTimePickerOpen(false);
                        setIsStartDatePickerOpen(false);
                        setIsStartPickerOpen(false);
                     }}
                     className="shrink-0 w-[200px] h-[56px] bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center snap-start"
                  >
                     <span className="truncate mr-2">{newGoalEndDate || newGoalEndTime ? <span className="text-white">{`${newGoalEndDate ? new Date(newGoalEndDate + 'T12:00:00').toLocaleDateString('pt-BR') : ''}${(newGoalEndDate && newGoalEndTime) ? ' às ' : ''}${newGoalEndTime || ''}`}</span> : <span className="text-[#73777d]">Prazo Final</span>}</span>
                     <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${newGoalEndDate || newGoalEndTime ? "text-white" : "text-[#73777d]"} ${isEndPickerOpen ? "rotate-90" : ""}`} />
                  </button>
                </div>

                <AnimatePresence>
                {newGoalTitle.trim() !== '' && goalStages.length > 0 && newGoalStartDate !== '' && newGoalEndDate !== '' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0, marginTop: -16 }}
                    animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 0 }}
                    exit={{ opacity: 0, y: 10, height: 0, marginTop: -16 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-2"
                  >
                    <SlideToSubmit 
                      onTrigger={handleCreateGoal}
                      disabled={isSaving}
                      text={editingGoalId ? 'Clique para salvar as alterações' : 'Clique para salvar o objetivo'}
                    />
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Picker Bottom Sheet (Combined) */}
      <AnimatePresence>
        {isStartPickerOpen && (
          <motion.div key="startPickerGoals"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] pt-6 px-6 z-[110] border-t border-[#4f4f4f]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-normal text-[20px]">Início do Objetivo</h3>
              <button onClick={() => setIsStartPickerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>
            <div className="flex flex-col gap-3 mb-8">
              <button 
                 onClick={() => {
                    setIsStartPickerOpen(false);
                    setIsStartDatePickerOpen(true);
                }}
                className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
              >
                <span className="truncate mr-2">
                    {newGoalStartDate ? <span className="text-white">{new Date(newGoalStartDate + 'T12:00:00').toLocaleDateString('pt-BR')}</span> : <span className="text-[#73777d]">Escolher Data de Início</span>}
                </span>
                <ChevronRight className={`w-4 h-4 shrink-0 ${newGoalStartDate ? "text-white" : "text-[#73777d]"}`} />
              </button>
              <button 
                 onClick={() => {
                    setIsStartPickerOpen(false);
                    setIsStartTimePickerOpen(true);
                }}
                className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
              >
                <span className="truncate mr-2">
                    {newGoalStartTime ? <span className="text-white">{newGoalStartTime}</span> : <span className="text-[#73777d]">Escolher Horário de Início</span>}
                </span>
                <ChevronRight className={`w-4 h-4 shrink-0 ${newGoalStartTime ? "text-white" : "text-[#73777d]"}`} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Date Picker Bottom Sheet */}
      <AnimatePresence>
        {isStartDatePickerOpen && (
          <motion.div key="isStartDatePickerOpenModal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] p-6 z-[110] border-t border-[#4f4f4f]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-normal text-[20px]">Data de Início</h3>
              <button onClick={() => { setIsStartDatePickerOpen(false); setIsStartPickerOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
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
                      const isSelected = newGoalStartDate === dateStr;
                      const today = new Date();
                      today.setHours(0,0,0,0);
                      const currentBtnDate = new Date(currentYear, currentMonth, day);
                      const isPast = currentBtnDate < today;
                      
                      return (
                          <button 
                              key={day}
                              onClick={() => {
                                  if (isPast) return;
                                  setNewGoalStartDate(dateStr);
                                  setIsStartDatePickerOpen(false);
                                  setIsStartPickerOpen(true);
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

      {/* Start Time Picker Bottom Sheet */}
      <AnimatePresence>
        {isStartTimePickerOpen && (
          <motion.div key="isStartTimePickerOpenModal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="absolute -bottom-[100px] pb-[100px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] pt-6 px-6 z-[110] border-t border-[#4f4f4f]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-normal text-[20px]">Horário de Início</h3>
              <button onClick={() => { setIsStartTimePickerOpen(false); setIsStartPickerOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white">
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
                      const m = newGoalStartTime ? newGoalStartTime.split(':')[1] : '00';
                      setNewGoalStartTime(`${h}:${m}`);
                    }}
                    className={`w-full py-3 rounded-[16px] text-[16px] font-normal transition-colors ${newGoalStartTime?.startsWith(i.toString().padStart(2, '0') + ':') ? 'bg-white text-black font-normal' : 'bg-[#2c2c2c] text-[#e8e8e9] hover:bg-[#4f4f4f]'}`}
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
                      const h = newGoalStartTime ? newGoalStartTime.split(':')[0] : '00';
                      setNewGoalStartTime(`${h}:${m}`);
                      setIsStartTimePickerOpen(false);
                      setIsStartPickerOpen(true);
                    }}
                    className={`w-full py-3 rounded-[16px] text-[16px] font-normal transition-colors ${newGoalStartTime?.endsWith(':' + i.toString().padStart(2, '0')) ? 'bg-white text-black font-normal' : 'bg-[#2c2c2c] text-[#e8e8e9] hover:bg-[#4f4f4f]'}`}
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

      {/* End Date Picker Bottom Sheet */}
      <AnimatePresence>
        {isTaskSelectionOpen && !editingStageId && (
          <motion.div key="isTaskSelectionOpenModal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="absolute -bottom-[100px] pb-[100px] left-0 w-full h-[70vh] bg-[#1f1f1f] rounded-t-[30px] z-[110] border-t border-[#4f4f4f] flex flex-col max-h-[90vh]"
            onClick={(e) => { e.stopPropagation(); if (openStageMenuId) setOpenStageMenuId(null); }}
          >
            {/* Background extension block to prevent gap/detachment at the bottom during spring bounce animation */}
            <div className="absolute top-[80%] left-0 right-0 h-[300px] bg-[#1f1f1f] pointer-events-none z-0" />

            <div className="flex items-center justify-between p-6 shrink-0 border-b border-white/[0.04] relative z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-normal text-[20px]">Adicionar Etapas</h3>
              </div>
              <button onClick={() => setIsTaskSelectionOpen(false)} className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar px-6 pt-4 pb-28 relative z-10">
              {goalStages.length === 0 ? (
                <div className="text-center text-[#73777d] text-[14px] py-8">Nenhuma etapa adicionada.</div>
              ) : (
                goalStages.map((stage, idx) => (
                  <div key={stage.id} 
                       className={`bg-[#282828] rounded-[14px] py-4 px-5 flex flex-col relative shrink-0 cursor-pointer transition-all ${openStageMenuId === stage.id ? 'z-50' : 'z-10'}`}
                       onClick={() => setEditingStageId(stage.id)}
                  >
                     <div className="flex justify-between w-full items-start">
                        <span className="text-white font-normal text-[16px] leading-[22px] flex items-center min-h-[22px]">Etapa {idx + 1}</span>
                        <div className="relative flex items-center justify-center -my-1 -mr-2">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setOpenStageMenuId(openStageMenuId === stage.id ? null : stage.id); }} 
                                className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                            >
                                <MoreVertical className="w-[18px] h-[18px]" />
                            </button>
                            <AnimatePresence>
                            {openStageMenuId === stage.id && (
                                <motion.div
                                    key={`stage-menu-${stage.id}`}
                                    initial={{ opacity: 0, scale: 0.92, y: -6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.92, y: -6 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute right-2 top-8 w-[105px] bg-[#2c2c2c] rounded-[10px] border border-[#4f4f4f] overflow-hidden z-[100]"
                                >
                                    <button 
                                        disabled={isDeletingStageMenuId === stage.id}
                                        onClick={(e) => { 
                                            e.stopPropagation();
                                            if (isDeletingStageMenuId === stage.id) return;
                                            setIsDeletingStageMenuId(stage.id);
                                            setTimeout(() => {
                                                setGoalStages(goalStages.filter(s => s.id !== stage.id)); 
                                                setOpenStageMenuId(null); 
                                                setIsDeletingStageMenuId(null);
                                            }, 2000);
                                        }}
                                        className="w-full px-3 py-2 text-left text-[13px] text-white hover:bg-white/5 flex items-center justify-start min-h-[36px] transition-colors"
                                    >
                                        {isDeletingStageMenuId === stage.id ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                                            </div>
                                        ) : (
                                            <>
                                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                     </div>
                     {stage.title && (
                         <p className="text-white font-normal text-[15px] leading-[22px] mt-[2px] whitespace-normal break-words">
                             {stage.title}
                         </p>
                     )}
                  </div>
                ))
              )}
            </div>

            <div className="absolute bottom-[124px] right-6 z-20">
               <button 
                 disabled={isAddingStageLoading}
                 onClick={() => {
                   if (isAddingStageLoading) return;
                   setIsAddingStageLoading(true);
                   setTimeout(() => {
                     const newStage = { id: Date.now().toString(), title: '', description: '', tasks: [] };
                     setGoalStages(prev => [...prev, newStage]);
                     setIsAddingStageLoading(false);
                   }, 800);
                 }}
                 className={`w-14 h-14 rounded-[13px] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${isAddingStageLoading ? 'bg-[#a32222] opacity-50 cursor-not-allowed' : 'bg-[#ff3838]'}`}
               >
                 {isAddingStageLoading ? (
                   <Loader2 className="w-6 h-6 text-white animate-spin" />
                 ) : (
                   <Plus className="w-6 h-6 text-white" strokeWidth={2} />
                 )}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingStageId && (() => {
          const stage = goalStages.find(s => s.id === editingStageId);
          const stageIdx = goalStages.findIndex(s => s.id === editingStageId);
          if (!stage) return null;
          return (
                    <motion.div key="stageTaskModal"
            initial={{ y: "100%" }}
            animate={{ y: managingTasksForStageId ? "100%" : 0 }}
            exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="absolute -bottom-[100px] pb-[140px] left-0 w-full bg-[#1f1f1f] rounded-t-[30px] z-[120] border-t border-[#4f4f4f] flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background extension block to prevent gap/detachment at the bottom during spring bounce animation */}
            <div className="absolute top-[80%] left-0 right-0 h-[300px] bg-[#1f1f1f] pointer-events-none z-0" />

            <div className="flex items-center justify-between p-6 shrink-0 border-b border-white/[0.04] relative z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-normal text-[20px]">Editar Etapa</h3>
              </div>
              <button onClick={() => setEditingStageId(null)} className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <div className="p-6 shrink-0 flex flex-col gap-5 relative z-10">
               <input 
                  type="text" 
                  maxLength={100}
                  placeholder="Título da etapa: máx. 100 caracteres" 
                  value={stage.title}
                  onChange={e => setGoalStages(goalStages.map(s => s.id === editingStageId ? { ...s, title: e.target.value } : s))}
                  className="w-full shrink-0 bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 py-4 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent placeholder-[#73777d]"
               />
               
               <button
                  onClick={() => setManagingTasksForStageId(stage.id)}
                  className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[10px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
               >
                  <span className="truncate mr-2">
                      {stage.tasks.length > 0 ? <span className="text-white">{stage.tasks.length} tarefa{stage.tasks.length !== 1 ? 's' : ''} adicionada{stage.tasks.length !== 1 ? 's' : ''}</span> : <span className="text-[#73777d]">Criar tarefas para essa etapa</span>}
                  </span>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${stage.tasks.length > 0 ? "text-white" : "text-[#73777d]"}`} />
               </button>
            </div>

            </motion.div>
          );
        })()}
      </AnimatePresence>
      <AnimatePresence>
        {managingTasksForStageId && (() => {
          const stage = goalStages.find(s => s.id === managingTasksForStageId);
          if (!stage) return null;
          return (
          <motion.div key="managingTasksModal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { type: "spring", damping: 24, stiffness: 200 } }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="absolute -bottom-[100px] pb-[100px] left-0 w-full h-[70vh] bg-[#1f1f1f] rounded-t-[30px] z-[130] border-t border-[#4f4f4f] flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background extension block to prevent gap/detachment at the bottom during spring bounce animation */}
            <div className="absolute top-[80%] left-0 right-0 h-[300px] bg-[#1f1f1f] pointer-events-none z-0" />

            <div className="flex items-center justify-between p-6 shrink-0 border-b border-white/[0.04] relative z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-normal text-[20px]">Tarefas da Etapa</h3>
              </div>
              <button onClick={() => {
                  setGoalStages(goalStages.map(s => s.id === managingTasksForStageId ? { ...s, tasks: s.tasks.filter(t => t.title.trim() !== '') } : s));
                  setManagingTasksForStageId(null);
              }} className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-28 pt-4 flex flex-col gap-3 no-scrollbar relative z-10">
               
               
               {stage.tasks.length === 0 ? (
                  <div className="text-center text-[#73777d] text-[14px] py-8">Nenhuma tarefa adicionada.</div>
               ) : (
                 stage.tasks.map(t => (
                  <div key={t.id} className="bg-[#282828] rounded-[14px] py-4 px-5 flex items-start justify-start relative z-10 shrink-0">
                     <div className="w-[22px] h-[22px] rounded-full border border-[#cfcfcf] flex items-center justify-center shrink-0 mr-3"></div>
                     <div className="flex flex-col justify-start flex-1 min-w-0">
                         <textarea
                           value={t.title}
                           maxLength={100}
                           onChange={(e) => {
                               e.target.style.height = 'auto';
                               e.target.style.height = e.target.scrollHeight + 'px';
                               setGoalStages(goalStages.map(s => s.id === managingTasksForStageId ? { 
                                   ...s, 
                                   tasks: s.tasks.map(task => task.id === t.id ? { ...task, title: e.target.value } : task) 
                               } : s));
                           }}
                           className="bg-transparent border-none outline-none text-white font-roboto font-normal text-[15px] leading-[22px] w-full resize-none overflow-hidden p-0 m-0"
                           rows={1}
                         />
                     </div>
                  </div>
                 ))
               )}
            </div>
            
            <div className="absolute bottom-[124px] right-6 z-20">
               <button
                  disabled={isAddingSubTaskLoading}
                  onClick={() => {
                     if (isAddingSubTaskLoading) return;
                     setIsAddingSubTaskLoading(true);
                     setTimeout(() => {
                        const newTask = { id: Date.now().toString(), title: 'Clique para editar: máx. 100 caracteres', completed: false };
                        setGoalStages(prev => prev.map(s => s.id === managingTasksForStageId ? { ...s, tasks: [...s.tasks, newTask] } : s));
                        setIsAddingSubTaskLoading(false);
                     }, 800);
                  }}
                  className={`w-14 h-14 rounded-[13px] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${isAddingSubTaskLoading ? 'bg-[#a32222] opacity-50 cursor-not-allowed' : 'bg-[#ff3838]'}`}
               >
                 {isAddingSubTaskLoading ? (
                   <Loader2 className="w-6 h-6 text-white animate-spin" />
                 ) : (
                   <Plus className="w-6 h-6 text-white" strokeWidth={2} />
                 )}
               </button>
            </div>
          </motion.div>
          );
        })()}
      </AnimatePresence>

      
        
      {/* End Picker Bottom Sheet (Combined) */}
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
                    {newGoalEndDate ? <span className="text-white">{new Date(newGoalEndDate + 'T12:00:00').toLocaleDateString('pt-BR')}</span> : <span className="text-[#73777d]">Escolher Data Final</span>}
                </span>
                <ChevronRight className={`w-4 h-4 shrink-0 ${newGoalEndDate ? "text-white" : "text-[#73777d]"}`} />
              </button>
              <button 
                onClick={() => {
                    setIsEndPickerOpen(false);
                    setIsEndTimePickerOpen(true);
                }}
                className="w-full h-[56px] bg-[#2c2c2c] border border-transparent rounded-[14px] px-5 text-[14px] text-[#e8e8e9] outline-none focus:ring-0 focus:border-transparent text-left relative flex justify-between items-center transition-colors hover:bg-[#3a3a3a]"
              >
                <span className="truncate mr-2">
                    {newGoalEndTime ? <span className="text-white">{newGoalEndTime}</span> : <span className="text-[#73777d]">Escolher Horário Final</span>}
                </span>
                <ChevronRight className={`w-4 h-4 shrink-0 ${newGoalEndTime ? "text-white" : "text-[#73777d]"}`} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End Date Picker Bottom Sheet */}
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
                      const isSelected = newGoalEndDate === dateStr;
                      const today = new Date();
                      today.setHours(0,0,0,0);
                      const currentBtnDate = new Date(endCurrentYear, endCurrentMonth, day);
                      const isPast = currentBtnDate < today;
                      return (
                          <button 
                              key={day}
                              onClick={() => {
                                  if (isPast) return;
                                  setNewGoalEndDate(dateStr);
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

      {/* End Time Picker Bottom Sheet */}
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
                      const m = newGoalEndTime ? newGoalEndTime.split(':')[1] : '00';
                      setNewGoalEndTime(`${h}:${m}`);
                    }}
                    className={`w-full py-3 rounded-[16px] text-[16px] font-normal transition-colors ${newGoalEndTime?.startsWith(i.toString().padStart(2, '0') + ':') ? 'bg-white text-black font-normal' : 'bg-[#2c2c2c] text-[#e8e8e9] hover:bg-[#4f4f4f]'}`}
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
                      const h = newGoalEndTime ? newGoalEndTime.split(':')[0] : '00';
                      setNewGoalEndTime(`${h}:${m}`);
                      setIsEndTimePickerOpen(false);
                      setIsEndPickerOpen(true);
                    }}
                    className={`w-full py-3 rounded-[16px] text-[16px] font-normal transition-colors ${newGoalEndTime?.endsWith(':' + i.toString().padStart(2, '0')) ? 'bg-white text-black font-normal' : 'bg-[#2c2c2c] text-[#e8e8e9] hover:bg-[#4f4f4f]'}`}
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
                    resetAddModalState();
                  }}
                  className="flex-1 py-2.5 rounded-[14px] text-white text-[14px] font-semibold bg-[#ff3838] hover:bg-[#ff3838]/90 transition-colors"
                >
                  Descartar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notificação de Desbloqueio de Etapa no Topo do Aplicativo */}
      <AnimatePresence>
        {stageUnlockNotification && (
          <motion.div
            key={stageUnlockNotification.id}
            initial={{ y: -120, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -120, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="fixed top-4 left-4 right-4 max-w-[420px] mx-auto z-[250] bg-[#1f1f1f] border border-[#383838] rounded-[16px] overflow-hidden pointer-events-auto select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 pt-3.5 pb-4 flex flex-col text-left">
              <h4 className="text-white font-bold text-[14.5px] leading-snug">
                {stageUnlockNotification.isFinal 
                  ? "Parabéns por alcançar seu objetivo!" 
                  : "Parabéns por concluir esta etapa!"}
              </h4>
              <p className="text-[#a0a0a0] text-[12.5px] leading-[1.4] mt-1">
                {stageUnlockNotification.isFinal
                  ? "Você concluiu todas as etapas da sua jornada com sucesso."
                  : "Você acaba de desbloquear o próximo desafio da sua jornada."}
              </p>
            </div>

            {/* Linha de progresso branca colada exatamente na borda de baixo */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-white"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
