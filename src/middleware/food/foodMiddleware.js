// foodMiddleware.js

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