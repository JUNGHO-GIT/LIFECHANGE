// useFoodSection.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { setSession } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
export const useFoodSection = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, sessionId } = useCommonValue();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    // foodSection 처리
    if (
      !PATH.includes("food/find/list") &&
      !PATH.includes("food/favorite/list") &&
      !PATH.includes("food/detail")
    ) {
      setSession("section", "food", "", []);
    }
  }, [PATH, sessionId]);
};