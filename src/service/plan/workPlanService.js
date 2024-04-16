// workPlanService.js

import * as repository from "../../repository/plan/workPlanRepository.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  work_dur_param,
  work_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDtReal, endDtReal] = work_dur_param.split(` ~ `);
  const [startDtPlan, endDtPlan] = work_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.totalCnt(
    user_id_param, startDtReal, endDtReal
  );

  const findResultPlan = await repository.findPlan(
    user_id_param, sort, limit, page, startDtPlan, endDtPlan
  );

  const findResultReal = await repository.findReal(
    user_id_param, sort, limit, page, startDtReal, endDtReal
  );

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  const finalResult = findResultPlan?.map((plan) => {
    const matches = findResultReal?.filter((real) => (
      real && plan &&
      real.work_startDt && real.work_endDt &&
      plan.work_plan_startDt && plan.work_plan_endDt &&
      real.work_startDt <= plan.work_plan_endDt &&
      real.work_endDt >= plan.work_plan_startDt
    ));

    const totalCount = matches.reduce((sum, curr) => (
      sum + 1
    ), 0);

    const totalCardio = matches.reduce((sum, curr) => (
      sum + curr.work_section.reduce((acc, section) => (
        section.work_part_val === "유산소" ? acc + fmtData(curr.work_time) : acc
      ), 0)
    ), 0);

    return {
      ...plan,
      work_total_count: totalCount,
      work_total_cardio: totalCardio,
    };
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
  work_plan_dur_param
) => {

  const [startDt, endDt] = work_plan_dur_param.split(` ~ `);

  const finalResult = await repository.detail(
    _id_param, user_id_param, startDt, endDt
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  WORK_PLAN_param,
  work_plan_dur_param
) => {

  const [startDt, endDt] = work_plan_dur_param.split(` ~ `);

  const findResult = await repository.detail(
    "", user_id_param, startDt, endDt
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.create(
      user_id_param, WORK_PLAN_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.update(
      findResult._id, WORK_PLAN_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  work_plan_dur_param
) => {

  const [startDt, endDt] = work_plan_dur_param.split(` ~ `);

  const finalResult = await repository.deletes(
    _id_param, user_id_param, startDt, endDt
  );

  return finalResult
};