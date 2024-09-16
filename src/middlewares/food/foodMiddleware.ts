// foodMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  const makeNonValueColor = (param: string) => {
    if (param === "0" || param === "00:00") {
      return "grey";
    }
    else {
      return "";
    }
  };

  object?.result?.forEach((item: any) => {
    Object.assign(item, {
      food_total_kcal_color: makeNonValueColor(
        item?.food_total_kcal
      ),
      food_total_carb_color: makeNonValueColor(
        item?.food_total_carb
      ),
      food_total_protein_color: makeNonValueColor(
        item?.food_total_protein
      ),
      food_total_fat_color: makeNonValueColor(
        item?.food_total_fat
      ),
    });
  });

  return object;
};