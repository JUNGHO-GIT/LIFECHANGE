// FoodFindMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

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
    item.food_record_name_color = calcNonValueColor(
      item?.food_record_name
    );
    item.food_record_brand_color = calcNonValueColor(
      item?.food_record_brand
    );
    item.food_record_count_color = calcNonValueColor(
      item?.food_record_count
    );
    item.food_record_serv_color = calcNonValueColor(
      item?.food_record_serv
    );
    item.food_record_gram_color = calcNonValueColor(
      item?.food_record_gram
    );
    item.food_record_kcal_color = calcNonValueColor(
      item?.food_record_kcal
    );
    item.food_record_fat_color = calcNonValueColor(
      item?.food_record_fat
    );
    item.food_record_carb_color = calcNonValueColor(
      item?.food_record_carb
    );
    item.food_record_protein_color = calcNonValueColor(
      item?.food_record_protein
    );
  });

  return object;
};