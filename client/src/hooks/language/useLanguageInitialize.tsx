// useLanguageInitialize.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";

// -------------------------------------------------------------------------------------------------
export const useLanguageInitialize = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { localLang } = useCommonValue();
  const { setLang } = useLanguageStore();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (localLang === "ko") {
      setLang("ko");
    }
    else {
      setLang("en");
    }
  }, [localLang]);
};