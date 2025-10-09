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
      !PATH.includes("food/find") &&
      !PATH.includes("food/favorite") &&
      !PATH.includes("food/record")
    ) {
      fnSetSession("section", "food", "", []);
    }
  }, [PATH]);
};