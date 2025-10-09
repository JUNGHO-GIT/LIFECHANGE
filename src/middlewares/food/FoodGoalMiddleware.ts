// foodDiffMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 0. calcOverTenMillion -------------------------------------------------------------------------
  const calcOverTenMillion = (param: string) => {

    let finalResult: string = "";

    if (!param || param === "0" || param === "00:00" || String(param).includes(":")) {
      finalResult = param;
    }
    // 12300000 -> 1.23M / 10000000 -> 10M
    else if (Number(param) >= 10_000_000) {
      finalResult = `${(parseFloat((Number(param) / 1_000_000).toFixed(2)).toString())}M`;
    }
    else {
      finalResult = parseFloat(Number(param).toFixed(2)).toString();
    }

    return finalResult;
  };

  // 0. calcNonValueColor --------------------------------------------------------------------------
  const calcNonValueColor = (param: string) => {

    let finalResult: string = "";

    if (!param) {
      finalResult = param;
    }
    else if (param === "0" || param === "00:00") {
      finalResult = "grey";
    }
    else {
      finalResult = "light-black";
    }

    return finalResult;
  };

  // 1. compareValue -------------------------------------------------------------------------------
  const compareValue = (goalParam: string, recordParam: string) => {

    let goal: number = parseFloat(goalParam);
    let record: number = parseFloat(recordParam);
    let finalResult: string = "";

    if (goal > record) {
      finalResult = `-${(parseFloat(Math.abs(goal - record).toFixed(2)).toString())}`;
    }
    else {
      finalResult = `+${(parseFloat(Math.abs(record - goal).toFixed(2)).toString())}`;
    }

    return finalResult;
  };

  // 4. calcDiffColor ------------------------------------------------------------------------------
  const calcDiffColor = (goalParam: string, recordParam: string, extra: string) => {

    let goal: number = parseFloat(goalParam);
    let record: number = parseFloat(recordParam);
    let percent: number = 0;
    let finalResult: string = "";

    // 1. kcal, carb, protein, fat
    if (extra === "kcal" || extra === "carb" || extra === "protein" || extra === "fat") {
      percent = Math.abs(((goal - record) / goal) * 100);

      // 1. - 1%
      if (percent > 0 && percent <= 1) {
        finalResult += " firstScore";
      }
      // 2. 1% - 10%
      else if (percent > 1 && percent <= 10) {
        finalResult += " secondScore";
      }
      // 3. 10% - 30%
      else if (percent > 10 && percent <= 30) {
        finalResult += " thirdScore";
      }
      // 4. 30% - 50%
      else if (percent > 30 && percent <= 50) {
        finalResult += " fourthScore";
      }
      // 5. 50% -
      else {
        finalResult += " fifthScore";
      }
    }

    return finalResult;
  };

	// 10. return ----------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    item.food_record_total_kcal = calcOverTenMillion(
      item?.food_record_total_kcal
    );
    item.food_record_total_carb = calcOverTenMillion(
      item?.food_record_total_carb
    );
    item.food_record_total_protein = calcOverTenMillion(
      item?.food_record_total_protein
    );
    item.food_record_total_fat = calcOverTenMillion(
      item?.food_record_total_fat
    );

    item.food_goal_kcal = calcOverTenMillion(
      item?.food_goal_kcal
    );
    item.food_goal_carb = calcOverTenMillion(
      item?.food_goal_carb
    );
    item.food_goal_protein = calcOverTenMillion(
      item?.food_goal_protein
    );
    item.food_goal_fat = calcOverTenMillion(
      item?.food_goal_fat
    );

    item.food_record_total_kcal_color = calcNonValueColor(
      item?.food_record_total_kcal
    );
    item.food_record_total_carb_color = calcNonValueColor(
      item?.food_record_total_carb
    );
    item.food_record_total_protein_color = calcNonValueColor(
      item?.food_record_total_protein
    );
    item.food_record_total_fat_color = calcNonValueColor(
      item?.food_record_total_fat
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

    item.food_record_diff_kcal = calcOverTenMillion(compareValue(
      item?.food_goal_kcal, item?.food_record_total_kcal
    ));
    item.food_record_diff_carb = calcOverTenMillion(compareValue(
      item?.food_goal_carb, item?.food_record_total_carb
    ));
    item.food_record_diff_protein = calcOverTenMillion(compareValue(
      item?.food_goal_protein, item?.food_record_total_protein
    ));
    item.food_record_diff_fat = calcOverTenMillion(compareValue(
      item?.food_goal_fat, item?.food_record_total_fat
    ));

    item.food_record_diff_kcal_color = calcDiffColor(
      item?.food_goal_kcal, item?.food_record_total_kcal, "kcal"
    );
    item.food_record_diff_carb_color = calcDiffColor(
      item?.food_goal_carb, item?.food_record_total_carb, "carb"
    );
    item.food_record_diff_protein_color = calcDiffColor(
      item?.food_goal_protein, item?.food_record_total_protein, "protein"
    );
    item.food_record_diff_fat_color = calcDiffColor(
      item?.food_goal_fat, item?.food_record_total_fat, "fat"
    );
  });

  return object;
};