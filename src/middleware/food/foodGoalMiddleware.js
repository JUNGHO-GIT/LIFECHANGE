// foodDiffMiddleware.js

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = async (object) => {

  if (!object) {
    return [];
  }

  // 1. compareValue -------------------------------------------------------------------------------
  const compareValue = (goalParam, realParam) => {
    const goal = parseFloat(goalParam);
    const real = parseFloat(realParam);
    if (goal > real) {
      return `-${(parseFloat(Math.abs(goal - real).toFixed(2)).toString())}`;
    }
    else {
      return `+${(parseFloat(Math.abs(real - goal).toFixed(2)).toString())}`;
    }
  };

  // 3. makeColor ----------------------------------------------------------------------------------
  const makeColor = (goalParam, realParam, extra) => {
    const goal = parseFloat(goalParam);
    const real = parseFloat(realParam);
    const percent = ((real - goal) / goal) * 100;
    // 1. ~ 1%
    if (percent > 0 && percent <= 1) {
      return "firstScore";
    }
    // 2. 1% ~ 10%
    else if (percent > 1 && percent <= 10) {
      return "secondScore";
    }
    // 3. 10% ~ 30%
    else if (percent > 10 && percent <= 30) {
      return "thirdScore";
    }
    // 4. 30% ~ 50%
    else if (percent > 30 && percent <= 50) {
      return "fourthScore";
    }
    // 5. 50% ~
    else {
      return "fifthScore";
    }
  };

  // 4. result -------------------------------------------------------------------------------------
  object?.result?.map((item) => {
    Object.assign((item), {
      food_diff_kcal: compareValue(
        item?.food_goal_kcal, item?.food_total_kcal
      ),
      food_diff_carb: compareValue(
        item?.food_goal_carb, item?.food_total_carb
      ),
      food_diff_protein: compareValue(
        item?.food_goal_protein, item?.food_total_protein
      ),
      food_diff_fat: compareValue(
        item?.food_goal_fat, item?.food_total_fat
      ),
      food_diff_kcal_color: makeColor(
        item?.food_goal_kcal, item?.food_total_kcal, "kcal"
      ),
      food_diff_carb_color: makeColor(
        item?.food_goal_carb, item?.food_total_carb, "carb"
      ),
      food_diff_protein_color: makeColor(
        item?.food_goal_protein, item?.food_total_protein, "protein"
      ),
      food_diff_fat_color: makeColor(
        item?.food_goal_fat, item?.food_total_fat, "fat"
      ),
    });
  });

  return object;
};