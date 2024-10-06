// useFoodSection.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useFoodSection = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { TITLE, PATH, sessionId } = useCommonValue();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    // foodSection 처리
    if (
      !PATH.includes("food/find/list") &&
      !PATH.includes("food/favorite/list") &&
      !PATH.includes("food/detail")
    ) {

      const section = sessionStorage.getItem(`${TITLE}_foodSection`);

      if (section) {
        sessionStorage.removeItem(`${TITLE}_foodSection`);
      }
    }
  }, [PATH, sessionId]);

};