/**
 * @file useValidateFood.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { React, createRef, useCallback, useRef, useState } from "@exportReacts";
import { useStoreAlert, useStoreConfirm, useStoreLanguage } from "@exportStores";

// 구조 타입 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
type FieldRefs = Record<string, React.RefObject<unknown>>;
type FieldErrors = Record<string, boolean>;
type FoodSection = Record<string, string>;
type FoodObject = {
  _id?: string;
  food_goal_kcal?: string;
  food_goal_carb?: string;
  food_goal_protein?: string;
  food_goal_fat?: string;
  food_section?: FoodSection[];
};
type FoodCount = {
  newSectionCnt: number;
};
type FoodValidate = (
  OBJECT: FoodObject, COUNT: FoodCount, extra: string
) => Promise<boolean>;

// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const useValidateFood = () => {
  // 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setCONFIRM } = useStoreConfirm();

  // 2-2. useState ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const REFS: React.RefObject<FieldRefs[]> = useRef<FieldRefs[]>([]);
  const validate: React.RefObject<FoodValidate> = useRef<FoodValidate>(async () => false);
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
    // 7-1. goal
    if (extra === `goal`) {
      const target: string[] = [
        `food_goal_kcal`,
        `food_goal_carb`,
        `food_goal_protein`,
        `food_goal_fat`,
      ];
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );
      if (COUNT.newSectionCnt <= 0) {
        alert(``, `errorCount`, 0);
        return false;
      }
      if (!OBJECT.food_goal_kcal || OBJECT.food_goal_kcal === `0`) {
        alert(`food_goal_kcal`, `errorFoodGoalKcal`, 0);
        return false;
      }
      if (!OBJECT.food_goal_carb || OBJECT.food_goal_carb === `0`) {
        alert(`food_goal_carb`, `errorFoodGoalCarb`, 0);
        return false;
      }
      if (!OBJECT.food_goal_protein || OBJECT.food_goal_protein === `0`) {
        alert(`food_goal_protein`, `errorFoodGoalProtein`, 0);
        return false;
      }
      if (!OBJECT.food_goal_fat || OBJECT.food_goal_fat === `0`) {
        alert(`food_goal_fat`, `errorFoodGoalFat`, 0);
        return false;
      }
      return true;
    }

    // 7-2. record
    if (extra === `record`) {
      const target: string[] = [
        `food_record_part`,
        `food_record_name`,
        `food_record_brand`,
        `food_record_count`,
        `food_record_gram`,
        `food_record_kcal`,
        `food_record_carb`,
        `food_record_protein`,
        `food_record_fat`,
      ];
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );

      const section = OBJECT.food_section ?? [];
      if (COUNT.newSectionCnt <= 0) {
        alert(``, `errorCount`, 0);
        return false;
      }
      for (let i = 0; i < section.length; i++) {
        if (!section[i].food_record_part || section[i].food_record_part === ``) {
          alert(`food_record_part`, `errorFoodPart`, i);
          return false;
        }
        if (!section[i].food_record_name || section[i].food_record_name === ``) {
          alert(`food_record_name`, `errorFoodName`, i);
          return false;
        }
        if (!section[i].food_record_count || section[i].food_record_count === `0`) {
          alert(`food_record_count`, `errorFoodCount`, i);
          return false;
        }
        if (!section[i].food_record_kcal) {
          alert(`food_record_kcal`, `errorFoodKcal`, i);
          return false;
        }
        if (!section[i].food_record_carb) {
          alert(`food_record_carb`, `errorFoodCarb`, i);
          return false;
        }
        if (!section[i].food_record_protein) {
          alert(`food_record_protein`, `errorFoodProtein`, i);
          return false;
        }
        if (!section[i].food_record_fat) {
          alert(`food_record_fat`, `errorFoodFat`, i);
          return false;
        }
      }
      return true;
    }

    // 7-3. delete
    if (extra === `delete`) {
      const target: string[] = [`_id`];
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );
      const confirmResult: boolean = await new Promise<boolean>((resolve) => {
        setCONFIRM({
          open: true,
          msg: translate(`confirmDelete`),
        }, (confirmed: boolean) => {
          resolve(confirmed);
        });
      });
      if (confirmResult) {
        if (!OBJECT?._id || OBJECT?._id === ``) {
          alert(``, `noData`, 0);
          return false;
        }
        return true;
      }
      return false;
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
