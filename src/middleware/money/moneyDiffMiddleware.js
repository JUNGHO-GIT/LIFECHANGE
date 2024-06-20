

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = async (object) => {

  if (!object) {
    return [];
  }

  const compareCount = (goal, real, extra) => {
    if (extra === "income") {
      return Math.abs(goal - real);
    }
    if (extra === "expense") {
      return Math.abs(real - goal);
    }
  }

  const makeColor = (goal, real, extra) => {
    if (goal === undefined || real === undefined) {
      return "danger";
    }
    else if (extra === "income") {
      const percent = (Math.abs(goal - real) / goal) * 100;
      if (goal > real) {
        if (percent > 0 && percent <= 1) {
          return "primary";
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return "success";
        }
        // 3. 10% ~ 30%
        else if (percent > 10 && percent <= 30) {
          return "secondary";
        }
        // 4. 30% ~ 50%
        else if (percent > 30 && percent <= 50) {
          return "warning";
        }
        // 5. 50% ~
        else {
          return "danger";
        }
      }
      else {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
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
      }
    }
    if (extra === "expense") {
      const percent = (Math.abs(goal - real) / goal) * 100;
      if (goal > real) {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
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
      }
      else {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return "primary";
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return "success";
        }
        // 3. 10% ~ 30%
        else if (percent > 10 && percent <= 30) {
          return "secondary";
        }
        // 4. 30% ~ 50%
        else if (percent > 30 && percent <= 50) {
          return "warning";
        }
        // 5. 50% ~
        else {
          return "danger";
        }
      }
    }
  }

  object?.result?.map((item) => {
    Object.assign((item), {
      money_diff_income: compareCount(
        item?.money_goal_income, item?.money_total_income, "income"
      ),
      money_diff_expense: compareCount(
        item?.money_goal_expense, item?.money_total_expense, "expense"
      ),
      money_diff_income_color: makeColor(
        item?.money_goal_income, item?.money_total_income, "income"
      ),
      money_diff_expense_color: makeColor(
        item?.money_goal_expense, item?.money_total_expense, "expense"
      ),
    });
  });

  return object;
};