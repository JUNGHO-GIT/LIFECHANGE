// useEnhancedTouch.tsx

import { useEffect } from "@imports/ImportReacts";

// -------------------------------------------------------------------------------------------------
export const useEnhancedTouch = () => {
  useEffect(() => {
    const handleTouchStart = (event: any) => {
      window.requestAnimationFrame(() => {
      });
    }

    const handleTouchMove = (event: any) => {
      window.requestAnimationFrame(() => {
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