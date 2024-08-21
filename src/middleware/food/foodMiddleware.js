// foodMiddleware.js

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object) => {

  if (!object) {
    return [];
  }

  const makeNonValueColor = (param) => {
    if (param === "0" || param === "00:00") {
      return "grey";
    }
    else {
      return "";
    }
  };

  object?.result?.map((item) => {
    Object.assign((item), {
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

// 3. save -----------------------------------------------------------------------------------------
export const save = async (object) => {
  if (object === "deleted") {
    return {};
  }
  let totalKcal = 0;
  let totalCarb = 0;
  let totalProtein = 0;
  let totalFat = 0;

  object?.food_section?.map((item) => {
    totalKcal += parseFloat(item?.food_kcal);
    totalCarb += parseFloat(item?.food_carb);
    totalProtein += parseFloat(item?.food_protein);
    totalFat += parseFloat(item?.food_fat);
  });

  object.food_total_kcal = String(totalKcal);
  object.food_total_carb = String(totalCarb);
  object.food_total_protein = String(totalProtein);
  object.food_total_fat = String(totalFat);

  return object;
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = async (object) => {
  if (object === "deleted") {
    return {};
  }
  let totalKcal = 0;
  let totalCarb = 0;
  let totalProtein = 0;
  let totalFat = 0;

  object?.food_section?.map((item) => {
    totalKcal += parseFloat(item?.food_kcal);
    totalCarb += parseFloat(item?.food_carb);
    totalProtein += parseFloat(item?.food_protein);
    totalFat += parseFloat(item?.food_fat);
  });

  object.food_total_kcal = String(totalKcal);
  object.food_total_carb = String(totalCarb);
  object.food_total_protein = String(totalProtein);
  object.food_total_fat = String(totalFat);

  return object;
};