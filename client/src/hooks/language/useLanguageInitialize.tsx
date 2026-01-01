/**
 * @file useLanguageInitialize.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

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
    localLang === `ko` ? setLang(`ko`) : setLang(`en`);
  }, [localLang]);
};
