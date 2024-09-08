// ImportHooks.tsx

import { useCommonValue } from "@hooks/common/useCommonValue";
import { useCommonDate } from "@hooks/common/useCommonDate";
import { LanguageProvider } from "@hooks/useLanguageProvider";
import { useTranslate } from "@hooks/useLanguageProvider";
import { useRoot } from "@hooks/useRoot";
import { useScrollTop } from "@hooks/useScrollTop";
import { useSessionStorage } from "@hooks/useSessionStorage";
import { useStorage } from "@hooks/useStorage";
import { useTime } from "@hooks/useTime";
import { useTimezone } from "@hooks/useTimezone";
import { useValidateUser } from "@hooks/validate/useValidateUser";
import { useValidateExercise } from "@hooks/validate/useValidateExercise";
import { useValidateFood } from "@hooks/validate/useValidateFood";
import { useValidateMoney } from "@hooks/validate/useValidateMoney";
import { useValidateSleep } from "@hooks/validate/useValidateSleep";
import { useValidateCalendar } from "@hooks/validate/useValidateCalendar";

// -------------------------------------------------------------------------------------------------
export {
  useCommonValue,
  useCommonDate,
  LanguageProvider,
  useTranslate,
  useRoot,
  useScrollTop,
  useSessionStorage,
  useStorage,
  useTime,
  useTimezone,
  useValidateUser,
  useValidateExercise,
  useValidateFood,
  useValidateMoney,
  useValidateSleep,
  useValidateCalendar,
};