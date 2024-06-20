// moneyMiddleware.js

// 3. save -----------------------------------------------------------------------------------------
export const save = async (object) => {
  if (object === "deleted") {
    return {};
  }
  let totalIncome = 0;
  let totalExpense = 0;

  object?.money_section?.map((item) => {
    if (item?.money_part_val === "income") {
      totalIncome += item?.money_amount;
    }
    else if (item?.money_part_val === "expense") {
      totalExpense += item?.money_amount;
    }
  });

  object.money_total_income = totalIncome;
  object.money_total_expense = totalExpense;

  return object;
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = async (object) => {
  if (object === "deleted") {
    return {};
  }
  let totalIncome = 0;
  let totalExpense = 0;

  object?.money_section?.map((item) => {
    if (item?.money_part_val === "income") {
      totalIncome += item?.money_amount;
    }
    else if (item?.money_part_val === "expense") {
      totalExpense += item?.money_amount;
    }
  });

  object.money_total_income = totalIncome;
  object.money_total_expense = totalExpense;

  return object;
};