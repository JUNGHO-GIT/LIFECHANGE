// foodDiffService.js

import * as repository from "../../repository/food/foodDiffRepository.js";

// 1. list (리스트는 gte lte) --------------------------------------------------------------------->
export const list = async (
  user_id_param, PAGING_param, DATE_param
) => {

  const dateType = DATE_param.dateType === "" ? "전체" : DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const sort = PAGING_param.sort === "asc" ? 1 : -1;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.list.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );
  const listPlan = await repository.list.listPlan(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );

  const finalResult = await Promise.all(listPlan.map(async (plan) => {
    const dateStart = plan?.food_plan_dateStart;
    const dateEnd = plan?.food_plan_dateEnd;

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