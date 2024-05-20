// foodDiffService.js

import * as repository from "../../repository/food/foodDiffRepository.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param, FILTER_param, PAGING_param, duration_param
) => {

  const [dateStart, dateEnd] = duration_param.split(` ~ `);
  const dateType = FILTER_param.dateType;

  const sort = FILTER_param.order === "asc" ? 1 : -1;

  const limit = PAGING_param.limit === 0 ? 5 : PAGING_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.list.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );

  const listPlan = await repository.list.listPlan(
    user_id_param, dateType, dateStart, dateEnd, sort, limit, page
  );

  const finalResult = await Promise.all(listPlan.map(async (plan) => {
    const dateStart = plan.food_plan_date_start;
    const dateEnd = plan.food_plan_date_end;

    const listReal = await repository.list.list (
      user_id_param, dateType, dateStart, dateEnd
    );

    const foodTotalKcal = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_kcal ?? 0)
    ), 0);
    const foodTotalCarb = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_carb ?? 0)
    ), 0);
    const foodTotalProtein = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_protein ?? 0)
    ), 0);
    const foodTotalFat = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_fat ?? 0)
    ), 0);

    return {
      ...plan,
      food_total_kcal: foodTotalKcal,
      food_total_carb: foodTotalCarb,
      food_total_protein: foodTotalProtein,
      food_total_fat: foodTotalFat
    };
  }));

  return {
    totalCnt : totalCnt,
    result : finalResult
  }
};