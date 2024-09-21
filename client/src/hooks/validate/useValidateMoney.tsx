// useValidateMoney.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateMoney = () => {

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
      if (PATH.includes("money/goal/detail")) {
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
          alert(translate("errorCount"));
          return false;
        }

        if (!OBJECT.money_goal_income || OBJECT.money_goal_income === "0") {
          return showAlertAndFocus("money_goal_income", "errorMoneyGoalIncome", 0);
        }
        else if (!OBJECT.money_goal_expense || OBJECT.money_goal_expense === "0") {
          return showAlertAndFocus("money_goal_expense", "errorMoneyGoalExpense", 0);
        }
        return true;
      }

      // 2. real
      else if (PATH.includes("money/detail")) {
        const target = [
          "money_part_idx",
          "money_title_idx",
          "money_amount"
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
          alert(translate("errorCount"));
          return false;
        }
        for (let i = 0; i < section.length; i++) {
          if (!section[i]?.money_part_idx || section[i].money_part_idx === 0) {
            return showAlertAndFocus("money_part_idx", "errorMoneyPartIdx", i);
          }
          else if (!section[i]?.money_title_idx || section[i].money_title_idx === 0) {
            return showAlertAndFocus("money_title_idx", "errorMoneyTitleIdx", i);
          }
          else if (!section[i]?.money_amount || section[i].money_amount === "0") {
            return showAlertAndFocus("money_amount", "errorMoneyAmount", i);
          }
        }
        return true;
      }
    }
  }, [PATH]);

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};
