// foodPlanService.js

import * as repository from "../repository/foodPlanRepository.js";
import {compareCount, compareTime, strToDecimal, decimalToStr} from "../assets/common/date.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  duration_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDtPlan, endDtPlan] = duration_param.split(` ~ `);

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
    const startDt = plan.food_plan_startDt;
    const endDt = plan.food_plan_endDt;

    const findReal = await repository.list.findReal(
      user_id_param, startDt, endDt
    );

    const foodTotalKcal = findReal.reduce((acc, curr) => (
      acc + (curr?.food_total_kcal ?? 0)
    ), 0);
    const foodTotalCarb = findReal.reduce((acc, curr) => (
      acc + (curr?.food_total_carb ?? 0)
    ), 0);
    const foodTotalProtein = findReal.reduce((acc, curr) => (
      acc + (curr?.food_total_protein ?? 0)
    ), 0);
    const foodTotalFat = findReal.reduce((acc, curr) => (
      acc + (curr?.food_total_fat ?? 0)
    ), 0);

    return {
      ...plan,
      food_total_kcal: foodTotalKcal,
      food_total_carb: foodTotalCarb,
      food_total_protein: foodTotalProtein,
      food_total_fat: foodTotalFat,
      food_diff_kcal: compareCount(
        plan.food_plan_kcal, foodTotalKcal
      ),
      food_diff_carb: compareCount(
        plan.food_plan_carb, foodTotalCarb
      ),
      food_diff_protein: compareCount(
        plan.food_plan_protein, foodTotalProtein
      ),
      food_diff_fat: compareCount(
        plan.food_plan_fat, foodTotalFat
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
  duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    _id_param, user_id_param, startDt, endDt
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  OBJECT_param,
  duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const findResult = await repository.save.detail(
    "", user_id_param, startDt, endDt
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.save.create(
      user_id_param, OBJECT_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.save.update(
      findResult._id, OBJECT_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const findResult = await repository.deletes.detail(
    _id_param, user_id_param, startDt, endDt
  );

  if (!findResult) {
    return null;
  }
  else {
    await repository.deletes.deletes(
      _id_param
    );
    return "deleted";
  }
}