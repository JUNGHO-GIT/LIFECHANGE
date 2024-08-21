// useSessionStorage.jsx

import { useEffect } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";

// -------------------------------------------------------------------------------------------------
export const useSessionStorage = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    sessionId, navigate, location,
  } = useCommon();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    // 1. foodSection 처리 (food/find, food/save)
    if (
      location.pathname.indexOf("/food/find") === -1 &&
      location.pathname.indexOf("/food/save") === -1
    ) {
      const section = sessionStorage.getItem("foodSection");
      if (section !== null || section !== undefined || section !== "") {
        sessionStorage.removeItem("foodSection");
      }
    }
  }, [location, navigate, sessionId]);

};