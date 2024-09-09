// foodDiffMiddleware.ts

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = async (object: any) => {

  // 1. compareValue -------------------------------------------------------------------------------
  const compareValue = (goalParam: string, realParam: string) => {
    const goal = parseFloat(goalParam);
    const real = parseFloat(realParam);
    if (goal > real) {
      return `-${(parseFloat(Math.abs(goal - real).toFixed(2)).toString())}`;
    }
    else {
      return `+${(parseFloat(Math.abs(real - goal).toFixed(2)).toString())}`;
    }
  };

  // 3. makeNonValueColor -------------------------------------------------------------------------
  const makeNonValueColor = (param: string) => {
    if (param === "0" || param === "00:00") {
      return "grey";
    }
    else {
      return "";
    }
  };

  // 4. makeDiffColor ------------------------------------------------------------------------------
  const makeDiffColor = (goalParam: string, realParam: string, extra: string) => {
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
      food_goal_kcal_color: makeNonValueColor(
        item?.food_goal_kcal
      ),
      food_goal_carb_color: makeNonValueColor(
        item?.food_goal_carb
      ),
      food_goal_protein_color: makeNonValueColor(
        item?.food_goal_protein
      ),
      food_goal_fat_color: makeNonValueColor(
        item?.food_goal_fat
      ),
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
      food_diff_kcal_color: makeDiffColor(
        item?.food_goal_kcal, item?.food_total_kcal, "kcal"
      ),
      food_diff_carb_color: makeDiffColor(
        item?.food_goal_carb, item?.food_total_carb, "carb"
      ),
      food_diff_protein_color: makeDiffColor(
        item?.food_goal_protein, item?.food_total_protein, "protein"
      ),
      food_diff_fat_color: makeDiffColor(
        item?.food_goal_fat, item?.food_total_fat, "fat"
      ),
    });
  });

  return object;
};