// useScrollTop.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useScrollTop = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, location } = useCommonValue();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location, navigate]);
};
