// useValidateExercise.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateExercise= () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    PATH, TITLE
  } = useCommonValue();
  const {
    translate
  } = useTranslate();

  // 2-2. useState ---------------------------------------------------------------------------------
  const REFS: any = useRef<any>({});
  const [ERRORS, setERRORS] = useState<any>({});
  const validate = useRef<any>(() => {});

  let returnType = "";
  let returnValid = false;

  // -----------------------------------------------------------------------------------------------
  const showAlertAndFocus = (field: string, msg: string, idx: number) => {
    alert(translate(msg));
    REFS.current?.[idx]?.[field]?.current?.focus();
    setERRORS({
      [idx]: {
        [field]: true,
      },
    });
    return {
      type: returnType,
      valid: returnValid,
    };
  };

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    // 1. goal/detail
    if (PATH.includes("exercise/goal/detail")) {
      const target = [
        "exercise_goal_count",
        "exercise_goal_volume",
        "exercise_goal_cardio",
        "exercise_goal_weight",
      ];
      setERRORS(target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: false
        });
        return acc;
      }, []));
      REFS.current = (target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: createRef()
        });
        return acc;
      }, []));
      validate.current = (OBJECT: any, COUNT: any) => {
        if (COUNT.newSectionCnt === 0) {
          alert(translate("errorCount"));
          return {
            type: returnType,
            valid: returnValid,
          };
        }
        else if (!OBJECT.exercise_goal_count || OBJECT.exercise_goal_count === "0") {
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
        return {
          type: returnType,
          valid: !returnValid,
        };
      };
    }

    // 2. save
    else if (PATH.includes("exercise/detail")) {
      const target = [
        "exercise_part_idx",
        "exercise_title_idx",
        "exercise_set",
        "exercise_rep",
        "exercise_kg",
      ];
      setERRORS(target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: false
        });
        return acc;
      }, []));
      REFS.current = (target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: createRef()
        });
        return acc;
      }, []));
      validate.current = (OBJECT: any, COUNT: any, DATE: any, EXIST: any) => {
        console.log("OBJECT", JSON.stringify(OBJECT, null, 2));
        console.log("COUNT", JSON.stringify(COUNT, null, 2));
        console.log("DATE", JSON.stringify(DATE, null, 2));
        console.log("EXIST", JSON.stringify(EXIST, null, 2));
        EXIST[DATE.dateType].map((item: string) => {
          // 해당 날짜에 데이터가 있는 경우
          if (`${DATE.dateStart} ~ ${DATE.dateEnd}` === item) {
            // 1. 현재 날짜와 같은 경우
            if (`${OBJECT.exercise_dateStart} ~ ${OBJECT.exercise_dateEnd}` === item) {
              sessionStorage.setItem(`${TITLE}_returnType`, "update");
              returnType = "update";
            }
            // 2. 현재 날짜와 다른 경우
            else {
              sessionStorage.setItem(`${TITLE}_returnType`, "insert");
              returnType = "insert";
            }
          }
          // 해당 날짜에 데이터가 없는 경우
          else {
            sessionStorage.setItem(`${TITLE}_returnType`, "create");
            returnType = "create";
          }
        });
        const section = OBJECT.exercise_section;
        for (let i = 0; i < section.length; i++) {
          if (COUNT.newSectionCnt === 0) {
            alert(translate("errorCount"));
            return {
              type: returnType,
              valid: returnValid,
            };
          }
          else if (!section[i].exercise_part_idx || section[i].exercise_part_idx === 0) {
            return showAlertAndFocus('exercise_part_idx', "errorExercisePartIdx", i);
          }
          else if (!section[i].exercise_title_idx || section[i].exercise_title_idx === 0) {
            return showAlertAndFocus('exercise_title_idx', "errorExerciseTitleIdx", i);
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
          return {
            type: returnType,
            valid: !returnValid,
          };
        }
      };
    }
  }, [PATH]);

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};