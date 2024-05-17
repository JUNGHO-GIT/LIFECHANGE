

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (object) => {

  if (!object) {
    return [];
  }

  const compareCount = (plan, real, extra) => {
    if (extra === "in") {
      return Math.abs(plan - real);
    }
    if (extra === "out") {
      return Math.abs(real - plan);
    }
  }

  const makeColor = (plan, real, extra) => {
    let percent = (Math.abs(plan - real) / plan) * 100;
    if (plan === undefined || real === undefined) {
      return "danger";
    }
    else if (extra === "in") {
      if (plan > real) {
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
    if (extra === "out") {
      if (plan > real) {
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
  }

  object?.result?.map((item) => {
    Object.assign((item), {
      money_diff_in: compareCount(
        item?.money_plan_in, item?.money_total_in, "in"
      ),
      money_diff_out: compareCount(
        item?.money_plan_out, item?.money_total_out, "out"
      ),
      money_diff_in_color: makeColor(
        item?.money_plan_in, item?.money_total_in, "in"
      ),
      money_diff_out_color: makeColor(
        item?.money_plan_out, item?.money_total_out, "out"
      ),
    });
  });

  return object;
};