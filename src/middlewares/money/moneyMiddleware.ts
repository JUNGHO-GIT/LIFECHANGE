// moneyMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  const makeNonValueColor = (param: string) => {
    if (param === "0" || param === "00:00") {
      return "grey";
    }
    else {
      return "";
    }
  };

  object?.result?.forEach((item: any) => {
    Object.assign(item, {
      money_total_income_color: makeNonValueColor(
        item?.money_total_income
      ),
      money_total_expense_color: makeNonValueColor(
        item?.money_total_expense
      ),
    });
  });

  return object;
};

// 3. save -----------------------------------------------------------------------------------------
export const save = async (object: any) => {

  let totalIncome = 0;
  let totalExpense = 0;

  object?.money_section?.map((item: any) => {
    if (item?.money_part_val === "income") {
      totalIncome += parseFloat(item?.money_amount);
    }
    else if (item?.money_part_val === "expense") {
      totalExpense += parseFloat(item?.money_amount);
    }
  });

  object.money_total_income = String(totalIncome);
  object.money_total_expense = String(totalExpense);

  return object;
};

// 4. update ---------------------------------------------------------------------------------------
export const update = async (object: any) => {

  let totalIncome = 0;
  let totalExpense = 0;

  object?.money_section?.map((item: any) => {
    if (item?.money_part_val === "income") {
      totalIncome += parseFloat(item?.money_amount);
    }
    else if (item?.money_part_val === "expense") {
      totalExpense += parseFloat(item?.money_amount);
    }
  });

  object.money_total_income = String(totalIncome);
  object.money_total_expense = String(totalExpense);

  return object;
};

// 5. deletes --------------------------------------------------------------------------------------
export const deletes = async (object: any) => {

  let totalIncome = 0;
  let totalExpense = 0;

  object?.money_section?.map((item: any) => {
    if (item?.money_part_val === "income") {
      totalIncome += parseFloat(item?.money_amount);
    }
    else if (item?.money_part_val === "expense") {
      totalExpense += parseFloat(item?.money_amount);
    }
  });

  object.money_total_income = String(totalIncome);
  object.money_total_expense = String(totalExpense);

  return object;
};