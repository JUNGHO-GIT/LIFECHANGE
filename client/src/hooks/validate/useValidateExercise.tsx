// useValidateExercise.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateExercise= () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    PATH,
  } = useCommonValue();
  const {
    translate,
  } = useTranslate();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState<any>({});
  const REFS: any = useRef<any>({});
  const validate = useRef<any>(() => {});
  let returnValid = false;

  // 에러 메시지 출력 및 포커스
  const showAlertAndFocus = (field: string, msg: string, idx: number) => {
    alert(translate(msg));
    REFS.current?.[idx]?.[field]?.current?.focus();
    setERRORS({
      [idx]: {
        [field]: true,
      },
    });
    return returnValid;
  };

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    // 1. goal/save
    if (PATH.includes("exercise/goal/save")) {
      const target = [
        "exercise_goal_count",
        "exercise_goal_volume",
        "exercise_goal_cardio",
        "exercise_goal_weight",
      ];
      setERRORS(
        target.reduce((acc: any[], cur: string) => {
          acc.push({
            [cur]: false
          });
          return acc;
        }, [])
      );
      REFS.current = (
        target.reduce((acc: any[], cur: string) => {
          acc.push({
            [cur]: createRef()
          });
          return acc;
        }, [])
      );
      validate.current = (OBJECT: any, COUNT: any, DATE: any, EXIST: any) => {

        // 카운트가 0인 경우
        if (COUNT.newSectionCnt === 0) {
          alert(translate("errorCount"));
          return returnValid;
        }

        // EXIST 배열에서 바로 필터링 조건 적용
        for (let i = 0; i < EXIST.length; i++) {
          if (EXIST[i] === DATE.dateStart && EXIST[i] === DATE.dateEnd) {
            const confirm = window.confirm(translate("dataAlreadyExist"));
            if (confirm) {
              return !returnValid;
            }
            else {
              return returnValid;
            }
          }
        }
        if (!OBJECT.exercise_goal_count || OBJECT.exercise_goal_count === "0") {
          return showAlertAndFocus('exercise_goal_count', "errorExerciseGoalCount", 0);
        }
        else if (!OBJECT.exercise_goal_volume || OBJECT.exercise_goal_volume === "0") {
          return showAlertAndFocus('exercise_goal_volume', "errorExerciseGoalVolume", 0);
        }
        else if (!OBJECT.exercise_goal_cardio || OBJECT.exercise_goal_cardio === "00:00") {
          return showAlertAndFocus('exercise_goal_cardio', "errorExerciseGoalCardio", 0);
        }
        else if (!OBJECT.exercise_goal_weight || OBJECT.exercise_goal_weight === "0") {
          return showAlertAndFocus('exercise_goal_weight', "errorExerciseGoalWeight", 0);
        }
        return !returnValid;
      };
    }

    // 2. save
    else if (PATH.includes("exercise/save")) {
      const target = [
        "exercise_part_idx",
        "exercise_title_idx",
        "exercise_set",
        "exercise_rep",
        "exercise_kg",
      ];
      setERRORS(
        target.reduce((acc: any[], cur: string) => {
          acc.push({
            [cur]: false
          });
          return acc;
        }, [])
      );
      REFS.current = (
        target.reduce((acc: any[], cur: string) => {
          acc.push({
            [cur]: createRef()
          });
          return acc;
        }, [])
      );
      validate.current = (OBJECT: any, COUNT: any, DATE: any, EXIST: any) => {
        if (OBJECT.exercise_total_weight && OBJECT.exercise_total_weight !== "0") {
          return true;
        }

        // 카운트가 0인 경우
        if (COUNT.newSectionCnt === 0) {
          alert(translate("errorCount"));
          return returnValid;
        }

        // EXIST 배열에서 바로 필터링 조건 적용
        for (let i = 0; i < EXIST.length; i++) {
          if (EXIST[i] === DATE.dateStart && EXIST[i] === DATE.dateEnd) {
            const confirm = window.confirm(translate("dataAlreadyExist"));
            if (confirm) {
              return !returnValid;
            }
            else {
              return returnValid;
            }
          }
        }
        const section = OBJECT.exercise_section;
        for (let i = 0; i < section.length; i++) {
          if (!section[i].exercise_part_idx || section[i].exercise_part_idx === 0) {
            return showAlertAndFocus('exercise_part_idx', "errorExercisePart", i);
          }
          else if (!section[i].exercise_title_idx || section[i].exercise_title_idx === 0) {
            return showAlertAndFocus('exercise_title_idx', "errorExerciseTitle", i);
          }
          else if (!section[i].exercise_set || section[i].exercise_set === "0") {
            return showAlertAndFocus('exercise_set', "errorExerciseSet", i);
          }
          else if (!section[i].exercise_rep || section[i].exercise_rep === "0") {
            return showAlertAndFocus('exercise_rep', "errorExerciseRep", i);
          }
          else if (!section[i].exercise_kg || section[i].exercise_kg === "0") {
            return showAlertAndFocus('exercise_kg', "errorExerciseKg", i);
          }
        }
        return !returnValid;
      };
    }
  }, [PATH]);

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS,
    REFS,
    validate: validate.current,
  };
};
