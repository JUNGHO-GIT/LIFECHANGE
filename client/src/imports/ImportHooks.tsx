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

// util
import { useRoot } from "@hooks/util/useRoot";
import { useScrollTop } from "@hooks/util/useScrollTop";
import { useFoodSection } from "@hooks/util/useFoodSection";
import { useTime } from "@hooks/util/useTime";

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

  // util
  useRoot,
  useScrollTop,
  useFoodSection,
  useTime,
};