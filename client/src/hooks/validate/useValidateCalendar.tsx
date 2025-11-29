// useValidateCalendar.tsx

import { createRef, useCallback, useRef, useState } from "@exportReacts";
import { useStoreAlert, useStoreConfirm, useStoreLanguage } from "@exportStores";

// -------------------------------------------------------------------------------------------------
export const useValidateCalendar = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setCONFIRM } = useStoreConfirm();

  // 2-2. useState ---------------------------------------------------------------------------------
  const REFS = useRef<any[]>([]);
  const [ERRORS, setERRORS] = useState<any[]>([]);
  const validate = useRef<Function>(() => {});

  // alert 표시 및 focus ---------------------------------------------------------------------------
  const alert = useCallback((field: string, msg: string, idx: number) => {
    setALERT({
      open: true,
      msg: translate(msg),
      severity: "error",
    });
    field && setTimeout(() => {
      REFS?.current?.[idx]?.[field]?.current?.focus();
    }, 0);
    field && setERRORS((prev) => {
      const updatedErrors = [...prev];
      updatedErrors[idx] = {
        ...updatedErrors[idx],
        [field]: true,
      };
      return updatedErrors;
    });
  }, [setALERT, translate]);

  // 7. validate -----------------------------------------------------------------------------------
  validate.current = async (OBJECT: any, COUNT: any, extra: string) => {

    // 7-1. record
    if (extra === "record") {
      // 각 섹션별로 데이터가 있는지 확인
      const hasExercise = OBJECT?.calendar_exercise_section?.length > 0;
      const hasFood = OBJECT?.calendar_food_section?.length > 0;
      const hasMoney = OBJECT?.calendar_money_section?.length > 0;
      const hasSleep = OBJECT?.calendar_sleep_section?.length > 0;

      // 섹션이 하나도 없으면 에러
      if (!hasExercise && !hasFood && !hasMoney && !hasSleep) {
        return alert("", "errorCount", 0);
      }

      // exercise 섹션 검증
      if (hasExercise) {
        const section = OBJECT.calendar_exercise_section;
        for (let i = 0; i < section?.length; i++) {
          if (!section[i].exercise_record_part || section[i].exercise_record_part === "all") {
            return alert("exercise_record_part", "errorExercisePart", i);
          }
          else if (!section[i].exercise_record_title || section[i].exercise_record_title === "all") {
            return alert("exercise_record_title", "errorExerciseTitle", i);
          }
          else if (!section[i].exercise_record_set || section[i].exercise_record_set === "0") {
            return alert("exercise_record_set", "errorExerciseSet", i);
          }
          else if (!section[i].exercise_record_rep || section[i].exercise_record_rep === "0") {
            return alert("exercise_record_rep", "errorExerciseRep", i);
          }
          else if (!section[i].exercise_record_weight || section[i].exercise_record_weight === "0") {
            return alert("exercise_record_weight", "errorExerciseKg", i);
          }
        }
      }

      // food 섹션 검증
      if (hasFood) {
        const section = OBJECT.calendar_food_section;
        for (let i = 0; i < section?.length; i++) {
          if (!section[i].food_record_part || section[i].food_record_part === "all") {
            return alert("food_record_part", "errorFoodPart", i);
          }
          else if (!section[i].food_record_name || section[i].food_record_name === "") {
            return alert("food_record_name", "errorFoodName", i);
          }
          else if (!section[i].food_record_kcal || section[i].food_record_kcal === "0") {
            return alert("food_record_kcal", "errorFoodKcal", i);
          }
        }
      }

      // money 섹션 검증
      if (hasMoney) {
        const section = OBJECT.calendar_money_section;
        for (let i = 0; i < section?.length; i++) {
          if (!section[i].money_record_part || section[i].money_record_part === "all") {
            return alert("money_record_part", "errorMoneyPart", i);
          }
          else if (!section[i].money_record_title || section[i].money_record_title === "all") {
            return alert("money_record_title", "errorMoneyTitle", i);
          }
          else if (!section[i].money_record_amount || section[i].money_record_amount === "0") {
            return alert("money_record_amount", "errorMoneyAmount", i);
          }
        }
      }

      // sleep 섹션 검증
      if (hasSleep) {
        const section = OBJECT.calendar_sleep_section;
        for (let i = 0; i < section?.length; i++) {
          if (!section[i].sleep_record_bedTime || section[i].sleep_record_bedTime === "00:00") {
            return alert("sleep_record_bedTime", "errorSleepBedTime", i);
          }
          else if (!section[i].sleep_record_wakeTime || section[i].sleep_record_wakeTime === "00:00") {
            return alert("sleep_record_wakeTime", "errorSleepWakeTime", i);
          }
          else if (!section[i].sleep_record_sleepTime) {
            return alert("sleep_record_sleepTime", "errorSleepSleepTime", i);
          }
        }
      }
      return true;
    }

    // 7-2. delete
    if (extra === "delete") {
      const confirmResult = new Promise((resolve) => {
        setCONFIRM({
          open: true,
          msg: translate(`confirmDelete`),
        }, (confirmed: boolean) => {
          resolve(confirmed);
        });
      });
      if (await confirmResult) {
        return true;
      }
      else {
        return false;
      }
    }
  };

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};
