/**
 * @file useMotion.tsx
 * @description shared motion preferences and chart timing
 * @author Jungho
 * @since 2026-08-24
 */

import { useEffect, useRef, useSyncExternalStore } from "@exportReacts";

declare interface ChartMotionProps {
  isAnimationActive: boolean;
  animationBegin: number;
  animationDuration: number;
  animationEasing: `ease-out` | `ease-in-out`;
}

const REDUCED_MOTION_QUERY: string = `(prefers-reduced-motion: reduce)`;

// 1. 사용자 모션 설정 구독 ----------------------------------------------------
const getReducedMotion = (): boolean => (
  typeof window !== `undefined` && window.matchMedia(REDUCED_MOTION_QUERY).matches
);
const subscribeReducedMotion = (callback: () => void): (() => void) => {
  if (typeof window === `undefined`) {
    return () => {};
  }
  const mediaQuery: MediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener(`change`, callback);
  return () => {
    mediaQuery.removeEventListener(`change`, callback);
  };
};

// 2. 공통 모션 훅 -------------------------------------------------------------
export const useReducedMotion = (): boolean => useSyncExternalStore(
  subscribeReducedMotion,
  getReducedMotion,
  () => false,
);
export const useChartMotion = (): ChartMotionProps => {
  const reducedMotion: boolean = useReducedMotion();
  const mountedRef: React.RefObject<boolean> = useRef<boolean>(false);
  const firstRender: boolean = !mountedRef.current;

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  return {
    isAnimationActive: !reducedMotion,
    animationBegin: 0,
    animationDuration: firstRender ? 240 : 160,
    animationEasing: firstRender ? `ease-out` : `ease-in-out`,
  };
};
