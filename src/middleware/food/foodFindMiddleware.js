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
    totalKcal += item?.food_kcal;
    totalCarb += item?.food_carb;
    totalProtein += item?.food_protein;
    totalFat += item?.food_fat;
  });

  object.food_total_kcal = totalKcal;
  object.food_total_carb = totalCarb;
  object.food_total_protein = totalProtein;
  object.food_total_fat = totalFat;

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
    totalKcal += item?.food_kcal;
    totalCarb += item?.food_carb;
    totalProtein += item?.food_protein;
    totalFat += item?.food_fat;
  });

  object.food_total_kcal = totalKcal;
  object.food_total_carb = totalCarb;
  object.food_total_protein = totalProtein;
  object.food_total_fat = totalFat;

  return object;
};