// useValidateMoney.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateMoney= () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    PATH, translate
  } = useCommon();

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
    // 1. goal/save
    if (PATH.includes("money/goal/save")) {
      const target = [
        "money_goal_income",
        "money_goal_expense",
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
        if (!OBJECT.money_goal_income || OBJECT.money_goal_income === "0") {
          return showAlertAndFocus('money_goal_income', "errorMoneyGoalIncome", 0);
        }
        else if (!OBJECT.money_goal_expense || OBJECT.money_goal_expense === "0") {
          return showAlertAndFocus('money_goal_expense', "errorMoneyGoalExpense", 0);
        }
        return !returnValid;
      }
    }

    // 2. save
    else if (PATH.includes("money/save")) {
      const target = [
        "money_part_idx",
        "money_title_idx",
        "money_amount",
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
        const section = OBJECT.money_section;
        for (let i = 0; i < section.length; i++) {
          if (!section[i].money_part_idx || section[i].money_part_idx === 0) {
            return showAlertAndFocus('money_part_idx', "errorMoneyPart", i);
          }
          else if (!section[i].money_title_idx || section[i].money_title_idx === 0) {
            return showAlertAndFocus('money_title_idx', "errorMoneyTitle", i);
          }
          else if (!section[i].money_amount || section[i].money_amount === "0") {
            return showAlertAndFocus('money_amount', "errorMoneyAmount", i);
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
