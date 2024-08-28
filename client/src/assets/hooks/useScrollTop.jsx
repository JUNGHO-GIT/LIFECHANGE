// useScrollTop.jsx

import { useEffect } from "../../imports/ImportReacts.jsx";
import { useCommon } from "../../imports/ImportHooks.jsx";

// -------------------------------------------------------------------------------------------------
export const useScrollTop = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {navigate, location} = useCommon();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location, navigate]);
};
