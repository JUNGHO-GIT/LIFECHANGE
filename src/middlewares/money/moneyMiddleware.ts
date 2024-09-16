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