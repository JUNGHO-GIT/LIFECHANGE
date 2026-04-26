/**
 * @file useValidateSleep.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import {
	createRef,
	type React,
	useCallback,
	useRef,
	useState,
} from "@exportReacts";
import {
	useStoreAlert,
	useStoreConfirm,
	useStoreLanguage,
} from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const useValidateSleep = () => {
	// 1. common ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { translate } = useStoreLanguage();
	const { setALERT } = useStoreAlert();
	const { setCONFIRM } = useStoreConfirm();

	// 2-2. useState ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const REFS: React.RefObject<unknown[]> = useRef<unknown[]>([]);
	const validate: React.RefObject<Function> = useRef<Function>(() => {});
	const [ERRORS, setERRORS] = useState<unknown[]>([]);

	// alert 표시 및 focus ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const alert = useCallback(
		(field: string, msg: string, idx: number) => {
			setALERT({
				open: true,
				msg: translate(msg),
				severity: `error`,
			});
			field &&
				setTimeout(() => {
					REFS?.current?.[idx]?.[field]?.current?.focus();
				}, 0);
			field &&
				setERRORS((prev) => {
					const updatedErrors: unknown[] = [...prev];
					updatedErrors[idx] = {
						...updatedErrors[idx],
						[field]: true,
					};
					return updatedErrors;
				});
		},
		[setALERT, translate],
	);

	// 7. validate ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	validate.current = async (
		OBJECT: unknown,
		COUNT: unknown,
		extra: string,
	): Promise<boolean> => {
		// 7-1. goal
		if (extra === `goal`) {
			const target: string[] = [
				`sleep_goal_bedTime`,
				`sleep_goal_wakeTime`,
				`sleep_goal_sleepTime`,
			];
			REFS.current = Array.from({ length: COUNT.newSectionCnt }, (_, _idx) =>
				Object.fromEntries(target.map((cur) => [cur, createRef()])),
			);
			setERRORS(
				Array.from({ length: COUNT.newSectionCnt }, (_, _idx) =>
					Object.fromEntries(target.map((cur) => [cur, false])),
				),
			);
			if (COUNT.newSectionCnt <= 0) {
				alert(``, `errorCount`, 0);
				return false;
			}
			if (!OBJECT.sleep_goal_bedTime || OBJECT.sleep_goal_bedTime === `00:00`) {
				alert(`sleep_goal_bedTime`, `errorSleepGoalBedTime`, 0);
				return false;
			}
			if (
				!OBJECT.sleep_goal_wakeTime ||
				OBJECT.sleep_goal_wakeTime === `00:00`
			) {
				alert(`sleep_goal_wakeTime`, `errorSleepGoalWakeTime`, 0);
				return false;
			}
			if (!OBJECT.sleep_goal_sleepTime) {
				alert(`sleep_goal_sleepTime`, `errorSleepGoalSleepTime`, 0);
				return false;
			}
			return true;
		}

		// 7-2. record
		if (extra === `record`) {
			const target: string[] = [
				`sleep_record_bedTime`,
				`sleep_record_wakeTime`,
				`sleep_record_sleepTime`,
			];
			REFS.current = Array.from({ length: COUNT.newSectionCnt }, (_, _idx) =>
				Object.fromEntries(target.map((cur) => [cur, createRef()])),
			);
			setERRORS(
				Array.from({ length: COUNT.newSectionCnt }, (_, _idx) =>
					Object.fromEntries(target.map((cur) => [cur, false])),
				),
			);

			const section = OBJECT.sleep_section;
			if (COUNT.newSectionCnt <= 0) {
				alert(``, `errorCount`, 0);
				return false;
			}
			section.forEach((_item, i) => {
				if (
					!section[i].sleep_record_bedTime ||
					section[i].sleep_record_bedTime === `00:00`
				) {
					alert(`sleep_record_bedTime`, `errorSleepBedTime`, i);
				}
				if (
					!section[i].sleep_record_wakeTime ||
					section[i].sleep_record_wakeTime === `00:00`
				) {
					alert(`sleep_record_wakeTime`, `errorSleepWakeTime`, i);
				}
				if (!section[i].sleep_record_sleepTime) {
					alert(`sleep_record_sleepTime`, `errorSleepSleepTime`, i);
				}
			});
			return true;
		}

		// 7-3. delete
		if (extra === `delete`) {
			const target: string[] = [`_id`];
			REFS.current = Array.from({ length: COUNT.newSectionCnt }, (_, _idx) =>
				Object.fromEntries(target.map((cur) => [cur, createRef()])),
			);
			setERRORS(
				Array.from({ length: COUNT.newSectionCnt }, (_, _idx) =>
					Object.fromEntries(target.map((cur) => [cur, false])),
				),
			);
			const confirmResult: boolean = await new Promise<boolean>((resolve) => {
				setCONFIRM(
					{
						open: true,
						msg: translate(`confirmDelete`),
					},
					(confirmed: boolean) => {
						resolve(confirmed);
					},
				);
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
