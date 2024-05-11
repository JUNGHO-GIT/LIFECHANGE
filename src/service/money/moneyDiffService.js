// moneyDiffService.js

import * as repository from "../../repository/money/moneyDiffRepository.js";

// 1. diff ---------------------------------------------------------------------------------------->
export const diff = async (
  user_id_param, FILTER_param, PAGING_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split("~");

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = PAGING_param.limit === 0 ? 5 : PAGING_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const listPlan = await repository.diff.listPlan(
    user_id_param, sort, limit, page, startDt_param, endDt_param
  );

  const finalResult = await Promise.all(listPlan.map(async (plan) => {
    const startDt = plan.money_plan_startDt;
    const endDt = plan.money_plan_endDt;

    const listReal = await repository.diff.list (
      user_id_param, startDt, endDt
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

  return finalResult;
};