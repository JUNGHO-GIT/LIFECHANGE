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

// -------------------------------------------------------------------------------------------------
export const Loader = memo(({ active }: LoaderProps) => {

  // 1. common ----------------------------------------------------------------------------------
  const { LOADING } = useStoreLoading();
  const sourceLoading: boolean = active ?? LOADING;
  const [ isVisible, setIsVisible ] = useState<boolean>(active === true);

  // 2. 짧은 전역 로딩 표시 억제 -----------------------------------------------------------------
  useEffect(() => {
    if (!sourceLoading) {
      setIsVisible(false);
      return;
    }
    if (active === true) {
      setIsVisible(true);
      return;
    }

    const timerId = window.setTimeout(() => {
      setIsVisible(true);
    }, LOADER_DELAY_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [ active, sourceLoading ]);

  // 7.loader --------------------------------------------------------------------------------------
  const loaderNode = () => (
		isVisible ? (
			<Div
			  aria-busy={true}
			  aria-label={`loading`}
			  aria-live={`polite`}
			  className={`loader-wrapper`}
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
