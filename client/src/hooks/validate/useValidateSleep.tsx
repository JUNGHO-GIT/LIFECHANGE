// useValidateSleep.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateSleep= () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    PATH,
  } = useCommonValue();
  const {
    translate,
  } = useTranslate();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState<any>({});
  const REFS: any = useRef<any>({});
  const validate = useRef<any>(() => {});
  let returnValid = false;

  // 에러 메시지 출력 및 포커스
  const showAlertAndFocus = (field: string, msg: string, idx: number) => {
    alert(translate(msg));
    REFS.current?.[idx]?.[field]?.current?.focus();
    setERRORS({
      [idx]: {
        [field]: true,
      },
    });
    return returnValid;
  };

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    // 1. goal/save, update
    if (PATH.includes("sleep/goal/save") || PATH.includes("sleep/goal/update")) {
      const target = [
        "sleep_goal_bedTime",
        "sleep_goal_wakeTime",
        "sleep_goal_sleepTime",
      ];
      setERRORS(
        target.reduce((acc: any[], cur: string) => {
          acc.push({
            [cur]: false
          });
          return acc;
        }, [])
      );
      REFS.current = (
        target.reduce((acc: any[], cur: string) => {
          acc.push({
            [cur]: createRef()
          });
          return acc;
        }, [])
      );
      validate.current = (OBJECT: any, COUNT: any) => {
        if (COUNT.newSectionCnt === 0) {
          alert(translate("errorCount"));
          return returnValid;
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
        return !returnValid;
      };
    }

    // 2. save, update
    else if (PATH.includes("sleep/save") || PATH.includes("sleep/update")) {
      const target = [
        "sleep_bedTime",
        "sleep_wakeTime",
        "sleep_sleepTime",
      ];
      setERRORS(
        target.reduce((acc: any[], cur: string) => {
          acc.push({
            [cur]: false
          });
          return acc;
        }, [])
      );
      REFS.current = (
        target.reduce((acc: any[], cur: string) => {
          acc.push({
            [cur]: createRef()
          });
          return acc;
        }, [])
      );
      validate.current = (OBJECT: any, COUNT: any) => {
        if (COUNT.newSectionCnt === 0) {
          alert(translate("errorCount"));
          return returnValid;
        }
        const section = OBJECT.sleep_section;
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
        return !returnValid;
      };
    }
  }, [PATH]);

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS,
    REFS,
    validate: validate.current,
  };
};
