// moneyGoalMiddleware.ts

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = async (object: any) => {

  if (!object) {
    return [];
  }

  // 1. compareValue -------------------------------------------------------------------------------
  const compareValue = (goalParam: string, realParam: string, extra: string) => {
    const goal = parseFloat(goalParam);
    const real = parseFloat(realParam);
    if (extra === "income") {
      if (goal > real) {
        return `-${(parseFloat(Math.abs(goal - real).toFixed(2)).toString())}`;
      }
      else {
        return `+${(parseFloat(Math.abs(real - goal).toFixed(2)).toString())}`;
      }
    }
    if (extra === "expense") {
      if (goal > real) {
        return `-${(parseFloat(Math.abs(real - goal).toFixed(2)).toString())}`;
      }
      else {
        return `+${(parseFloat(Math.abs(real - goal).toFixed(2)).toString())}`;
      }
    }
  }

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
    if (goal === undefined || real === undefined) {
      return "fifthScore";
    }
    else if (extra === "income") {
      const percent = (Math.abs(goal - real) / goal) * 100;
      if (goal > real) {
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
      }
      else {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return "fifthScore";
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return "fourthScore";
        }
        // 3. 10% ~ 30%
        else if (percent > 10 && percent <= 30) {
          return "thirdScore";
        }
        // 4. 30% ~ 50%
        else if (percent > 30 && percent <= 50) {
          return "secondScore";
        }
        // 5. 50% ~
        else {
          return "firstScore";
        }
      }
    }
    if (extra === "expense") {
      const percent = (Math.abs(goal - real) / goal) * 100;
      if (goal > real) {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return "fifthScore";
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return "fourthScore";
        }
        // 3. 10% ~ 30%
        else if (percent > 10 && percent <= 30) {
          return "thirdScore";
        }
        // 4. 30% ~ 50%
        else if (percent > 30 && percent <= 50) {
          return "secondScore";
        }
        // 5. 50% ~
        else {
          return "firstScore";
        }
      }
      else {
        // 1. 0% ~ 1%
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
      }
    }
  }

  // 4. result -------------------------------------------------------------------------------------
  object?.result?.map((item: any) => {
    Object.assign((item), {
      money_total_income_color: makeNonValueColor(
        item?.money_total_income
      ),
      money_total_expense_color: makeNonValueColor(
        item?.money_total_expense
      ),
      money_goal_income_color: makeNonValueColor(
        item?.money_goal_income
      ),
      money_goal_expense_color: makeNonValueColor(
        item?.money_goal_expense
      ),
      money_diff_income: compareValue(
        item?.money_goal_income, item?.money_total_income, "income"
      ),
      money_diff_expense: compareValue(
        item?.money_goal_expense, item?.money_total_expense, "expense"
      ),
      money_diff_income_color: makeDiffColor(
        item?.money_goal_income, item?.money_total_income, "income"
      ),
      money_diff_expense_color: makeDiffColor(
        item?.money_goal_expense, item?.money_total_expense, "expense"
      ),
    });
  });

  return object;
};