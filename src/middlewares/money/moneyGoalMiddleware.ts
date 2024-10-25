// moneyGoalMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 1. compareValue -------------------------------------------------------------------------------
  const compareValue = (goalParam: string, realParam: string, extra: string) => {

    let goal: number = parseFloat(goalParam);
    let real: number = parseFloat(realParam);
    let finalResult: string = "";

    if (extra === "income") {
      if (goal > real) {
        finalResult = `-${(parseFloat(Math.abs(goal - real).toFixed(2)).toString())}`;
      }
      else {
        finalResult = `+${(parseFloat(Math.abs(real - goal).toFixed(2)).toString())}`;
      }
    }
    if (extra === "expense") {
      if (goal > real) {
        finalResult = `-${(parseFloat(Math.abs(real - goal).toFixed(2)).toString())}`;
      }
      else {
        finalResult = `+${(parseFloat(Math.abs(real - goal).toFixed(2)).toString())}`;
      }
    }

    return finalResult;
  }

  // 3. calcNonValueColor --------------------------------------------------------------------------
  const calcNonValueColor = (param: string) => {

    let finalResult: string = "";

    if (!param) {
      return
    }

    if (param.length > 12) {
      finalResult = "fs-0-8rem fw-600";
    }
    else if (6 < param.length && param.length <= 12) {
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

    if (String(Math.abs(goal - real)).length > 12) {
      finalResult = "fs-0-8rem fw-600";
    }
    else if (6 < String(Math.abs(goal - real)).length && String(Math.abs(goal - real)).length <= 12) {
      finalResult = "fs-0-9rem fw-600";
    }
    else {
      finalResult = "fs-1-0rem fw-600";
    }

    // 1. income
    if (extra === "income") {
      percent = (Math.abs(goal - real) / goal) * 100;
      if (goal > real) {
        if (percent > 0 && percent <= 1) {
          finalResult += " firstScore";
        }
        else if (percent > 1 && percent <= 10) {
          finalResult += " secondScore";
        }
        else if (percent > 10 && percent <= 30) {
          finalResult += " thirdScore";
        }
        else if (percent > 30 && percent <= 50) {
          finalResult += " fourthScore";
        }
        else {
          finalResult += " fifthScore";
        }
      }
      else {
        if (percent > 0 && percent <= 1) {
          finalResult += " fifthScore";
        }
        else if (percent > 1 && percent <= 10) {
          finalResult += " fourthScore";
        }
        else if (percent > 10 && percent <= 30) {
          finalResult += " thirdScore";
        }
        else if (percent > 30 && percent <= 50) {
          finalResult += " secondScore";
        }
        else {
          finalResult += " firstScore";
        }
      }
    }
    // 2. expense
    if (extra === "expense") {
      percent = (Math.abs(goal - real) / goal) * 100;
      if (goal > real) {
        if (percent > 0 && percent <= 1) {
          finalResult += " fifthScore";
        }
        else if (percent > 1 && percent <= 10) {
          finalResult += " fourthScore";
        }
        else if (percent > 10 && percent <= 30) {
          finalResult += " thirdScore";
        }
        else if (percent > 30 && percent <= 50) {
          finalResult += " secondScore";
        }
        else {
          finalResult += " firstScore";
        }
      }
      else {
        if (percent > 0 && percent <= 1) {
          finalResult += " firstScore";
        }
        else if (percent > 1 && percent <= 10) {
          finalResult += " secondScore";
        }
        else if (percent > 10 && percent <= 30) {
          finalResult += " thirdScore";
        }
        else if (percent > 30 && percent <= 50) {
          finalResult += " fourthScore";
        }
        else {
          finalResult += " fifthScore";
        }
      }
    }

    return finalResult;
  };

  // 10. return ------------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    item.money_goal_income_color = calcNonValueColor(
      item?.money_goal_income
    );
    item.money_goal_expense_color = calcNonValueColor(
      item?.money_goal_expense
    );
    item.money_total_income_color = calcNonValueColor(
      item?.money_total_income
    );
    item.money_total_expense_color = calcNonValueColor(
      item?.money_total_expense
    );
    item.money_diff_income = compareValue(
      item?.money_goal_income, item?.money_total_income, "income"
    );
    item.money_diff_expense = compareValue(
      item?.money_goal_expense, item?.money_total_expense, "expense"
    );
    item.money_diff_income_color = calcDiffColor(
      item?.money_goal_income, item?.money_total_income, "income"
    );
    item.money_diff_expense_color = calcDiffColor(
      item?.money_goal_expense, item?.money_total_expense, "expense"
    );
  });

  return object;
};