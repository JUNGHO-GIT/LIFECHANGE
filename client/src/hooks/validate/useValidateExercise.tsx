// useValidateExercise.tsx

import { useState, createRef, useRef } from "@importReacts";
import { useStoreLanguage, useStoreAlert, useStoreConfirm } from "@importStores";

// -------------------------------------------------------------------------------------------------
export const useValidateExercise = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setCONFIRM } = useStoreConfirm();

  // 2-2. useState ---------------------------------------------------------------------------------
  const REFS = useRef<any[]>([]);
  const [ERRORS, setERRORS] = useState<any[]>([]);
  const validate = useRef<Function>(() => {});

  // alert 표시 및 focus ---------------------------------------------------------------------------
  const showAlertAndFocus = (field: string, msg: string, idx: number) => {
    setALERT({
      open: true,
      msg: translate(msg),
      severity: "error",
    });
    if (field) {
      setTimeout(() => {
        REFS?.current?.[idx]?.[field]?.current?.focus();
      }, 10);
      setERRORS((prev) => {
        const updatedErrors = [...prev];
        updatedErrors[idx] = {
          ...updatedErrors[idx],
          [field]: true,
        };
        return updatedErrors;
      });
    }
    return false;
  };

  // 7. validate -----------------------------------------------------------------------------------
  validate.current = async (OBJECT: any, COUNT: any, extra: string) => {

    // 1. goal -----------------------------------------------------------------------------------
    if (extra === "goal") {
      const target = [
        "exercise_goal_count",
        "exercise_goal_volume",
        "exercise_goal_cardio",
        "exercise_goal_scale",
      ];
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: createRef()
          }), {})
        ))
      );
      setERRORS (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: false
          }), {})
        ))
      );

      if (COUNT.newSectionCnt <= 0) {
        return showAlertAndFocus("", "errorCount", 0);
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
      else if (!OBJECT.exercise_goal_scale || OBJECT.exercise_goal_scale === "0") {
        return showAlertAndFocus('exercise_goal_scale', "errorExerciseGoalScale", 0);
      }
      return true;
    }

    // 2. real -----------------------------------------------------------------------------------
    else if (extra === "real") {
      const target = [
        "exercise_part",
        "exercise_title",
        "exercise_set",
        "exercise_rep",
        "exercise_weight",
      ];
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: createRef()
          }), {})
        ))
      );
      setERRORS (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: false
          }), {})
        ))
      );

      const section = OBJECT.exercise_section;
      if (COUNT.newSectionCnt <= 0) {
        return showAlertAndFocus("", "errorCount", 0);
      }
      for (let i = 0; i < section?.length; i++) {
        if (!section[i].exercise_part || section[i].exercise_part === "") {
          return showAlertAndFocus('exercise_part', "errorExercisePart", i);
        }
        else if (!section[i].exercise_title || section[i].exercise_title === "") {
          return showAlertAndFocus('exercise_title', "errorExerciseTitle", i);
        }
        else if (!section[i].exercise_set || section[i].exercise_set === "0") {
          return showAlertAndFocus('exercise_set', "errorExerciseSet", i);
        }
        else if (!section[i].exercise_rep || section[i].exercise_rep === "0") {
          return showAlertAndFocus('exercise_rep', "errorExerciseRep", i);
        }
        else if (!section[i].exercise_weight || section[i].exercise_weight === "0") {
          return showAlertAndFocus('exercise_weight', "errorExerciseKg", i);
        }
      }
      return true;
    }

    // 3. delete ---------------------------------------------------------------------------------
    else if (extra === "delete") {
      const target = [
        "_id",
      ];
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: createRef()
          }), {})
        ))
      );
      setERRORS (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: false
          }), {})
        ))
      );
      const confirmResult = new Promise((resolve) => {
        setCONFIRM({
          open: true,
          msg: translate("confirmDelete"),
        }, (confirmed: boolean) => {
          resolve(confirmed);
        });
      });

      if (await confirmResult) {
        if (!OBJECT?._id || OBJECT?._id === "") {
          return showAlertAndFocus("", "noData", 0);
        }
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