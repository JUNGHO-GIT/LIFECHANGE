// useFoodSection.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useFoodSection = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    sessionId, navigate, location, TITLE,
  } = useCommonValue();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    // 1. foodSection 처리
    if (
      location.pathname.includes("/food/find/list") === false &&
      location.pathname.includes("/food/detail") === false
    ) {
      const section = sessionStorage.getItem(`${TITLE}_foodSection`);
      if (section !== null || section !== undefined || section !== "") {
        sessionStorage.removeItem(`${TITLE}_foodSection`);
      }
    }
  }, [location, navigate, sessionId]);

};