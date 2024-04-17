// moneyPlanService.js

import * as repository from "../repository/moneyPlanRepository.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  money_dur_param,
  money_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDtReal, endDtReal] = money_dur_param.split(` ~ `);
  const [startDtPlan, endDtPlan] = money_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.totalCnt(
    user_id_param, startDtReal, endDtReal
  );

  const findPlan = await repository.list.findPlan(
    user_id_param, sort, limit, page, startDtPlan, endDtPlan
  );

  const findReal = await repository.list.findReal(
    user_id_param, startDtReal, endDtReal
  );

  console.log("startDtPlan : " + startDtPlan);
  console.log("endDtPlan : " + endDtPlan);
  console.log("startDtReal : " + startDtReal);
  console.log("endDtReal : " + endDtReal);
  console.log("findPlan : " + JSON.stringify(findPlan));
  console.log("findReal : " + JSON.stringify(findReal));

  const finalResult = findPlan?.map((plan) => {
    const matches = findReal?.filter((real) => (
      real && plan &&
      real.money_startDt && real.money_endDt &&
      plan.money_plan_startDt && plan.money_plan_endDt &&
      real.money_startDt <= plan.money_plan_endDt &&
      real.money_endDt >= plan.money_plan_startDt
    ));
    const totalIn = matches.reduce((sum, curr) => (
      sum + curr.money_section.reduce((acc, section) => (
        section.money_part_val === "수입" ? acc + (section.money_amount || 0) : acc
      ), 0)
    ), 0);
    const totalOut = matches.reduce((sum, curr) => (
      sum + curr.money_section.reduce((acc, section) => (
        section.money_part_val === "지출" ? acc + (section.money_amount || 0) : acc
      ), 0)
    ), 0);

    return {
      ...plan,
      money_in: totalIn,
      money_out: totalOut
    };
  });

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