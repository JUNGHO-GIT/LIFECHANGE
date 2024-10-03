// sleepMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 3. calcNonValueColor --------------------------------------------------------------------------
  const calcNonValueColor = (param: string) => {

    let finalResult: string = "";

    if (param.length > 12) {
      finalResult = "fs-0-8rem fw-600";
    }
    else if (param.length > 6) {
      finalResult = "fs-0-9rem fw-600";
    }
    else {
      finalResult = "fs-1-0rem fw-600";
    }

    if (param === "0" || param === "00:00") {
      finalResult += " grey";
    }
    else {
      finalResult += " black";
    }

    return finalResult;
  };

  // 10. return ------------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    item.sleep_section?.forEach((section: any) => {
      section.sleep_bedTime_color = calcNonValueColor(
        section?.sleep_bedTime
      );
      section.sleep_wakeTime_color = calcNonValueColor(
        section?.sleep_wakeTime
      );
      section.sleep_sleepTime_color = calcNonValueColor(
        section?.sleep_sleepTime
      );
    });
  });

  return object;
};