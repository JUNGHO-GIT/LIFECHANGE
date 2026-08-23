/**
 * @file Loader.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { memo, useEffect, useState } from "@exportReacts";
import { Div } from "@exportComponents";
import { useStoreLoading } from "@exportStores";

declare interface LoaderProps {
  active?: boolean;
}

const LOADER_DELAY_MS: number = 250;
const LOADER_EXIT_MS: number = 80;

// -------------------------------------------------------------------------------------------------
export const Loader = memo(({ active }: LoaderProps) => {

  // 1. common ----------------------------------------------------------------------------------
  const LOADING = useStoreLoading((state) => state.LOADING);
  const NAVIGATING = useStoreLoading((state) => state.NAVIGATING);
  const sourceLoading: boolean = active ?? (LOADING || NAVIGATING);
  // 전환(NAVIGATING)과 명시 active는 지연 없이 즉시 표시, 인페이지 데이터 로딩만 지연 적용
  const immediate: boolean = active === true || NAVIGATING;
  const [ isVisible, setIsVisible ] = useState<boolean>(active === true);
  const [ isExiting, setIsExiting ] = useState<boolean>(false);

  // 2. 전환은 즉시, 인페이지 데이터 로딩은 짧은 지연 후 표시 -------------------------------------
  useEffect(() => {
    if (!sourceLoading) {
      return;
    }
    setIsExiting(false);
    if (immediate) {
      setIsVisible(true);
      return;
    }

    const timerId = window.setTimeout(() => {
      setIsVisible(true);
    }, LOADER_DELAY_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [ immediate, sourceLoading ]);

  // 2. 완료 응답은 짧은 opacity 퇴장 후 제거 ----------------------------------
  useEffect(() => {
    if (sourceLoading || !isVisible) {
      return;
    }
    setIsExiting(true);
    const timerId: number = window.setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
    }, LOADER_EXIT_MS);
    return () => {
      window.clearTimeout(timerId);
    };
  }, [ sourceLoading, isVisible ]);

  // 7.loader --------------------------------------------------------------------------------------
  const loaderNode = () => (
    isVisible ? (
      <Div
        aria-busy={true}
        aria-label={`loading`}
        aria-live={`polite`}
        className={isExiting ? `loader-wrapper loader-exit` : `loader-wrapper`}
        role={`status`}
      >
        <Div className={`loader-panel`}>
          <Div className={`app-loader-indicator`} />
        </Div>
      </Div>
    ) : null
  );

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {loaderNode()}
    </>
  );
});
