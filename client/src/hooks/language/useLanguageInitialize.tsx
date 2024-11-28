// useLanguageInitialize.tsx

import { useEffect } from "@importReacts";
import { useCommonValue } from "@importHooks";
import { useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
export const useLanguageInitialize = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { localLang } = useCommonValue();
  const { setLang } = useStoreLanguage();

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