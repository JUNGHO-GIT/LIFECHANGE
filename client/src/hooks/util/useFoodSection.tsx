// useFoodSection.tsx

import { useCommonValue } from "@importHooks";
import { useEffect } from "@importReacts";
import { fnSetSession } from "@importScripts";

// -------------------------------------------------------------------------------------------------
export const useFoodSection = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { PATH } = useCommonValue();

	// 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    if (
      !PATH.includes("food/find/list") &&
      !PATH.includes("food/favorite/list") &&
      !PATH.includes("food/record/detail")
    ) {
      fnSetSession("section", "food", "", []);
    }
  }, [PATH]);
};