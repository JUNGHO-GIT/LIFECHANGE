
// useValidateExercise.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateExercise = () => {
  // 1. common -------------------------------------------------------------------------------------
  const { PATH } = useCommonValue();
  const { translate } = useTranslate();

  // 2-1. useRef -----------------------------------------------------------------------------------
  const REFS = useRef<any>({});
  const ERRORS = useRef<any>({});
  const validate = useRef<any>(() => {});

  // 2-2. useState ---------------------------------------------------------------------------------
  const [targetArray, setTargetArray] = useState<any>([]);
  const [objectSection, setObjectSection] = useState<any>([]);
  const [RESULT, setRESULT] = useState<any>({});

  // 4. handle -------------------------------------------------------------------------------------
  const handleShowAlertAndFocus = (target: string, msg: string, idx: number) => {
    alert(translate(msg));
    REFS.current?.[idx]?.[target]?.current?.focus();
    ERRORS.current = {
      [idx]: {
        [target]: true,
      },
    };
    setRESULT((prev: any) => ({
      ...prev,
      returnValid: false,
    }));

    return RESULT;
  };

  // 4. handle -------------------------------------------------------------------------------------
  const handleSetTargetAndLogic = () => {
    // 1. goal/save
    if (PATH.includes("exercise/goal/save")) {
      setTargetArray([
        "exercise_goal_count",
        "exercise_goal_volume",
        "exercise_goal_cardio",
        "exercise_goal_weight",
      ]);
      validate.current = (OBJECT: any, COUNT: any, DATE: any) => {
        if (
          OBJECT.exercise_dateStart === DATE.dateStart &&
          OBJECT.exercise_dateEnd === DATE.dateEnd
        ) {
          setRESULT((prev: any) => ({
            ...prev,
            flowType: "update",
          }));
        }
        else {
          setRESULT((prev: any) => ({
            ...prev,
            flowType: "save",
          }));
        }

        if (COUNT.newSectionCnt === 0) {
          return handleShowAlertAndFocus(
            "count",
            "errorCount",
            0
          );
        }

        if (!OBJECT.exercise_goal_count || OBJECT.exercise_goal_count === "0") {
          return handleShowAlertAndFocus(
            "exercise_goal_count",
            "errorExerciseGoalCount",
            0
          );
        }
        else if (!OBJECT.exercise_goal_volume || OBJECT.exercise_goal_volume === "0") {
          return handleShowAlertAndFocus(
            "exercise_goal_volume",
            "errorExerciseGoalVolume",
            0
          );
        }
        else if (!OBJECT.exercise_goal_cardio || OBJECT.exercise_goal_cardio === "00:00") {
          return handleShowAlertAndFocus(
            "exercise_goal_cardio",
            "errorExerciseGoalCardio",
            0
          );
        }
        else if (!OBJECT.exercise_goal_weight || OBJECT.exercise_goal_weight === "0") {
          return handleShowAlertAndFocus(
            "exercise_goal_weight",
            "errorExerciseGoalWeight",
            0
          );
        }
        return RESULT;
      }
    }
    // 2. save
    else if (PATH.includes("/exercise/save")) {
      setTargetArray([
        "exercise_part_idx",
        "exercise_title_idx",
        "exercise_set",
        "exercise_rep",
        "exercise_kg",
      ]);
      validate.current = (OBJECT: any, COUNT: any, DATE: any) => {
        if (
          OBJECT.exercise_dateStart === DATE.dateStart &&
          OBJECT.exercise_dateEnd === DATE.dateEnd
        ) {
          setRESULT((prev: any) => ({
            ...prev,
            flowType: "update",
          }));
        }
        else {
          setRESULT((prev: any) => ({
            ...prev,
            flowType: "save",
          }));
        }

        if (COUNT.newSectionCnt === 0) {
          return handleShowAlertAndFocus(
            "count",
            "errorCount",
            0
          );
        }

        if (OBJECT.exercise_section && OBJECT.exercise_section.length > 0) {
          setObjectSection(OBJECT.exercise_section);
        }

        for (let i = 0; i < objectSection.length; i++) {
          if (!objectSection[i].exercise_part_idx || objectSection[i].exercise_part_idx === 0) {
            return handleShowAlertAndFocus(
              "exercise_part_idx",
              "errorExercisePartIdx",
              i
            );
          }
          else if (!objectSection[i].exercise_title_idx || objectSection[i].exercise_title_idx === 0) {
            return handleShowAlertAndFocus(
              "exercise_title_idx",
              "errorExerciseTitleIdx",
              i
            );
          }
          else if (!objectSection[i].exercise_set || objectSection[i].exercise_set === "0") {
            return handleShowAlertAndFocus(
              "exercise_set",
              "errorExerciseSet",
              i
            );
          }
          else if (!objectSection[i].exercise_rep || objectSection[i].exercise_rep === "0") {
            return handleShowAlertAndFocus(
              "exercise_rep",
              "errorExerciseRep",
              i
            );
          }
          else if (!objectSection[i].exercise_kg || objectSection[i].exercise_kg === "0") {
            return handleShowAlertAndFocus(
              "exercise_kg",
              "errorExerciseKg",
              i
            );
          }
        }
        return RESULT;
      };
    }
  };

  // 4. handle -------------------------------------------------------------------------------------
  const handleInitialize = () => {
    ERRORS.current = targetArray.reduce((acc: any, cur: string, idx: number) => {
      acc[idx] = {
        [cur]: false,
      };
      return acc;
    }, {});

    REFS.current = targetArray.reduce((acc: any, cur: string, idx: number) => {
      acc[idx] = {
        [cur]: createRef(),
      };
      return acc;
    }, {});
  };

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    handleSetTargetAndLogic();
    handleInitialize();
  }, [PATH]);

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS: ERRORS.current,
    REFS: REFS.current,
    validate: validate.current,
  };
};
