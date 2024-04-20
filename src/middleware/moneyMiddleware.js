// moneyMiddleware.js

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (object) => {

  const compareCount = (plan, real) => {
    const diff = Math.abs(plan - real);
    return diff;
  };

  const makeColor = (plan, real, extra) => {

    let percent = 0;
    if (extra === "in") {
      percent = ((plan - real) / plan) * 100;
    }
    if (extra === "out") {
      percent = ((real - plan) / plan) * 100;
    }
    // 1. ~ 1%
    if (percent <= 1) {
      return "text-primary";
    }
    // 2. 1% ~ 10%
    else if (percent > 1 && percent <= 10) {
      return "text-success";
    }
    // 3. 10% ~ 50%
    else if (percent > 10 && percent <= 30) {
      return "text-warning";
    }
    // 4. 50% ~
    else {
      return "text-danger";
    }
  };

  if (!object) {
    return [];
  }

  object?.result?.map((item) => {

    Object.assign((item), {
      money_diff_in: compareCount(item.money_plan_in, item.money_total_in),
      money_diff_out: compareCount(item.money_plan_out, item.money_total_out),

      money_diff_in_color: makeColor(item.money_plan_in, item.money_total_in, "in"),
      money_diff_out_color: makeColor(item.money_plan_out, item.money_total_out, "out"),
    });
  });

  return object;
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (object) => {
  if (object === "deleted") {
    return {};
  }
  else {
    let totalIn = 0;
    let totalOut = 0;

    object?.money_section?.map((item) => {
      if (item.money_part_val === "수입") {
        totalIn += item.money_amount;
      }
      else if (item.money_part_val === "지출") {
        totalOut += item.money_amount;
      }
    });

    object.money_total_in = totalIn;
    object.money_total_out = totalOut;

    return object;
  }
};