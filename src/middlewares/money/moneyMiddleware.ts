// moneyMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 3. calcNonValueColor --------------------------------------------------------------------------
  const calcNonValueColor = (param: string) => {

    let finalResult: string = "";

    if (param.length > 12) {
      finalResult = "fs-0-8rem fw-600";
    }
    else if (param.length > 6) {
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

  // 10. return ------------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    item.money_total_income_color = calcNonValueColor(
      item?.money_total_income
    );
    item.money_total_expense_color = calcNonValueColor(
      item?.money_total_expense
    );
  });

  return object;
};