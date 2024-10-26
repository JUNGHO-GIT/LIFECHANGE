// foodMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 0. calcOverTenMillion -------------------------------------------------------------------------
  const calcOverTenMillion = (param: string) => {

    let finalResult: string = "fs-0-9rem fw-600";

    if (!param || param === "0" || param === "00:00") {
      finalResult = param;
    }

    // 12300000 -> 1.23M / 10000000 -> 10M
    if (Number(param) >= 10_000_000) {
      finalResult = `${(parseFloat((Number(param) / 1_000_000).toFixed(2)).toString())}M`;
    }
    else {
      finalResult = param;
    }

    return finalResult;
  };

  // 0. calcNonValueColor --------------------------------------------------------------------------
  const calcNonValueColor = (param: string) => {

    let finalResult: string = "fs-0-9rem fw-600";

    if (!param) {
      finalResult = param;
    }

    if (param === "0" || param === "00:00") {
      finalResult += " grey";
    }
    else {
      finalResult += " light-black";
    }

    return finalResult;
  };

  // 10. return ------------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    item.food_total_kcal = calcOverTenMillion(
      item?.food_total_kcal
    );
    item.food_total_carb = calcOverTenMillion(
      item?.food_total_carb
    );
    item.food_total_protein = calcOverTenMillion(
      item?.food_total_protein
    );
    item.food_total_fat = calcOverTenMillion(
      item?.food_total_fat
    );

    item.food_total_kcal_color = calcNonValueColor(
      item?.food_total_kcal
    );
    item.food_total_carb_color = calcNonValueColor(
      item?.food_total_carb
    );
    item.food_total_protein_color = calcNonValueColor(
      item?.food_total_protein
    );
    item.food_total_fat_color = calcNonValueColor(
      item?.food_total_fat
    );
  });

  return object;
};