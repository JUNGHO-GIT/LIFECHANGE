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

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = async (object) => {
  if (object === "deleted") {
    return {};
  }
  let totalIncome = 0;
  let totalExpense = 0;

  object?.money_section?.map((item) => {
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