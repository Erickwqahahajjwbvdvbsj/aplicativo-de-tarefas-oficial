import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { trophyAnimationData } from '../assets/trophyAnimation';

export const TrophyLottie: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: trophyAnimationData,
    });

    return () => {
      anim.destroy();
    };
  }, []);

  return <div ref={containerRef} className="w-[235px] h-[235px] flex items-center justify-center pointer-events-none" />;
};
