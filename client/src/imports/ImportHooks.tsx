// ImportHooks.tsx

// common
import { useCommonValue } from "@hooks/common/useCommonValue";
import { useCommonDate } from "@hooks/common/useCommonDate";

// language
import { useLanguageInitialize } from "@hooks/language/useLanguageInitialize";
import { useLanguageSetting } from "@hooks/language/useLanguageSetting";

// validate
import { useValidateUser } from "@hooks/validate/useValidateUser";
import { useValidateExercise } from "@hooks/validate/useValidateExercise";
import { useValidateFood } from "@hooks/validate/useValidateFood";
import { useValidateMoney } from "@hooks/validate/useValidateMoney";
import { useValidateSleep } from "@hooks/validate/useValidateSleep";
import { useValidateCalendar } from "@hooks/validate/useValidateCalendar";

// storage
import { useStorageSession } from "@hooks/storage/useStorageSession";
import { useStorageLocal } from "@hooks/storage/useStorageLocal";
import { useStorageTest } from "@hooks/storage/useStorageTest";

// etc
import { useRoot } from "@hooks/etc/useRoot";
import { useScrollTop } from "@hooks/etc/useScrollTop";
import { useFoodSection } from "@hooks/etc/useFoodSection";
import { useTime } from "@hooks/etc/useTime";

// -------------------------------------------------------------------------------------------------
export {
  // common
  useCommonValue,
  useCommonDate,

  // language
  useLanguageInitialize,
  useLanguageSetting,

  // validate
  useValidateUser,
  useValidateExercise,
  useValidateFood,
  useValidateMoney,
  useValidateSleep,
  useValidateCalendar,

  // storage
  useStorageSession,
  useStorageLocal,
  useStorageTest,

  // etc
  useRoot,
  useScrollTop,
  useFoodSection,
  useTime,
};