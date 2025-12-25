/**
 * @file useValidateFood.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { React, createRef, useCallback, useRef, useState } from "@exportReacts";
import { useStoreAlert, useStoreConfirm, useStoreLanguage } from "@exportStores";

// -------------------------------------------------------------------------------------------------
export const useValidateFood = () => {
	// 1. common -------------------------------------------------------------------------------------
	const { translate } = useStoreLanguage();
	const { setALERT } = useStoreAlert();
	const { setCONFIRM } = useStoreConfirm();

	// 2-2. useState ---------------------------------------------------------------------------------
	const REFS: React.RefObject<unknown[]> = useRef<unknown[]>([]);
	const validate: React.RefObject<Function> = useRef<Function>(() => {});
	const [ERRORS, setERRORS] = useState<unknown[]>([]);

	// alert 표시 및 focus ---------------------------------------------------------------------------
	const alert = useCallback((field: string, msg: string, idx: number) => {
		setALERT({
			open: true,
			msg: translate(msg),
			severity: `error`,
		});
		field && setTimeout(() => {
			REFS?.current?.[idx]?.[field]?.current?.focus();
		}, 0);
		field && setERRORS((prev) => {
			const updatedErrors: unknown[] = [...prev];
			updatedErrors[idx] = {
				...updatedErrors[idx],
				[field]: true,
			};
			return updatedErrors;
		});
	}, [setALERT, translate]);

	// 7. validate -----------------------------------------------------------------------------------
	validate.current = async (OBJECT: unknown, COUNT: unknown, extra: string): Promise<boolean> => {
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
					Object.fromEntries(target.map((cur) => [cur, createRef()]))
				))
			);
			setERRORS(
				Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
					Object.fromEntries(target.map((cur) => [cur, false]))
				))
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
					Object.fromEntries(target.map((cur) => [cur, createRef()]))
				))
			);
			setERRORS(
				Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
					Object.fromEntries(target.map((cur) => [cur, false]))
				))
			);

			const section = OBJECT.food_section;
			if (COUNT.newSectionCnt <= 0) {
				alert(``, `errorCount`, 0);
				return false;
			}
			section.forEach((_item, i) => {
				if (!section[i].food_record_part || section[i].food_record_part === ``) {
					alert(`food_record_part`, `errorFoodPart`, i);
				}
				if (!section[i].food_record_name || section[i].food_record_name === ``) {
					alert(`food_record_name`, `errorFoodName`, i);
				}
				if (!section[i].food_record_count || section[i].food_record_count === `0`) {
					alert(`food_record_count`, `errorFoodCount`, i);
				}
				if (!section[i].food_record_kcal) {
					alert(`food_record_kcal`, `errorFoodKcal`, i);
				}
				if (!section[i].food_record_carb) {
					alert(`food_record_carb`, `errorFoodCarb`, i);
				}
				if (!section[i].food_record_protein) {
					alert(`food_record_protein`, `errorFoodProtein`, i);
				}
				if (!section[i].food_record_fat) {
					alert(`food_record_fat`, `errorFoodFat`, i);
				}
			});
			return true;
		}

		// 7-3. delete
		if (extra === `delete`) {
			const target: string[] = [
				`_id`
			];
			REFS.current = (
				Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
					Object.fromEntries(target.map((cur) => [cur, createRef()]))
				))
			);
			setERRORS(
				Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
					Object.fromEntries(target.map((cur) => [cur, false]))
				))
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

	// 10. return ------------------------------------------------------------------------------------
	return {
		ERRORS: ERRORS,
		REFS: REFS.current,
		validate: validate.current,
	};
};
