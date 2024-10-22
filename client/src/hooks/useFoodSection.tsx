// useFoodSection.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useFoodSection = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { TITLE, PATH, sessionId, sessionTitle } = useCommonValue();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    // foodSection 처리
    if (
      !PATH.includes("food/find/list") &&
      !PATH.includes("food/favorite/list") &&
      !PATH.includes("food/detail")
    ) {

      sessionStorage.setItem(TITLE, JSON.stringify({
        ...sessionTitle,
        section: {
          ...sessionTitle?.section,
          food: []
        }
      }));
    }
  }, [PATH, sessionId]);
};