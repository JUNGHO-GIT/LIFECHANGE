// sleepPlanService.js

import * as repository from "../../repository/plan/sleepPlanRepository.js";

// 1-1. compare ----------------------------------------------------------------------------------->
export const compare = async (
  user_id_param,
  sleep_dur_param,
  sleep_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDtReal, endDtReal] = sleep_dur_param.split(` ~ `);
  const [startDtPlan, endDtPlan] = sleep_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.totalCnt(
    user_id_param, startDtReal, endDtReal
  );

  const findResultPlan = await repository.findPlan(
    user_id_param, startDtPlan, endDtPlan, sort, limit, page
  );

  const findResultReal = await repository.findReal(
    user_id_param, startDtReal, endDtReal, sort, limit, page
  );

  const finalResult = findResultPlan?.map((plan) => {
    const match = findResultReal.find((real) => (
      real && plan &&
      real.sleep_startDt && real.sleep_endDt &&
      plan.sleep_plan_startDt && plan.sleep_plan_endDt &&
      real.sleep_startDt <= plan.sleep_plan_endDt &&
      real.sleep_endDt >= plan.sleep_plan_startDt
    ));
    return match ? {
      ...plan,
      sleep_startDt: match?.sleep_startDt,
      sleep_endDt: match?.sleep_endDt,
      sleep_night: match?.sleep_section[0].sleep_night,
      sleep_morning: match?.sleep_section[0].sleep_morning,
      sleep_time: match?.sleep_section[0].sleep_time,
    } : {
      ...plan,
      sleep_startDt: "",
      sleep_endDt: "",
      sleep_night: "",
      sleep_morning: "",
      sleep_time: "",
    };
  });

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 1-2. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  sleep_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDt, endDt] = sleep_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.totalCnt(
    user_id_param, startDt, endDt
  );

  const findResult = await repository.findPlan(
    user_id_param, startDt, endDt, sort, limit, page
  );

  return {
    totalCnt: totalCnt,
    result: findResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  sleep_plan_dur_param
) => {

  const [startDt, endDt] = sleep_plan_dur_param.split(` ~ `);

  const finalResult = await repository.detail(
    _id_param, user_id_param, startDt, endDt
  );

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  SLEEP_PLAN_param,
  sleep_plan_dur_param
) => {

  const [startDt, endDt] = sleep_plan_dur_param.split(` ~ `);

  const findResult = await repository.detail(
    "", user_id_param, startDt, endDt
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.create(
      user_id_param, SLEEP_PLAN_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.update(
      findResult._id, SLEEP_PLAN_param
    );
  }

  return {
    result: finalResult
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  sleep_plan_dur_param
) => {

  const [startDt, endDt] = sleep_plan_dur_param.split(` ~ `);

  const finalResult = await repository.deletes(
    _id_param, user_id_param, startDt, endDt
  );

  return {
    result: finalResult
  };
};