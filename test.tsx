import React, { useRef, useState } from 'react';
export const SlideToSubmit = ({ 
  onTrigger, 
  disabled, 
  text 
}: { 
  onTrigger: () => void; 
  disabled: boolean; 
  text: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current || disabled) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const thumbWidth = 56;
    const maxScroll = containerWidth - thumbWidth;
    
    let newX = e.clientX - containerRect.left - thumbWidth / 2;
    newX = Math.max(0, Math.min(newX, maxScroll));
    
    const newProgress = newX / maxScroll;
    setProgress(newProgress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || disabled) return;
    setIsDragging(false);
    if (progress > 0.95) {
      setProgress(1);
      onTrigger();
      setTimeout(() => setProgress(0), 500);
    } else {
      setProgress(0);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[56px] mt-2 rounded-[28px] border-2 border-[#ff3838] overflow-hidden select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ touchAction: 'none' }}
    >
      {/* Background fill based on progress */}
      <div 
        className="absolute top-0 left-0 h-full bg-[#ff3838]" 
        style={{ width: `calc(56px + ${progress} * (100% - 56px))`, transition: isDragging ? 'none' : 'width 0.3s ease' }}
      />
      
      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className={`font-bold text-[14px] z-10 transition-colors ${progress > 0.3 ? 'text-white' : 'text-white'}`}>
          {text}
        </span>
      </div>

      {/* Draggable thumb */}
      <div 
        className="absolute top-1 bottom-1 w-[48px] rounded-[24px] bg-[#ff3838] flex items-center justify-center cursor-grab active:cursor-grabbing z-20"
        style={{ 
          left: `calc(2px + ${progress} * (100% - 56px - 4px))`,
          transition: isDragging ? 'none' : 'left 0.3s ease' 
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  );
};
