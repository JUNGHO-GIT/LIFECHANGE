// useValidateCalendar.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateCalendar= () => {

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
    // 1. save
    if (PATH.includes("calendar/save")) {
      const target = [
        "calendar_part_idx",
        "calendar_color",
        "calendar_title",
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
        const section = OBJECT.calendar_section;
        for (let i = 0; i < section.length; i++) {
          if (!section[i].calendar_part_idx || section[i].calendar_part_idx === 0) {
            return showAlertAndFocus('calendar_part_idx', "errorCalendarPart", i);
          }
          else if (!section[i].calendar_title) {
            return showAlertAndFocus('calendar_title', "errorCalendarTitle", i);
          }
          else if (!section[i].calendar_color) {
            return showAlertAndFocus('calendar_color', "errorCalendarColor", i);
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
