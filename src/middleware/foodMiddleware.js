// foodMiddleware.js

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (object) => {

  if (!object) {
    return [];
  }

  const compareCount = (plan, real) => {
    const diff = Math.abs(real - plan);
    return diff;
  };

  const makeColor = (plan, real, extra) => {
    const percent = ((real - plan) / plan) * 100;
    // 1. ~ 1%
    if (percent <= 1) {
      return "text-primary";
    }
    // 2. 1% ~ 10%
    else if (percent > 1 && percent <= 10) {
      return "text-success";
    }
    // 3. 10% ~ 50%
    else if (percent > 10 && percent <= 30) {
      return "text-warning";
    }
    // 4. 50% ~
    else {
      return "text-danger";
    }
  };

  object?.result?.map((item) => {
    Object.assign((item), {
      food_diff_kcal: compareCount(item?.food_plan_kcal, item?.food_total_kcal),
      food_diff_carb: compareCount(item?.food_plan_carb, item?.food_total_carb),
      food_diff_protein: compareCount(item?.food_plan_protein, item?.food_total_protein),
      food_diff_fat: compareCount(item?.food_plan_fat, item?.food_total_fat),

      food_diff_kcal_color: makeColor(item?.food_plan_kcal, item?.food_total_kcal, ""),
      food_diff_carb_color: makeColor(item?.food_plan_carb, item?.food_total_carb, ""),
      food_diff_protein_color: makeColor(item?.food_plan_protein, item?.food_total_protein, ""),
      food_diff_fat_color: makeColor(item?.food_plan_fat, item?.food_total_fat, ""),
    });
  });

  return object;
};

// 3. save ---------------------------------------------------------------------------------------->
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