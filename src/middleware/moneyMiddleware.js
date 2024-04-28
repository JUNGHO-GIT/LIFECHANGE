// moneyMiddleware.js

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
      return "text-danger";
    }
    else if (extra === "in") {
      if (plan > real) {
        if (percent > 0 && percent <= 1) {
          return "text-primary";
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return "text-success";
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return "text-warning";
        }
        // 4. 50% ~
        else {
          return "text-danger";
        }
      }
      else {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return "text-danger";
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return "text-warning";
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return "text-success";
        }
        // 4. 50% ~
        else {
          return "text-primary";
        }
      }
    }
    if (extra === "out") {
      if (plan > real) {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return "text-danger";
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return "text-warning";
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return "text-success";
        }
        // 4. 50% ~
        else {
          return "text-primary";
        }
      }
      else {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return "text-primary";
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return "text-success";
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return "text-warning";
        }
        // 4. 50% ~
        else {
          return "text-danger";
        }
      }
    }
  }

  object?.result?.map((item) => {
    Object.assign((item), {
      money_diff_in: compareCount(item?.money_plan_in, item?.money_total_in, "in"),
      money_diff_out: compareCount(item?.money_plan_out, item?.money_total_out, "out"),

      money_diff_in_color: makeColor(item?.money_plan_in, item?.money_total_in, "in"),
      money_diff_out_color: makeColor(item?.money_plan_out, item?.money_total_out, "out"),
    });
  });

  return object;
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (object) => {
  if (object === "deleted") {
    return {};
  }
  let totalIn = 0;
  let totalOut = 0;

  object?.money_section?.map((item) => {
    if (item?.money_part_val === "수입") {
      totalIn += item?.money_amount;
    }
    else if (item?.money_part_val === "지출") {
      totalOut += item?.money_amount;
    }
  });

  object.money_total_in = totalIn;
  object.money_total_out = totalOut;

  return object;
};