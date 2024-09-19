// useValidateMoney.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateMoney= () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    PATH,
  } = useCommonValue();
  const {
    translate
  } = useTranslate();

  // 2-2. useState ---------------------------------------------------------------------------------
  const REFS: any = useRef<any>({});
  const [ERRORS, setERRORS] = useState<any>({});
  const validate = useRef<any>(() => {});

  // alert 표시 및 focus ---------------------------------------------------------------------------
  const showAlertAndFocus = (field: string, msg: string, idx: number) => {
    alert(translate(msg));
    REFS.current?.[idx]?.[field]?.current?.focus();
    setERRORS({
      [idx]: {
        [field]: true,
      },
    });
    return false;
  };

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    // 1. goal
    if (PATH.includes("money/goal/detail")) {
      const target = [
        "money_goal_income",
        "money_goal_expense",
      ];
      setERRORS(target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: false
        });
        return acc;
      }, []));
      REFS.current = (target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: createRef()
        });
        return acc;
      }, []));
      validate.current = (OBJECT: any, COUNT: any) => {
        if (COUNT.newSectionCnt <= 0) {
          alert(translate("errorCount"));
          return false;
        }
        else if (!OBJECT.money_goal_income || OBJECT.money_goal_income === "0") {
          return showAlertAndFocus('money_goal_income', "errorMoneyGoalIncome", 0);
        }
        else if (!OBJECT.money_goal_expense || OBJECT.money_goal_expense === "0") {
          return showAlertAndFocus('money_goal_expense', "errorMoneyGoalExpense", 0);
        }
        else {
          return true;
        }
      }
    }

    // 2. real
    else if (PATH.includes("money/detail")) {
      const target = [
        "money_part_idx",
        "money_title_idx",
        "money_amount",
      ];
      setERRORS(target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: false
        });
        return acc;
      }, []));
      REFS.current = (target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: createRef()
        });
        return acc;
      }, []));
      validate.current = (OBJECT: any, COUNT: any) => {
        const section = OBJECT.money_section;
        for (let i = 0; i < section.length; i++) {
          if (COUNT.newSectionCnt <= 0) {
            alert(translate("errorCount"));
            return false;
          }
          else if (!section[i].money_part_idx || section[i].money_part_idx === 0) {
            return showAlertAndFocus('money_part_idx', "errorMoneyPartIdx", i);
          }
          else if (!section[i].money_title_idx || section[i].money_title_idx === 0) {
            return showAlertAndFocus('money_title_idx', "errorMoneyTitleIdx", i);
          }
          else if (!section[i].money_amount || section[i].money_amount === "0") {
            return showAlertAndFocus('money_amount', "errorMoneyAmount", i);
          }
          else {
            return true;
          }
        }
      };
    }
  }, [PATH]);

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};