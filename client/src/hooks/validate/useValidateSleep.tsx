// useValidateSleep.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateSleep = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH } = useCommonValue();
  const { translate } = useTranslate();

  // 2-2. useState ---------------------------------------------------------------------------------
  const REFS = useRef<any[]>([]);
  const [ERRORS, setERRORS] = useState<any[]>([]);
  const validate = useRef<Function>(() => {});

  // alert 표시 및 focus ---------------------------------------------------------------------------
  const showAlertAndFocus = (field: string, msg: string, idx: number) => {
    alert(translate(msg));
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
    return false;
  };

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    validate.current = (OBJECT: any, COUNT: any) => {
      // 1. goal
      if (PATH.includes("sleep/goal/detail")) {
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
          alert(translate("errorCount"));
          return false;
        }

        if (!OBJECT.sleep_goal_bedTime || OBJECT.sleep_goal_bedTime === "00:00") {
          return showAlertAndFocus('sleep_goal_bedTime', "errorSleepGoalBedTime", 0);
        }
        else if (!OBJECT.sleep_goal_wakeTime || OBJECT.sleep_goal_wakeTime === "00:00") {
          return showAlertAndFocus('sleep_goal_wakeTime', "errorSleepGoalWakeTime", 0);
        }
        else if (!OBJECT.sleep_goal_sleepTime) {
          return showAlertAndFocus('sleep_goal_sleepTime', "errorSleepGoalSleepTime", 0);
        }
        return true;
      }

      // 2. real
      if (PATH.includes("sleep/detail")) {
        const target = [
          "sleep_bedTime",
          "sleep_wakeTime",
          "sleep_sleepTime",
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

        const section = OBJECT.sleep_section;
        if (COUNT.newSectionCnt <= 0) {
          alert(translate("errorCount"));
          return false;
        }
        for (let i = 0; i < section.length; i++) {
          if (!section[i].sleep_bedTime || section[i].sleep_bedTime === "00:00") {
            return showAlertAndFocus('sleep_bedTime', "errorSleepBedTime", i);
          }
          else if (!section[i].sleep_wakeTime || section[i].sleep_wakeTime === "00:00") {
            return showAlertAndFocus('sleep_wakeTime', "errorSleepWakeTime", i);
          }
          else if (!section[i].sleep_sleepTime) {
            return showAlertAndFocus('sleep_sleepTime', "errorSleepSleepTime", i);
          }
        }
        return true;
      }
    }
  }, [PATH]);

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};