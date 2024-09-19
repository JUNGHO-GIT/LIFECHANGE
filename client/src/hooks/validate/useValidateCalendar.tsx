// useValidateCalendar.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateCalendar= () => {

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
    // 1. save
    if (PATH.includes("calendar/detail")) {
      const target = [
        "calendar_part_idx",
        "calendar_color",
        "calendar_title",
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
        const section = OBJECT.calendar_section;
        for (let i = 0; i < section.length; i++) {
          if (COUNT.newSectionCnt <= 0) {
            alert(translate("errorCount"));
            return false;
          }
          else if (!section[i].calendar_part_idx || section[i].calendar_part_idx === 0) {
            return showAlertAndFocus('calendar_part_idx', "errorCalendarPartIdx", i);
          }
          else if (!section[i].calendar_title) {
            return showAlertAndFocus('calendar_title', "errorCalendarTitle", i);
          }
          else if (!section[i].calendar_color) {
            return showAlertAndFocus('calendar_color', "errorCalendarColor", i);
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