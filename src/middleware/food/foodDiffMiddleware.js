// foodDiffMiddleware.js

// 1. diff ---------------------------------------------------------------------------------------->
export const diff = async (object) => {

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
      return "primary";
    }
    // 2. 1% ~ 10%
    else if (percent > 1 && percent <= 10) {
      return "success";
    }
    // 3. 10% ~ 50%
    else if (percent > 10 && percent <= 30) {
      return "warning";
    }
    // 4. 50% ~
    else {
      return "danger";
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