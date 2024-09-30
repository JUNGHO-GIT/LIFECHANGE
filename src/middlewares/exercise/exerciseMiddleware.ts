// exerciseMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 3. calcNonValueColor --------------------------------------------------------------------------
  const calcNonValueColor = (param: string) => {

    let finalResult: string = "";

    if (param.length > 12) {
      finalResult = "fs-0-6rem fw-600";
    }
    else if (param.length > 6) {
      finalResult = "fs-0-8rem fw-600";
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
    item.exercise_total_volume_color = calcNonValueColor(
      item?.exercise_total_volume
    );
    item.exercise_total_cardio_color = calcNonValueColor(
      item?.exercise_total_cardio
    );
    item.exercise_total_weight_color = calcNonValueColor(
      item?.exercise_total_weight
    );
  });

  return object;
};