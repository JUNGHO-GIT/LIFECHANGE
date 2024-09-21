// useValidateCalendar.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateCalendar = () => {

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

      // 2. real
      if (PATH.includes("calendar/detail")) {
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
          alert(translate("errorCount"));
          return false;
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
    }
  }, [PATH]);

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};