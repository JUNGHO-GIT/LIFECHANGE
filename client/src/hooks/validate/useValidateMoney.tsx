// useValidateMoney.tsx

import { useState, createRef, useRef } from "@importReacts";
import { useStoreLanguage, useStoreAlert, useStoreConfirm } from "@importStores";

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
  const showAlertAndFocus = (field: string, msg: string, idx: number) => {
    setALERT({
      open: true,
      msg: translate(msg),
      severity: "error",
    });
    if (field) {
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
    }
    return false;
  };

  // 7. validate -----------------------------------------------------------------------------------
  validate.current = async (OBJECT: any, COUNT: any, extra: string) => {

    // 1. goal -----------------------------------------------------------------------------------
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
        return showAlertAndFocus("", "errorCount", 0);
      }

      if (!OBJECT.money_goal_income || OBJECT.money_goal_income === "0") {
        return showAlertAndFocus("money_goal_income", "errorMoneyGoalIncome", 0);
      }
      else if (!OBJECT.money_goal_expense || OBJECT.money_goal_expense === "0") {
        return showAlertAndFocus("money_goal_expense", "errorMoneyGoalExpense", 0);
      }
      return true;
    }

    // 2. real -----------------------------------------------------------------------------------
    else if (extra === "real") {
      const target = [
        "money_part",
        "money_title",
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
        return showAlertAndFocus("", "errorCount", 0);
      }

      for (let i = 0; i < section?.length; i++) {
        if (!section[i]?.money_part || section[i].money_part === "") {
          return showAlertAndFocus("money_part", "errorMoneyPart", i);
        }
        else if (!section[i]?.money_title || section[i].money_title === "") {
          return showAlertAndFocus("money_title", "errorMoneyTitle", i);
        }
        else if (!section[i]?.money_amount) {
          return showAlertAndFocus("money_amount", "errorMoneyAmount", i);
        }
      }
      return true;
    }

    // 3. delete ---------------------------------------------------------------------------------
    else if (extra === "delete") {
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
    ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};
