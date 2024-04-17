// sleepPlanService.js

import * as repository from "../repository/sleepPlanRepository.js";
import {compareTime} from "../assets/common/Common.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
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
  const findPlan = await repository.list.findPlan(
    user_id_param, sort, limit, page, startDtPlan, endDtPlan
  );
  const findReal = await repository.list.findReal(
    user_id_param, startDtReal, endDtReal
  );

  console.log("findPlan : " + JSON.stringify(findPlan));
  console.log("findReal : " + JSON.stringify(findReal));

  const finalResult = findPlan?.map((plan) => {
    const match = findReal.find((real) => (
      real && plan &&
      real.sleep_startDt && real.sleep_endDt &&
      plan.sleep_plan_startDt && plan.sleep_plan_endDt &&
      real.sleep_startDt <= plan.sleep_plan_endDt &&
      real.sleep_endDt >= plan.sleep_plan_startDt
    ));
    return {
      ...plan,
      sleep_startDt: match?.sleep_startDt,
      sleep_endDt: match?.sleep_endDt,
      sleep_night: match?.sleep_night,
      sleep_morning: match?.sleep_morning,
      sleep_time: match?.sleep_time,
    }
  });

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  sleep_plan_dur_param
) => {

  const [startDt, endDt] = sleep_plan_dur_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    _id_param, user_id_param, startDt, endDt
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  SLEEP_PLAN_param,
  sleep_plan_dur_param
) => {

  const [startDt, endDt] = sleep_plan_dur_param.split(` ~ `);

  const findPlan = await repository.save.detail(
    "", user_id_param, startDt, endDt
  );

  let finalResult = null;
  if (!findPlan) {
    finalResult = await repository.save.create(
      user_id_param, SLEEP_PLAN_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.save.update(
      findPlan._id, SLEEP_PLAN_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  sleep_plan_dur_param
) => {

  const [startDt, endDt] = sleep_plan_dur_param.split(` ~ `);

  const finalResult = await repository.deletes.deletes(
    _id_param, user_id_param, startDt, endDt
  );

  return finalResult
};