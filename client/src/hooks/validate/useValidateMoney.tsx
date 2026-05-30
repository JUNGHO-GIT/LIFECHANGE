/**
 * @file useValidateMoney.tsx
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
	useStoreAlert as usStrAlrt,
	useStoreConfirm as usStrCnfr,
	useStoreLanguage as usStrLang,
} from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const usValMny = () => {
	// 1. common ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { translate } = usStrLang();
	const { setALERT } = usStrAlrt();
	const { setCONFIRM } = usStrCnfr();

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
					const updtErrs: unknown[] = [...prev];
					updtErrs[idx] = {
						...updtErrs[idx],
						[field]: true,
					};
					return updtErrs;
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
			const target: string[] = [`money_goal_income`, `money_goal_expense`];
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
			if (!OBJECT.money_goal_income || OBJECT.money_goal_income === `0`) {
				alert(`money_goal_income`, `errorMoneyGoalIncome`, 0);
				return false;
			}
			if (!OBJECT.money_goal_expense || OBJECT.money_goal_expense === `0`) {
				alert(`money_goal_expense`, `errorMoneyGoalExpense`, 0);
				return false;
			}
			return true;
		}

		// 7-2. record
		if (extra === `record`) {
			const target: string[] = [
				`money_record_part`,
				`money_record_title`,
				`money_record_amount`,
			];
			REFS.current = Array.from({ length: COUNT.newSectionCnt }, (_, _idx) =>
				Object.fromEntries(target.map((cur) => [cur, createRef()])),
			);
			setERRORS(
				Array.from({ length: COUNT.newSectionCnt }, (_, _idx) =>
					Object.fromEntries(target.map((cur) => [cur, false])),
				),
			);

			const section = OBJECT.money_section;
			if (COUNT.newSectionCnt <= 0) {
				alert(``, `errorCount`, 0);
				return false;
			}
			section.forEach((_item, i) => {
				if (
					!section[i]?.money_record_part ||
					section[i].money_record_part === `all`
				) {
					alert(`money_record_part`, `errorMoneyPart`, i);
				}
				if (
					!section[i]?.money_record_title ||
					section[i].money_record_title === `all`
				) {
					alert(`money_record_title`, `errorMoneyTitle`, i);
				}
				if (!section[i]?.money_record_amount) {
					alert(`money_record_amount`, `errorMoneyAmount`, i);
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
			const cnfrRes: boolean = await new Promise<boolean>((resolve) => {
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
			if (cnfrRes) {
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
