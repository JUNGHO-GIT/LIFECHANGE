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
  validate.current = async (OBJECT: any, COUNT: any, type: string, extra: string) => {

    // 7-1. exercise -----------------------------------------------------------------------------------
    if (type === "exercise") {
      // 7-1. goal
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
        setERRORS(
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: false
            }), {})
          ))
        );
        if (COUNT.newSectionCnt <= 0) {
          return alert("", "errorCount", 0);
        }
        else if (!OBJECT.exercise_goal_count || OBJECT.exercise_goal_count === "0") {
          return alert("exercise_goal_count", "errorExerciseGoalCount", 0);
        }
        else if (!OBJECT.exercise_goal_volume || OBJECT.exercise_goal_volume === "0") {
          return alert("exercise_goal_volume", "errorExerciseGoalVolume", 0);
        }
        else if (!OBJECT.exercise_goal_cardio || OBJECT.exercise_goal_cardio === "00:00") {
          return alert("exercise_goal_cardio", "errorExerciseGoalCardio", 0);
        }
        else if (!OBJECT.exercise_goal_scale || OBJECT.exercise_goal_scale === "0") {
          return alert("exercise_goal_scale", "errorExerciseGoalScale", 0);
        }
        return true;
      }

      // 7-2. record
      if (extra === "record") {
        const target = [
          "exercise_record_part",
          "exercise_record_title",
          "exercise_record_set",
          "exercise_record_rep",
          "exercise_record_weight",
        ];
        REFS.current = (
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: createRef()
            }), {})
          ))
        );
        setERRORS(
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: false
            }), {})
          ))
        );

        const section = OBJECT.calendar_exercise_section;
        if (COUNT.newSectionCnt <= 0) {
          return alert("", "errorCount", 0);
        }
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
        return true;
      }

      // 7-3. delete
      if (extra === "delete") {
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
        setERRORS(
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
            msg: translate(`confirmDelete`),
          }, (confirmed: boolean) => {
            resolve(confirmed);
          });
        });
        if (await confirmResult) {
          if (!OBJECT?._id || OBJECT?._id === "") {
            return alert("", "noData", 0);
          }
          return true;
        }
        else {
          return false;
        }
      }
    }

    // 7-2. food ---------------------------------------------------------------------------------------
    if (type === "food") {
      // 7-1. goal
      if (extra === "goal") {
        const target = [
          "food_goal_kcal",
          "food_goal_carb",
          "food_goal_protein",
          "food_goal_fat",
        ];
        REFS.current = (
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: createRef()
            }), {})
          ))
        );
        setERRORS(
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: false
            }), {})
          ))
        );
        if (COUNT.newSectionCnt <= 0) {
          return alert("", "errorCount", 0);
        }
        else if (!OBJECT.food_goal_kcal || OBJECT.food_goal_kcal === "0") {
          return alert("food_goal_kcal", "errorFoodGoalKcal", 0);
        }
        else if (!OBJECT.food_goal_carb || OBJECT.food_goal_carb === "0") {
          return alert("food_goal_carb", "errorFoodGoalCarb", 0);
        }
        else if (!OBJECT.food_goal_protein || OBJECT.food_goal_protein === "0") {
          return alert("food_goal_protein", "errorFoodGoalProtein", 0);
        }
        else if (!OBJECT.food_goal_fat || OBJECT.food_goal_fat === "0") {
          return alert("food_goal_fat", "errorFoodGoalFat", 0);
        }
        return true;
      }

      // 7-2. record
      if (extra === "record") {
        const target = [
          "food_record_part",
          "food_record_name",
          "food_record_brand",
          "food_record_count",
          "food_record_gram",
          "food_record_kcal",
          "food_record_carb",
          "food_record_protein",
          "food_record_fat",
        ];
        REFS.current = (
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: createRef()
            }), {})
          ))
        );
        setERRORS(
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: false
            }), {})
          ))
        );

        const section = OBJECT.calendar_food_section;
        if (COUNT.newSectionCnt <= 0) {
          return alert("", "errorCount", 0);
        }

        for (let i = 0; i < section?.length; i++) {
          if (!section[i].food_record_part || section[i].food_record_part === "") {
            return alert("food_record_part", "errorFoodPart", i);
          }
          else if (!section[i].food_record_name || section[i].food_record_name === "") {
            return alert("food_record_name", "errorFoodName", i);
          }
          else if (!section[i].food_record_count || section[i].food_record_count === "0") {
            return alert("food_record_count", "errorFoodCount", i);
          }
          else if (!section[i].food_record_kcal) {
            return alert("food_record_kcal", "errorFoodKcal", i);
          }
          else if (!section[i].food_record_carb) {
            return alert("food_record_carb", "errorFoodCarb", i);
          }
          else if (!section[i].food_record_protein) {
            return alert("food_record_protein", "errorFoodProtein", i);
          }
          else if (!section[i].food_record_fat) {
            return alert("food_record_fat", "errorFoodFat", i);
          }
        }
        return true;
      }

      // 7-3. delete
      if (extra === "delete") {
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
        setERRORS(
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
            msg: translate(`confirmDelete`),
          }, (confirmed: boolean) => {
            resolve(confirmed);
          });
        });
        if (await confirmResult) {
          if (!OBJECT?._id || OBJECT?._id === "") {
            return alert("", "noData", 0);
          }
          return true;
        }
        else {
          return false;
        }
      }
    }

    // 7-3. money --------------------------------------------------------------------------------------
    if (type === "money") {
      // 7-1. goal
      if (extra === "goal") {
        const target = [
          "money_goal_income",
          "money_goal_expense"
        ];
        REFS.current = (
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: createRef()
            }), {})
          ))
        );
        setERRORS(
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: false
            }), {})
          ))
        );
        if (COUNT.newSectionCnt <= 0) {
          return alert("", "errorCount", 0);
        }
        else if (!OBJECT.money_goal_income || OBJECT.money_goal_income === "0") {
          return alert("money_goal_income", "errorMoneyGoalIncome", 0);
        }
        else if (!OBJECT.money_goal_expense || OBJECT.money_goal_expense === "0") {
          return alert("money_goal_expense", "errorMoneyGoalExpense", 0);
        }
        return true;
      }

      // 7-2. record
      if (extra === "record") {
        const target = [
          "money_record_part",
          "money_record_title",
          "money_record_amount"
        ];
        REFS.current = (
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: createRef()
            }), {})
          ))
        );
        setERRORS(
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: false
            }), {})
          ))
        );

        const section = OBJECT.calendar_money_section;
        if (COUNT.newSectionCnt <= 0) {
          return alert("", "errorCount", 0);
        }

        for (let i = 0; i < section?.length; i++) {
          if (!section[i]?.money_record_part || section[i].money_record_part === "all") {
            return alert("money_record_part", "errorMoneyPart", i);
          }
          else if (!section[i]?.money_record_title || section[i].money_record_title === "all") {
            return alert("money_record_title", "errorMoneyTitle", i);
          }
          else if (!section[i]?.money_record_amount) {
            return alert("money_record_amount", "errorMoneyAmount", i);
          }
        }
        return true;
      }

      // 7-3. delete
      if (extra === "delete") {
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
        setERRORS(
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
            msg: translate(`confirmDelete`),
          }, (confirmed: boolean) => {
            resolve(confirmed);
          });
        });
        if (await confirmResult) {
          if (!OBJECT?._id || OBJECT?._id === "") {
            return alert("", "noData", 0);
          }
          return true;
        }
        else {
          return false;
        }
      }
    }

    // 7-4. sleep --------------------------------------------------------------------------------------
    if (type === "sleep") {
      // 7-1. goal
      if (extra === "goal") {
        const target = [
          "sleep_goal_bedTime",
          "sleep_goal_wakeTime",
          "sleep_goal_sleepTime",
        ];
        REFS.current = (
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: createRef()
            }), {})
          ))
        );
        setERRORS(
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: false
            }), {})
          ))
        );
        if (COUNT.newSectionCnt <= 0) {
          return alert("", "errorCount", 0);
        }
        else if (!OBJECT.sleep_goal_bedTime || OBJECT.sleep_goal_bedTime === "00:00") {
          return alert("sleep_goal_bedTime", "errorSleepGoalBedTime", 0);
        }
        else if (!OBJECT.sleep_goal_wakeTime || OBJECT.sleep_goal_wakeTime === "00:00") {
          return alert("sleep_goal_wakeTime", "errorSleepGoalWakeTime", 0);
        }
        else if (!OBJECT.sleep_goal_sleepTime) {
          return alert("sleep_goal_sleepTime", "errorSleepGoalSleepTime", 0);
        }
        return true;
      }

      // 7-2. record
      if (extra === "record") {
        const target = [
          "sleep_record_bedTime",
          "sleep_record_wakeTime",
          "sleep_record_sleepTime",
        ];
        REFS.current = (
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: createRef()
            }), {})
          ))
        );
        setERRORS(
          Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
            target.reduce((acc, cur) => ({
              ...acc,
              [cur]: false
            }), {})
          ))
        );

        const section = OBJECT.calendar_sleep_section;
        if (COUNT.newSectionCnt <= 0) {
          return alert("", "errorCount", 0);
        }
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
        return true;
      }

      // 7-3. delete
      if (extra === "delete") {
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
        setERRORS(
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
            msg: translate(`confirmDelete`),
          }, (confirmed: boolean) => {
            resolve(confirmed);
          });
        });
        if (await confirmResult) {
          if (!OBJECT?._id || OBJECT?._id === "") {
            return alert("", "noData", 0);
          }
          return true;
        }
        else {
          return false;
        }
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
