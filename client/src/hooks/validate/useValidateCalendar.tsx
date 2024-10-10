// useValidateCalendar.tsx

import { useState, createRef, useRef } from "@imports/ImportReacts";
import { useLanguageStore, useAlertStore, useConfirmStore } from "@imports/ImportStores";

// -------------------------------------------------------------------------------------------------
export const useValidateCalendar = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { CONFIRM, setCONFIRM } = useConfirmStore();

  // 2-2. useState ---------------------------------------------------------------------------------
  const REFS = useRef<any[]>([]);
  const [ERRORS, setERRORS] = useState<any[]>([]);
  const validate = useRef<Function>(() => {});

  // alert 표시 및 focus ---------------------------------------------------------------------------
  const showAlertAndFocus = (field: string, msg: string, idx: number) => {
    setALERT({
      open: !ALERT.open,
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
  validate.current = (OBJECT: any, COUNT: any, extra: string) => {

    // 2. real -----------------------------------------------------------------------------------
    if (extra === "real") {
      const target = [
        "calendar_part_idx",
        "calendar_color",
        "calendar_title",
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

      const section = OBJECT.calendar_section;

      if (COUNT.newSectionCnt <= 0) {
        return showAlertAndFocus("", "errorCount", 0);
      }

      for (let i = 0; i < section.length; i++) {
        if (!section[i].calendar_part_idx || section[i].calendar_part_idx === 0) {
          return showAlertAndFocus('calendar_part_idx', "errorCalendarPartIdx", i);
        }
        else if (!section[i].calendar_title) {
          return showAlertAndFocus('calendar_title', "errorCalendarTitle", i);
        }
        else if (!section[i].calendar_color) {
          return showAlertAndFocus('calendar_color', "errorCalendarColor", i);
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

      setCONFIRM({
        open: !CONFIRM.open,
        confirm: false,
        msg: translate("deleteConfirm"),
      }, (confirmed: boolean) => {
        if (!confirmed) {
          return;
        }
        else {
          if (!OBJECT?._id || OBJECT?._id === "") {
            return showAlertAndFocus("", "noData", 0);
          }
          return true;
        }
      });
    }
  };

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};