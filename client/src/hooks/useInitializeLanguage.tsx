// useInitializeLanguage.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";

// -------------------------------------------------------------------------------------------------
export const useInitializeLanguage = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { TITLE } = useCommonValue();
  const { setLang } = useLanguageStore();
  const localeSetting: any = JSON.parse(localStorage.getItem(`${TITLE}_localeSetting`) || "{}")?.locale;

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (localeSetting) {
      if (localeSetting === "ko") {
        setLang("ko");
      }
      else if (localeSetting === "es") {
        setLang("es");
      }
      else {
        setLang("en");
      }
    }
  }, [localeSetting, setLang]);
};