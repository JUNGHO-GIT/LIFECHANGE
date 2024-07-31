// moneyDiffService.js

import * as repository from "../../repository/money/moneyDiffRepository.js";

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = async (
  user_id_param, PAGING_param, DATE_param
) => {

  const dateTypeOrder = ["day", "week", "month", "year"];
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const sort = PAGING_param.sort === "asc" ? 1 : -1;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.list.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );
  const listGoal = await repository.list.listGoal(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );

  listGoal.sort((a, b) => {
    const dateTypeA = a.money_goal_dateType;
    const dateTypeB = b.money_goal_dateType;
    const dateStartA = new Date(a.money_goal_dateStart);
    const dateStartB = new Date(b.money_goal_dateStart);
    const sortOrder = sort;

    const dateTypeDiff = dateTypeOrder.indexOf(dateTypeA) - dateTypeOrder.indexOf(dateTypeB);
    const dateDiff = dateStartA.getTime() - dateStartB.getTime();

    if (dateTypeDiff !== 0) {
      return dateTypeDiff;
    }
    return sortOrder === 1 ? dateDiff : -dateDiff;
  });

  const finalResult = await Promise.all(listGoal.map(async (goal) => {
    const dateStart = goal?.money_goal_dateStart;
    const dateEnd = goal?.money_goal_dateEnd;

    const listReal = await repository.list.list (
      user_id_param, dateType, dateStart, dateEnd
    );

    const moneyTotalIn = listReal.reduce((acc, curr) => (
      acc + (curr?.money_total_income ?? 0)
    ), 0);
    const moneyTotalExpense = listReal.reduce((acc, curr) => (
      acc + (curr?.money_total_expense ?? 0)
    ), 0);

    return {
      ...goal,
      money_total_income: moneyTotalIn,
      money_total_expense: moneyTotalExpense
    };
  }));

  return {
    totalCnt : totalCnt,
    result : finalResult
  }
};