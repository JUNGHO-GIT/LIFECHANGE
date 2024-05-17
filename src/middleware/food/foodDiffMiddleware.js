// foodDiffMiddleware.js

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
      return "danger";
    }
    // 2. 1% ~ 10%
    else if (percent > 1 && percent <= 10) {
      return "warning";
    }
    // 3. 10% ~ 30%
    else if (percent > 10 && percent <= 30) {
      return "secondary";
    }
    // 4. 30% ~ 50%
    else if (percent > 30 && percent <= 50) {
      return "success";
    }
    // 5. 50% ~
    else {
      return "primary";
    }
  };

  object?.result?.map((item) => {
    Object.assign((item), {
      food_diff_kcal: compareCount(
        item?.food_plan_kcal, item?.food_total_kcal
      ),
      food_diff_carb: compareCount(
        item?.food_plan_carb, item?.food_total_carb
      ),
      food_diff_protein: compareCount(
        item?.food_plan_protein, item?.food_total_protein
      ),
      food_diff_fat: compareCount(
        item?.food_plan_fat, item?.food_total_fat
      ),
      food_diff_kcal_color: makeColor(
        item?.food_plan_kcal, item?.food_total_kcal, "kcal"
      ),
      food_diff_carb_color: makeColor(
        item?.food_plan_carb, item?.food_total_carb, "carb"
      ),
      food_diff_protein_color: makeColor(
        item?.food_plan_protein, item?.food_total_protein, "protein"
      ),
      food_diff_fat_color: makeColor(
        item?.food_plan_fat, item?.food_total_fat, "fat"
      ),
    });
  });

  return object;
};