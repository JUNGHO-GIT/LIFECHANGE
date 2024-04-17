// moneyPlanService.js

import * as repository from "../repository/moneyPlanRepository.js";
import {compareCount, compareTime, strToDecimal, decimalToStr} from "../assets/common/common.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  money_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDtPlan, endDtPlan] = money_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.totalCnt(
    user_id_param, startDtPlan, endDtPlan
  );
  const findPlan = await repository.list.findPlan(
    user_id_param, sort, limit, page, startDtPlan, endDtPlan
  );

  const finalResult = await Promise.all(findPlan.map(async (plan) => {
    const startDt = plan.money_plan_startDt;
    const endDt = plan.money_plan_endDt;

    const findReal = await repository.list.findReal(
      user_id_param, startDt, endDt
    );

    const moneyTotalIn = findReal.reduce((acc, curr) => (
      acc + (curr?.money_total_in ?? 0)
    ), 0);
    const moneyTotalOut = findReal.reduce((acc, curr) => (
      acc + (curr?.money_total_out ?? 0)
    ), 0);

    return {
      ...plan,
      money_total_in: moneyTotalIn,
      money_total_out: moneyTotalOut,
      money_diff_in: compareCount(
        plan.money_plan_in, moneyTotalIn
      ),
      money_diff_out: compareCount(
        plan.money_plan_out, moneyTotalOut
      )
    };
  }));

  return {
    totalCnt: totalCnt,
    result: finalResult
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  money_plan_dur_param
) => {

  const [startDt, endDt] = money_plan_dur_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    _id_param, user_id_param, startDt, endDt
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  MONEY_PLAN_param,
  money_plan_dur_param
) => {

  const [startDt, endDt] = money_plan_dur_param.split(` ~ `);

  const findResult = await repository.save.detail(
    "", user_id_param, startDt, endDt
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.save.create(
      user_id_param, MONEY_PLAN_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.save.update(
      findResult._id, MONEY_PLAN_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  money_plan_dur_param
) => {

  const [startDt, endDt] = money_plan_dur_param.split(` ~ `);

  const finalResult = await repository.deletes.deletes(
    _id_param, user_id_param, startDt, endDt
  );

  return finalResult
};