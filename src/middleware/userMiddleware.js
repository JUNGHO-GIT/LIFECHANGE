// userMiddleware.js

// 1. percent ------------------------------------------------------------------------------------->
export const percent = async (object) => {

  if (!object) {
    return [];
  }

  console.log("/n/n first : " + JSON.stringify(object, null, 3));

  object?.food?.plan?.map((item) => {
    Object.assign((item), {
      food_percent_kcal: Math.round((item?.food_total_kcal / item?.food_plan_kcal) * 100),
      food_percent_carb: Math.round((item?.food_total_carb / item?.food_plan_carb) * 100),
      food_percent_protein: Math.round((item?.food_total_protein / item?.food_plan_protein) * 100),
      food_percent_fat: Math.round((item?.food_total_fat / item?.food_plan_fat) * 100),
    });
  });

  console.log("/n/n second : " + JSON.stringify(object, null, 3));

  return object;
};