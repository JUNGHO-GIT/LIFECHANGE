/**
 * @file useValidateCalendar.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { React, useCallback, useRef, useState } from "@exportReacts";
import { useStoreAlert, useStoreConfirm, useStoreLanguage } from "@exportStores";

// 구조 타입 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
type FieldRefs = Record<string, React.RefObject<unknown>>;
type FieldErrors = Record<string, boolean>;
type CalendarSection = Record<string, string>;
type CalendarObject = {
  calendar_exercise_section: CalendarSection[];
  calendar_food_section: CalendarSection[];
  calendar_money_section: CalendarSection[];
  calendar_sleep_section: CalendarSection[];
};
type CalendarCount = {
  newSectionCnt: number;
};
type CalendarValidate = (
  OBJECT: CalendarObject, COUNT: CalendarCount, extra: string
) => Promise<boolean>;

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const useValidateCalendar = () => {

  // 1. common ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setCONFIRM } = useStoreConfirm();

  // 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const REFS: React.RefObject<FieldRefs[]> = useRef<FieldRefs[]>([]);
  const validate: React.RefObject<CalendarValidate> = useRef<CalendarValidate>(async () => false);
  const [ ERRORS, setERRORS ] = useState<FieldErrors[]>([]);

  // alert 표시 및 focus ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const alert = useCallback((field: string, msg: string, idx: number) => {
    setALERT({
      open: true,
      msg: translate(msg),
      severity: `error`,
    });
    field && setTimeout(() => {
      (REFS?.current?.[idx]?.[field]?.current as { focus?: () => void } | undefined)?.focus?.();
    }, 0);
    field && setERRORS((prev) => {
      const updatedErrors: FieldErrors[] = [...prev];
      updatedErrors[idx] = {
        ...updatedErrors[idx],
        [field]: true,
      };
      return updatedErrors;
    });
  }, [ setALERT, translate ]);

  // 7. validate ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  validate.current = async (OBJECT, COUNT, extra) => {
    // 7-1. record
    if (extra === `record`) {

      // 각 섹션별로 데이터가 있는지 확인
      const hasExercise: boolean = OBJECT?.calendar_exercise_section?.length > 0;
      const hasFood: boolean = OBJECT?.calendar_food_section?.length > 0;
      const hasMoney: boolean = OBJECT?.calendar_money_section?.length > 0;
      const hasSleep: boolean = OBJECT?.calendar_sleep_section?.length > 0;

      // 섹션이 하나도 없으면 에러
      if (!hasExercise && !hasFood && !hasMoney && !hasSleep) {
        alert(``, `errorCount`, 0);
        return false;
      }

      // exercise 섹션 검증
      if (hasExercise) {
        const section = OBJECT.calendar_exercise_section;
        for (let i = 0; i < section.length; i++) {
          if (!section[i].exercise_record_part || section[i].exercise_record_part === `all`) {
            alert(`exercise_record_part`, `errorExercisePart`, i);
            return false;
          }
          if (!section[i].exercise_record_title || section[i].exercise_record_title === `all`) {
            alert(`exercise_record_title`, `errorExerciseTitle`, i);
            return false;
          }
          if (!section[i].exercise_record_set || section[i].exercise_record_set === `0`) {
            alert(`exercise_record_set`, `errorExerciseSet`, i);
            return false;
          }
          if (!section[i].exercise_record_rep || section[i].exercise_record_rep === `0`) {
            alert(`exercise_record_rep`, `errorExerciseRep`, i);
            return false;
          }
          if (!section[i].exercise_record_weight || section[i].exercise_record_weight === `0`) {
            alert(`exercise_record_weight`, `errorExerciseKg`, i);
            return false;
          }
        }
      }

      // food 섹션 검증
      if (hasFood) {
        const section = OBJECT.calendar_food_section;
        for (let i = 0; i < section.length; i++) {
          if (!section[i].food_record_part || section[i].food_record_part === `all`) {
            alert(`food_record_part`, `errorFoodPart`, i);
            return false;
          }
          if (!section[i].food_record_name || section[i].food_record_name === ``) {
            alert(`food_record_name`, `errorFoodName`, i);
            return false;
          }
          if (!section[i].food_record_kcal || section[i].food_record_kcal === `0`) {
            alert(`food_record_kcal`, `errorFoodKcal`, i);
            return false;
          }
        }
      }

      // money 섹션 검증
      if (hasMoney) {
        const section = OBJECT.calendar_money_section;
        for (let i = 0; i < section.length; i++) {
          if (!section[i].money_record_part || section[i].money_record_part === `all`) {
            alert(`money_record_part`, `errorMoneyPart`, i);
            return false;
          }
          if (!section[i].money_record_title || section[i].money_record_title === `all`) {
            alert(`money_record_title`, `errorMoneyTitle`, i);
            return false;
          }
          if (!section[i].money_record_amount || section[i].money_record_amount === `0`) {
            alert(`money_record_amount`, `errorMoneyAmount`, i);
            return false;
          }
        }
      }

      // sleep 섹션 검증
      if (hasSleep) {
        const section = OBJECT.calendar_sleep_section;
        for (let i = 0; i < section.length; i++) {
          if (!section[i].sleep_record_bedTime || section[i].sleep_record_bedTime === `00:00`) {
            alert(`sleep_record_bedTime`, `errorSleepBedTime`, i);
            return false;
          }
          if (!section[i].sleep_record_wakeTime || section[i].sleep_record_wakeTime === `00:00`) {
            alert(`sleep_record_wakeTime`, `errorSleepWakeTime`, i);
            return false;
          }
          if (!section[i].sleep_record_sleepTime) {
            alert(`sleep_record_sleepTime`, `errorSleepSleepTime`, i);
            return false;
          }
        }
      }
      return true;
    }

    // 7-2. delete
    if (extra === `delete`) {
      const confirmResult: boolean = await new Promise<boolean>((resolve) => {
        setCONFIRM({
          open: true,
          msg: translate(`confirmDelete`),
        }, (confirmed: boolean) => {
          resolve(confirmed);
        });
      });
      return confirmResult;
    }
    return false;
  };

  // 10. return ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};
