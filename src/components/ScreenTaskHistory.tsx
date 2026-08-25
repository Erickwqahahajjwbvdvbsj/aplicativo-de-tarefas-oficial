import { ArrowLeft, Check, X, ChevronRight } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';

export function ScreenTaskHistory({ onBack }: { onBack: () => void }) {
  const { tasks } = useTasks();
  const completedTasks = tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false;
    const completedDate = new Date(task.completedAt);
    if (isNaN(completedDate.getTime())) return false;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const completedDayStart = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate()).getTime();
    const diffDays = Math.floor((todayStart - completedDayStart) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `Concluída em ${day}/${month}/${year}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="w-full h-full bg-[#1f1f1f] relative font-sans overflow-hidden flex flex-col flex-1">
      <div className="w-full px-6 pt-6 flex flex-col shrink-0 relative z-20">
        {/* Header */}
        <div className="flex justify-between items-start shrink-0">
          <h1 className="text-white text-[28px] font-medium leading-[1.2] text-left flex-1">
            Histórico de <br />
            <span className="font-bold">Tarefas Concluídas</span>
          </h1>
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2c] text-gray-400 hover:text-white shrink-0 ml-4 mt-1.5">
            <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
        </div>

        {/* Notice Message */}
        <p className="text-[13px] text-[#70747b] font-medium text-left mt-3 mb-8 leading-tight">
          Suas tarefas concluídas ficam salvas aqui por <strong className="text-white">7 dias</strong>. Após isso, elas desaparecem para você focar apenas no progresso da sua semana atual!
        </p>

        {/* Soft Gradient Fade for smooth history disappearance */}
        <div 
          className="absolute left-0 right-0 h-[50px] pointer-events-none"
          style={{ 
            top: '100%',
            background: 'linear-gradient(to bottom, rgba(31,31,31,1) 0%, rgba(31,31,31,0.98) 8%, rgba(31,31,31,0.94) 16%, rgba(31,31,31,0.85) 26%, rgba(31,31,31,0.7) 40%, rgba(31,31,31,0.5) 56%, rgba(31,31,31,0.25) 76%, rgba(31,31,31,0) 100%)'
          }}
        ></div>
      </div>

      <div className="flex-1 w-full overflow-y-auto no-scrollbar px-6 pt-[50px] pb-8 flex flex-col">
        {/* Timeline */}
        <div className="relative flex-1">
          {/* Vertical Line */}
          <div className="absolute top-2 bottom-4 left-[9px] w-0.5 bg-[#2c2c2c]" />

          <div className="flex flex-col gap-6">
            {completedTasks.length === 0 ? (
                null
            ) : (
                completedTasks.map((task) => (
                  <div key={task.id} className="relative flex gap-8">
                    {/* Timeline Dot */}
                    <div className="mt-1 relative z-10 shrink-0">
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center ring-4 ring-[#1f1f1f]">
                        <Check className="w-3 h-3 text-[#1f1f1f]" strokeWidth={3} />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-[#282828] rounded-[7px] px-4 py-3.5 flex-1 border border-transparent flex flex-col justify-start min-w-0">
                      <span className="text-[14px] font-roboto font-normal text-white leading-tight line-clamp-3 break-words whitespace-normal">{task.title}</span>
                      <div className="mt-1.5 flex items-center justify-start text-[11px] text-[#73777d] font-medium w-full">
                        <span>{formatDate(task.completedAt!)} • {formatTime(task.completedAt!)}</span>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
          
          {/* End of timeline indicator */}
          <div className="relative flex items-center gap-8 mt-16 pb-8">
             <div className="relative z-10 shrink-0">
                <div className="w-5 h-5 rounded-full bg-[#303030] flex items-center justify-center ring-4 ring-[#1f1f1f]">
                  <X className="w-3 h-3 text-white" />
                </div>
             </div>
             <div>
                <span className="text-[13px] font-roboto font-normal text-[#73777d]">Últimos 7 dias deletados</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
