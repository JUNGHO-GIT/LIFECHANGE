// useValidateFood.tsx

import { useState, createRef, useRef } from "@imports/ImportReacts";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";

// -------------------------------------------------------------------------------------------------
export const useValidateFood = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { translate } = useLanguageStore();
  const { setALERT } = useAlertStore();

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
  validate.current = (OBJECT: any, COUNT: any, extra: string) => {

    // 1. goal -----------------------------------------------------------------------------------
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

      if (!OBJECT.food_goal_kcal || OBJECT.food_goal_kcal === "0") {
        return showAlertAndFocus('food_goal_kcal', "errorFoodGoalKcal", 0);
      }
      else if (!OBJECT.food_goal_carb || OBJECT.food_goal_carb === "0") {
        return showAlertAndFocus('food_goal_carb', "errorFoodGoalCarb", 0);
      }
      else if (!OBJECT.food_goal_protein || OBJECT.food_goal_protein === "0") {
        return showAlertAndFocus('food_goal_protein', "errorFoodGoalProtein", 0);
      }
      else if (!OBJECT.food_goal_fat || OBJECT.food_goal_fat === "0") {
        return showAlertAndFocus('food_goal_fat', "errorFoodGoalFat", 0);
      }
      return true;
    }

    // 2. real -----------------------------------------------------------------------------------
    else if (extra === "real") {
      const target = [
        "food_part_idx",
        "food_name",
        "food_kcal",
        "food_carb",
        "food_protein",
        "food_fat",
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

      const section = OBJECT.food_section;

      if (COUNT.newSectionCnt <= 0) {
        return showAlertAndFocus("", "errorCount", 0);
      }

      for (let i = 0; i < section.length; i++) {
        if (!section[i].food_part_idx || section[i].food_part_idx === 0) {
          return showAlertAndFocus('food_part_idx', "errorFoodPartIdx", i);
        }
        else if (!section[i].food_name || section[i].food_name === "") {
          return showAlertAndFocus('food_name', "errorFoodName", i);
        }
        else if (!section[i].food_kcal || section[i].food_kcal === "0") {
          return showAlertAndFocus('food_kcal', "errorFoodKcal", i);
        }
        else if (!section[i].food_carb || section[i].food_carb === "0") {
          return showAlertAndFocus('food_carb', "errorFoodCarb", i);
        }
        else if (!section[i].food_protein || section[i].food_protein === "0") {
          return showAlertAndFocus('food_protein', "errorFoodProtein", i);
        }
        else if (!section[i].food_fat || section[i].food_fat === "0") {
          return showAlertAndFocus('food_fat', "errorFoodFat", i);
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

      if (!OBJECT?._id || OBJECT?._id === "") {
        return showAlertAndFocus("", "noData", 0);
      }
      return true;
    }
  };

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};