// useLanguageInitialize.tsx

import { useCommonValue } from "@exportHooks";
import { useEffect } from "@exportReacts";
import { useStoreLanguage } from "@exportStores";

// -------------------------------------------------------------------------------------------------
export const useLanguageInitialize = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { localLang } = useCommonValue();
  const { setLang } = useStoreLanguage();

	// 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    if (localLang === "ko") {
      setLang("ko");
    }
    else {
      setLang("en");
    }
  }, [localLang]);
};