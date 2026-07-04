/**
 * @file useScrollTop.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { useEffect } from "@exportReacts";

// -------------------------------------------------------------------------------------------------
export const useScrollTop = (PATH: string) => {

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [PATH]);
};
