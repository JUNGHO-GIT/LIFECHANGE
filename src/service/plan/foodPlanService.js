// foodPlanService.js

import * as repository from "../../repository/plan/foodPlanRepository.js";

// 1-1. compare ----------------------------------------------------------------------------------->
export const compare = async (
  user_id_param,
  food_dur_param,
  food_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDtReal, endDtReal] = food_dur_param.split(` ~ `);
  const [startDtPlan, endDtPlan] = food_plan_dur_param.split(` ~ `);

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
    const matches = findResultReal?.filter((real) => (
      real && plan &&
      real.food_startDt && real.food_endDt &&
      plan.food_plan_startDt && plan.food_plan_endDt &&
      real.food_startDt <= plan.food_plan_endDt &&
      real.food_endDt >= plan.food_plan_startDt
    ));
    const totalKcal = matches.reduce((sum, curr) => (
      sum + parseFloat(curr.food_total_kcal || "0")
    ), 0);
    const totalCarb = matches.reduce((sum, curr) => (
      sum + parseFloat(curr.food_total_carb || "0")
    ), 0);
    const totalProtein = matches.reduce((sum, curr) => (
      sum + parseFloat(curr.food_total_protein || "0")
    ), 0);
    const totalFat = matches.reduce((sum, curr) => (
      sum + parseFloat(curr.food_total_fat || "0")
    ), 0);

    return {
      ...plan,
      food_kcal: totalKcal,
      food_carb: totalCarb,
      food_protein: totalProtein,
      food_fat: totalFat,
    };
  });

  return {
    totalCnt: totalCnt,
    result: finalResult
  };
};

// 1-2. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  food_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDt, endDt] = food_plan_dur_param.split(` ~ `);

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
  food_plan_dur_param
) => {

  const [startDt, endDt] = food_plan_dur_param.split(` ~ `);

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
  FOOD_PLAN_param,
  food_plan_dur_param
) => {

  const [startDt, endDt] = food_plan_dur_param.split(` ~ `);

  const findResult = await repository.detail(
    "", user_id_param, startDt, endDt
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.create(
      user_id_param, FOOD_PLAN_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.update(
      findResult._id, FOOD_PLAN_param
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
  food_plan_dur_param
) => {

  const [startDt, endDt] = food_plan_dur_param.split(` ~ `);

  const finalResult = await repository.deletes(
    _id_param, user_id_param, startDt, endDt
  );

  return {
    result: finalResult
  };
};
