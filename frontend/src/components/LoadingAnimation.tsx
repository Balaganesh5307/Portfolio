import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../assets/loading-animation.json';

interface LoadingAnimationProps {
  progress?: number;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        progressiveLoad: false,
        preserveAspectRatio: 'xMidYMid meet',
      },
    });
    anim.setSpeed(1.8);

    return () => {
      anim.destroy();
    };
  }, []);

  return (
    <div className="loader-wrapper">
      <div className="loader-lottie-box">
        <div ref={containerRef} className="loader-lottie-container" />
      </div>
    </div>
  );
};
