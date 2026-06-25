/**
 * @file useFoodSection.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { useCommonValue } from "@hooks/common/useCommonValue";
import { useEffect } from "@exportReacts";
import { setSession } from "@assets/scripts/storage";

// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const useFoodSection = () => {

  // 1. common ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const { PATH } = useCommonValue();

  // 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  useEffect(() => {
    if (
      !PATH.includes(`food/find`) &&
      !PATH.includes(`food/favorite`) &&
      !PATH.includes(`food/record`)
    ) {
      setSession(`section`, `food`, ``, []);
    }
  }, [PATH]);
};
