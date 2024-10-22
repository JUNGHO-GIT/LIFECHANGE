// ImportHooks.tsx

import { useCommonValue } from "@hooks/common/useCommonValue";
import { useCommonDate } from "@hooks/common/useCommonDate";

import { useLanguageInitialize } from "@hooks/language/useLanguageInitialize";
import { useLanguageSetting } from "@hooks/language/useLanguageSetting";

import { useStorageSession } from "@hooks/storage/useStorageSession";
import { useStorageLocal } from "@hooks/storage/useStorageLocal";

import { useRoot } from "@hooks/useRoot";
import { useScrollTop } from "@hooks/useScrollTop";
import { useFoodSection } from "@hooks/useFoodSection";
import { useTime } from "@hooks/useTime";

// -------------------------------------------------------------------------------------------------
export {
  useCommonValue,
  useCommonDate,
  useLanguageInitialize,
  useRoot,
  useScrollTop,
  useFoodSection,
  useStorageSession,
  useStorageLocal,
  useTime,
  useLanguageSetting,
};