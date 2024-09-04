// useSessionStorage.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useSessionStorage = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    sessionId, navigate, location, TITLE,
  } = useCommon();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    // 1. foodSection 처리 (food/find, food/save)
    if (
      location.pathname.indexOf("/food/find") === -1 &&
      location.pathname.indexOf("/food/save") === -1
    ) {
      const section = sessionStorage.getItem(`${TITLE}_foodSection`);
      if (section !== null || section !== undefined || section !== "") {
        sessionStorage.removeItem(`${TITLE}_foodSection`);
      }
    }
  }, [location, navigate, sessionId]);

};