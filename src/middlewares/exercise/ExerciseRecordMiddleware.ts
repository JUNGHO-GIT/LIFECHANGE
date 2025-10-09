// ExerciseRecordMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 0. calcOverTenMillion -------------------------------------------------------------------------
  const calcOverTenMillion = (param: string) => {

    let finalResult: string = "";

    if (!param || param === "0" || param === "00:00" || String(param).includes(":")) {
      finalResult = param;
    }
    // 12300000 -> 1.23M / 10000000 -> 10M
    else if (Number(param) >= 10_000_000) {
      finalResult = `${(parseFloat((Number(param) / 1_000_000).toFixed(2)).toString())}M`;
    }
    else {
      finalResult = parseFloat(Number(param).toFixed(2)).toString();
    }

    return finalResult;
  };

  // 0. calcNonValueColor --------------------------------------------------------------------------
  const calcNonValueColor = (param: string) => {

    let finalResult: string = "";

    if (!param) {
      finalResult = param;
    }
    else if (param === "0" || param === "00:00") {
      finalResult = "grey";
    }
    else {
      finalResult = "light-black";
    }

    return finalResult;
  };

	// 10. return ----------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    item.exercise_record_total_volume = calcOverTenMillion(
      item?.exercise_record_total_volume
    );
    item.exercise_record_total_cardio = calcOverTenMillion(
      item?.exercise_record_total_cardio
    );
    item.exercise_record_total_scale = calcOverTenMillion(
      item?.exercise_record_total_scale
    );

    item.exercise_record_total_volume_color = calcNonValueColor(
      item?.exercise_record_total_volume
    );
    item.exercise_record_total_cardio_color = calcNonValueColor(
      item?.exercise_record_total_cardio
    );
    item.exercise_record_total_scale_color = calcNonValueColor(
      item?.exercise_record_total_scale
    );
  });

  return object;
};