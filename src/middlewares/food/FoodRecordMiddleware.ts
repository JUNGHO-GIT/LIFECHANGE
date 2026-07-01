/**
 * @file FoodRecordMiddleware.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 0. calcOverTenMillion -------------------------------------------------------------------------
  const calcOverTenMillion = (param: string) => {

    let finalResult: string = ``;

    if (!param || param === `0` || param === `00:00` || String(param).includes(`:`)) {
      finalResult = param;
    }
    // 12300000 -> 1.23M / 10000000 -> 10M
    else if (Number(param) >= 10_000_000) {
      finalResult = `${(Number.parseFloat((Number(param) / 1_000_000).toFixed(2)).toString())}M`;
    }
    else {
      finalResult = Number.parseFloat(Number(param).toFixed(2)).toString();
    }

    return finalResult;
  };

  // 0. calcNonValueColor --------------------------------------------------------------------------
  const calcNonValueColor = (param: string) => {

    let finalResult: string = ``;

    if (!param) {
      finalResult = param;
    }
    else if (param === `0` || param === `00:00`) {
      finalResult = `grey`;
    }
    else {
      finalResult = `light-black`;
    }

    return finalResult;
  };

  // 1. calcGoalColor ----------------------------------------------------------------------------
  const calcGoalColor = (goalParam: string, recordParam: string, extra: string) => {

    const goal: number = Number.parseFloat(goalParam ?? `0`);
    const record: number = Number.parseFloat(recordParam ?? `0`);
    let percent: number = 0;
    let finalResult: string = ``;

    if (!goal) {
      return calcNonValueColor(recordParam);
    }

    if (extra === `protein`) {
      if (record >= goal) {
        finalResult += ` firstScore`;
      }
      else {
        percent = ((goal - record) / goal) * 100;

        if (percent > 0 && percent <= 1) {
          finalResult += ` firstScore`;
        }
        else if (percent > 1 && percent <= 10) {
          finalResult += ` secondScore`;
        }
        else if (percent > 10 && percent <= 30) {
          finalResult += ` thirdScore`;
        }
        else if (percent > 30 && percent <= 50) {
          finalResult += ` fourthScore`;
        }
        else {
          finalResult += ` fifthScore`;
        }
      }
    }
    else if (extra === `kcal` || extra === `carb` || extra === `fat`) {
      if (record <= goal) {
        finalResult += ` firstScore`;
      }
      else {
        percent = ((record - goal) / goal) * 100;

        if (percent > 0 && percent <= 1) {
          finalResult += ` firstScore`;
        }
        else if (percent > 1 && percent <= 10) {
          finalResult += ` secondScore`;
        }
        else if (percent > 10 && percent <= 30) {
          finalResult += ` thirdScore`;
        }
        else if (percent > 30 && percent <= 50) {
          finalResult += ` fourthScore`;
        }
        else {
          finalResult += ` fifthScore`;
        }
      }
    }

    return finalResult;
  };

  // 2. calcScoreSmileImage ----------------------------------------------------------------------
  const calcScoreSmileImage = (colors: string[]) => {

    const scoreMap: Record<string, number> = {
      firstScore: 5,
      secondScore: 4,
      thirdScore: 3,
      fourthScore: 2,
      fifthScore: 1,
    };
    const scores: number[] = colors.reduce((acc: number[], color: string) => {
      const scoreKey: string | undefined = Object.keys(scoreMap).find((key: string) => (
        color?.includes(key)
      ));

      if (scoreKey) {
        acc.push(scoreMap[scoreKey]);
      }

      return acc;
    }, []);

    if (scores.length <= 0) {
      return `smile3`;
    }

    const avgScore: number = scores.reduce((acc: number, score: number) => acc + score, 0) / scores.length;

    if (avgScore >= 0 && avgScore <= 1) {
      return `smile1`;
    }
    else if (avgScore > 1 && avgScore <= 2) {
      return `smile2`;
    }
    else if (avgScore > 2 && avgScore <= 3) {
      return `smile3`;
    }
    else if (avgScore > 3 && avgScore <= 4) {
      return `smile4`;
    }
    else if (avgScore > 4 && avgScore <= 5) {
      return `smile5`;
    }
    else {
      return `smile3`;
    }
  };

  // 10. return ----------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    const foodRecordTotalKcal: string = item?.food_record_total_kcal;
    const foodRecordTotalCarb: string = item?.food_record_total_carb;
    const foodRecordTotalProtein: string = item?.food_record_total_protein;
    const foodRecordTotalFat: string = item?.food_record_total_fat;

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

    item.food_record_total_kcal_color = calcGoalColor(
      item?.food_goal_kcal, foodRecordTotalKcal, `kcal`
    );
    item.food_record_total_carb_color = calcGoalColor(
      item?.food_goal_carb, foodRecordTotalCarb, `carb`
    );
    item.food_record_total_protein_color = calcGoalColor(
      item?.food_goal_protein, foodRecordTotalProtein, `protein`
    );
    item.food_record_total_fat_color = calcGoalColor(
      item?.food_goal_fat, foodRecordTotalFat, `fat`
    );
    item.food_record_score_smile = calcScoreSmileImage([
      item.food_record_total_kcal_color,
      item.food_record_total_carb_color,
      item.food_record_total_protein_color,
      item.food_record_total_fat_color,
    ]);
  });

  return object;
};
