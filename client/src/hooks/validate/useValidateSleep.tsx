// useValidateSleep.tsx

import { createRef, useCallback, useRef, useState } from "@importReacts";
import { useStoreAlert, useStoreConfirm, useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
export const useValidateSleep = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setCONFIRM } = useStoreConfirm();

	// 2-2. useState -------------------------------------------------------------------------------
  const REFS = useRef<any[]>([]);
  const [ERRORS, setERRORS] = useState<any[]>([]);
  const validate = useRef<Function>(() => {});

	// alert 표시 및 focus ---------------------------------------------------------------------------
	const showAlertAndFocus = useCallback((field: string, msg: string, idx: number) => {
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
			}			else if (!OBJECT.sleep_goal_bedTime || OBJECT.sleep_goal_bedTime === "00:00") {
				return showAlertAndFocus("sleep_goal_bedTime", "errorSleepGoalBedTime", 0);
			}
			else if (!OBJECT.sleep_goal_wakeTime || OBJECT.sleep_goal_wakeTime === "00:00") {
				return showAlertAndFocus("sleep_goal_wakeTime", "errorSleepGoalWakeTime", 0);
			}
			else if (!OBJECT.sleep_goal_sleepTime) {
				return showAlertAndFocus("sleep_goal_sleepTime", "errorSleepGoalSleepTime", 0);
			}
			return true;
		}

		// 7-2. record -----------------------------------------------------------------------------------
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
			setERRORS (
				Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
					target.reduce((acc, cur) => ({
						...acc,
						[cur]: false
					}), {})
				))
			);
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

      const section = OBJECT.sleep_section;
      if (COUNT.newSectionCnt <= 0) {
        return showAlertAndFocus("", "errorCount", 0);
      }
      for (let i = 0; i < section?.length; i++) {
        if (!section[i].sleep_record_bedTime || section[i].sleep_record_bedTime === "00:00") {
          return showAlertAndFocus('sleep_record_bedTime', "errorSleepBedTime", i);
        }
        else if (!section[i].sleep_record_wakeTime || section[i].sleep_record_wakeTime === "00:00") {
          return showAlertAndFocus('sleep_record_wakeTime', "errorSleepWakeTime", i);
        }
        else if (!section[i].sleep_record_sleepTime) {
          return showAlertAndFocus('sleep_record_sleepTime', "errorSleepSleepTime", i);
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
					return showAlertAndFocus("", "noData", 0);
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