// moneyDiffService.js

import * as repository from "../../repository/money/moneyDiffRepository.js";

// 1. list (리스트는 gte lte) --------------------------------------------------------------------->
export const list = async (
  user_id_param, PAGING_param, DATE_param
) => {

  const dateType = DATE_param.dateType === "" ? "전체" : DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const sort = PAGING_param.order === "asc" ? 1 : -1;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.list.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );
  const listPlan = await repository.list.listPlan(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );

  const finalResult = await Promise.all(listPlan.map(async (plan) => {
    const dateStart = plan?.money_plan_dateStart;
    const dateEnd = plan?.money_plan_dateEnd;

    const listReal = await repository.list.list (
      user_id_param, dateType, dateStart, dateEnd
    );

    const moneyTotalIn = listReal.reduce((acc, curr) => (
      acc + (curr?.money_total_in ?? 0)
    ), 0);
    const moneyTotalOut = listReal.reduce((acc, curr) => (
      acc + (curr?.money_total_out ?? 0)
    ), 0);

    return {
      ...plan,
      money_total_in: moneyTotalIn,
      money_total_out: moneyTotalOut
    };
  }));

  return {
    totalCnt : totalCnt,
    result : finalResult
  }
};