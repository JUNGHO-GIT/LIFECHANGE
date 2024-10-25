// foodMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 3. calcNonValueColor --------------------------------------------------------------------------
  const calcNonValueColor = (param: string) => {

    let finalResult: string = "";

    if (!param) {
      return
    }

    if (param.length > 12) {
      finalResult = "fs-0-8rem fw-600";
    }
    else if (6 < param.length && param.length <= 12) {
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
    item.food_name_color = calcNonValueColor(
      item?.food_name
    );
    item.food_brand_color = calcNonValueColor(
      item?.food_brand
    );
    item.food_count_color = calcNonValueColor(
      item?.food_count
    );
    item.food_serv_color = calcNonValueColor(
      item?.food_serv
    );
    item.food_gram_color = calcNonValueColor(
      item?.food_gram
    );
    item.food_kcal_color = calcNonValueColor(
      item?.food_kcal
    );
    item.food_fat_color = calcNonValueColor(
      item?.food_fat
    );
    item.food_carb_color = calcNonValueColor(
      item?.food_carb
    );
    item.food_protein_color = calcNonValueColor(
      item?.food_protein
    );
  });

  return object;
};