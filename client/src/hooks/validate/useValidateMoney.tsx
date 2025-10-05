// useValidateMoney.tsx

import { createRef, useCallback, useRef, useState } from "@importReacts";
import { useStoreAlert, useStoreConfirm, useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
export const useValidateMoney = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setCONFIRM } = useStoreConfirm();

	// 2-2. useState -------------------------------------------------------------------------------
  const REFS = useRef<any[]>([]);
  const [ERRORS, setERRORS] = useState<any[]>([]);
  const validate = useRef<Function>(() => {});

	// alert 표시 및 focus ---------------------------------------------------------------------------
	const fnAlert = useCallback((field: string, msg: string, idx: number) => {
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
			setERRORS (
				Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
					target.reduce((acc, cur) => ({
						...acc,
						[cur]: false
					}), {})
				))
			);
			if (COUNT.newSectionCnt <= 0) {
				return fnAlert("", "errorCount", 0);
			}
			else if (!OBJECT.money_goal_income || OBJECT.money_goal_income === "0") {
				return fnAlert("money_goal_income", "errorMoneyGoalIncome", 0);
			}
			else if (!OBJECT.money_goal_expense || OBJECT.money_goal_expense === "0") {
				return fnAlert("money_goal_expense", "errorMoneyGoalExpense", 0);
			}
			return true;
		}

		// 7-2. record -----------------------------------------------------------------------------------
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
			setERRORS (
				Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
					target.reduce((acc, cur) => ({
						...acc,
						[cur]: false
					}), {})
				))
			);

      const section = OBJECT.money_section;
      if (COUNT.newSectionCnt <= 0) {
        return fnAlert("", "errorCount", 0);
      }

      for (let i = 0; i < section?.length; i++) {
        if (!section[i]?.money_record_part || section[i].money_record_part === "all") {
          return fnAlert("money_record_part", "errorMoneyPart", i);
        }
        else if (!section[i]?.money_record_title || section[i].money_record_title === "all") {
          return fnAlert("money_record_title", "errorMoneyTitle", i);
        }
        else if (!section[i]?.money_record_amount) {
          return fnAlert("money_record_amount", "errorMoneyAmount", i);
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
					return fnAlert("", "noData", 0);
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
