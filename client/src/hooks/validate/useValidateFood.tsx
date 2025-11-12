// useValidateFood.tsx

import { createRef, useCallback, useRef, useState } from "@importReacts";
import { useStoreAlert, useStoreConfirm, useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
export const useValidateFood = () => {

	// 1. common ----------------------------------------------------------------------------------
	const { translate } = useStoreLanguage();
	const { setALERT } = useStoreAlert();
	const { setCONFIRM } = useStoreConfirm();

	// 2-2. useState -------------------------------------------------------------------------------
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

		// 7-1. goal -----------------------------------------------------------------------------------
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

		// 7-2. record -----------------------------------------------------------------------------------
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
        return alert("", "errorCount", 0);
      }

      for (let i = 0; i < section?.length; i++) {
        if (!section[i].food_record_part || section[i].food_record_part === "") {
          return alert('food_record_part', "errorFoodPart", i);
        }
        else if (!section[i].food_record_name || section[i].food_record_name === "") {
          return alert('food_record_name', "errorFoodName", i);
        }
        else if (!section[i].food_record_count || section[i].food_record_count === "0") {
          return alert('food_record_count', "errorFoodCount", i);
        }
        else if (!section[i].food_record_kcal) {
          return alert('food_record_kcal', "errorFoodKcal", i);
        }
        else if (!section[i].food_record_carb) {
          return alert('food_record_carb', "errorFoodCarb", i);
        }
        else if (!section[i].food_record_protein) {
          return alert('food_record_protein', "errorFoodProtein", i);
        }
        else if (!section[i].food_record_fat) {
          return alert('food_record_fat', "errorFoodFat", i);
        }
      }
      return true;
    }

		// 7-3. delete ---------------------------------------------------------------------------------
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
					return alert("", "noData", 0);
				}
				return true;
			}
			else {
				return false;
			}
		}
	};

	// 10. return ----------------------------------------------------------------------------------
	return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};