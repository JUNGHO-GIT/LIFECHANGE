// foodDiffMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 1. compareValue -------------------------------------------------------------------------------
  const compareValue = (goalParam: string, realParam: string) => {

    let goal: number = parseFloat(goalParam);
    let real: number = parseFloat(realParam);
    let finalResult: string = "";

    if (goal > real) {
      finalResult = `-${(parseFloat(Math.abs(goal - real).toFixed(2)).toString())}`;
    }
    else {
      finalResult = `+${(parseFloat(Math.abs(real - goal).toFixed(2)).toString())}`;
    }

    return finalResult;
  };

  // 3. calcNonValueColor --------------------------------------------------------------------------
  const calcNonValueColor = (param: string) => {

    let finalResult: string = "";

    if (!param) {
      return
    }
    else if (param.length > 12) {
      finalResult = "fs-0-8rem fw-600";
    }
    else if (param.length > 6) {
      finalResult = "fs-0-9rem fw-600";
    }
    else {
      finalResult = "fs-1-0rem fw-600";
    }

    if (param === "0" || param === "00:00") {
      finalResult += " grey";
    }
    else {
      finalResult += " black";
    }

    return finalResult;
  };

  // 4. calcDiffColor ------------------------------------------------------------------------------
  const calcDiffColor = (goalParam: string, realParam: string, extra: string) => {

    let goal: number = parseFloat(goalParam);
    let real: number = parseFloat(realParam);
    let percent: number = 0;
    let finalResult: string = "";

    if (goalParam.length > 12 || realParam.length > 12) {
      finalResult = "fs-0-8rem fw-600";
    }
    else if (goalParam.length > 6 || realParam.length > 6) {
      finalResult = "fs-0-9rem fw-600";
    }
    else {
      finalResult = "fs-1-0rem fw-600";
    }

    // 1. kcal, carb, protein, fat
    if (extra === "kcal" || extra === "carb" || extra === "protein" || extra === "fat") {
      percent = Math.abs(((goal - real) / goal) * 100);

      // 1. ~ 1%
      if (percent > 0 && percent <= 1) {
        finalResult += " firstScore";
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        finalResult += " secondScore";
      }
      // 3. 10% ~ 30%
      else if (percent > 10 && percent <= 30) {
        finalResult += " thirdScore";
      }
      // 4. 30% ~ 50%
      else if (percent > 30 && percent <= 50) {
        finalResult += " fourthScore";
      }
      // 5. 50% ~
      else {
        finalResult += " fifthScore";
      }
    }

    return finalResult;
  };

  // 10. return ------------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    item.food_total_kcal_color = calcNonValueColor(
      item?.food_total_kcal
    );
    item.food_total_carb_color = calcNonValueColor(
      item?.food_total_carb
    );
    item.food_total_protein_color = calcNonValueColor(
      item?.food_total_protein
    );
    item.food_total_fat_color = calcNonValueColor(
      item?.food_total_fat
    );
    item.food_goal_kcal_color = calcNonValueColor(
      item?.food_goal_kcal
    );
    item.food_goal_carb_color = calcNonValueColor(
      item?.food_goal_carb
    );
    item.food_goal_protein_color = calcNonValueColor(
      item?.food_goal_protein
    );
    item.food_goal_fat_color = calcNonValueColor(
      item?.food_goal_fat
    );
    item.food_diff_kcal = compareValue(
      item?.food_goal_kcal, item?.food_total_kcal
    );
    item.food_diff_carb = compareValue(
      item?.food_goal_carb, item?.food_total_carb
    );
    item.food_diff_protein = compareValue(
      item?.food_goal_protein, item?.food_total_protein
    );
    item.food_diff_fat = compareValue(
      item?.food_goal_fat, item?.food_total_fat
    );
    item.food_diff_kcal_color = calcDiffColor(
      item?.food_goal_kcal, item?.food_total_kcal, "kcal"
    );
    item.food_diff_carb_color = calcDiffColor(
      item?.food_goal_carb, item?.food_total_carb, "carb"
    );
    item.food_diff_protein_color = calcDiffColor(
      item?.food_goal_protein, item?.food_total_protein, "protein"
    );
    item.food_diff_fat_color = calcDiffColor(
      item?.food_goal_fat, item?.food_total_fat, "fat"
    );
  });

  return object;
};