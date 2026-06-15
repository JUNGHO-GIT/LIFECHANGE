/**
 * @file useValidateMoney.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { React, createRef, useCallback, useRef, useState } from "@exportReacts";
import { useStoreAlert, useStoreConfirm, useStoreLanguage } from "@exportStores";

// 구조 타입 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
type FieldRefs = Record<string, React.RefObject<unknown>>;
type FieldErrors = Record<string, boolean>;
type MoneySection = Record<string, string>;
type MoneyObject = {
  _id?: string;
  money_goal_income?: string;
  money_goal_expense?: string;
  money_section?: MoneySection[];
};
type MoneyCount = {
  newSectionCnt: number;
};
type MoneyValidate = (
  OBJECT: MoneyObject, COUNT: MoneyCount, extra: string
) => Promise<boolean>;

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const useValidateMoney = () => {

  // 1. common ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setCONFIRM } = useStoreConfirm();

  // 2-2. useState ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const REFS: React.RefObject<FieldRefs[]> = useRef<FieldRefs[]>([]);
  const validate: React.RefObject<MoneyValidate> = useRef<MoneyValidate>(async () => false);
  const [ ERRORS, setERRORS ] = useState<FieldErrors[]>([]);

  // alert 표시 및 focus ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const alert = useCallback((field: string, msg: string, idx: number) => {
    setALERT({
      open: true,
      msg: translate(msg),
      severity: `error`,
    });
    field && setTimeout(() => {
      (REFS?.current?.[idx]?.[field]?.current as { focus?: () => void } | undefined)?.focus?.();
    }, 0);
    field && setERRORS((prev) => {
      const updatedErrors: FieldErrors[] = [...prev];
      updatedErrors[idx] = {
        ...updatedErrors[idx],
        [field]: true,
      };
      return updatedErrors;
    });
  }, [ setALERT, translate ]);

  // 7. validate ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
  validate.current = async (OBJECT, COUNT, extra) => {
    // 7-1. goal
    if (extra === `goal`) {
      const target: string[] = [
        `money_goal_income`,
        `money_goal_expense`,
      ];
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
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
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );

      const section = OBJECT.money_section ?? [];
      if (COUNT.newSectionCnt <= 0) {
        alert(``, `errorCount`, 0);
        return false;
      }
      for (let i = 0; i < section.length; i++) {
        if (!section[i]?.money_record_part || section[i].money_record_part === `all`) {
          alert(`money_record_part`, `errorMoneyPart`, i);
          return false;
        }
        if (!section[i]?.money_record_title || section[i].money_record_title === `all`) {
          alert(`money_record_title`, `errorMoneyTitle`, i);
          return false;
        }
        if (!section[i]?.money_record_amount) {
          alert(`money_record_amount`, `errorMoneyAmount`, i);
          return false;
        }
        if (section[i]?.money_record_scheduled === `Y` && !section[i]?.money_record_scheduled_date) {
          alert(`money_record_scheduled_date`, `errorMoneyScheduledDate`, i);
          return false;
        }
      }
      return true;
    }

    // 7-3. delete
    if (extra === `delete`) {
      const target: string[] = [`_id`];
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );
      const confirmResult: boolean = await new Promise<boolean>((resolve) => {
        setCONFIRM({
          open: true,
          msg: translate(`confirmDelete`),
        }, (confirmed: boolean) => {
          resolve(confirmed);
        });
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
