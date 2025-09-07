// useFoodSection.tsx

import { useEffect } from "@importReacts";
import { useCommonValue } from "@importHooks";
import { setSession } from "@importScripts";

// -------------------------------------------------------------------------------------------------
export const useFoodSection = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { PATH } = useCommonValue();

	// 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {

    // foodSection 처리
    if (
      !PATH.includes("food/find/list") &&
      !PATH.includes("food/favorite/list") &&
      !PATH.includes("food/detail")
    ) {
      setSession("section", "food", "", []);
    }
  }, [PATH]);
};