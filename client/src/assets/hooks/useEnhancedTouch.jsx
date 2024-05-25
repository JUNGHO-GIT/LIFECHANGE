import { useEffect } from 'react';

export const useEnhancedTouch = () => {
  useEffect(() => {
    const handleTouchStart = (event) => {
      window.requestAnimationFrame(() => {
        console.log('Touch start detected');
      });
    };

    const handleTouchMove = (event) => {
      window.requestAnimationFrame(() => {
        console.log('Touch move detected');
      });
    };

    // Passive true로 이벤트 리스너 등록
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
};