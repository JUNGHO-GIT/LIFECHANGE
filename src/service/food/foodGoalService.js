// foodGoalService.js

import * as repository from "../../repository/food/foodGoalRepository.js";
import {log} from "../../assets/js/utils.js";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const findResult = await repository.exist.exist(
    user_id_param, dateType, dateStart, dateEnd
  );

  // sort by date 날짜 순으로 정렬
  const finalResult = findResult[0]?.existDate?.sort((a, b) => {
    return a > b ? 1 : a < b ? -1 : 0;
  });

  return finalResult;
};

// 1-1. list ---------------------------------------------------------------------------------------
export const list = async (
  user_id_param, PAGING_param, DATE_param
) => {

  const dateTypeOrder = ["day", "week", "month", "year"];
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const sort = PAGING_param.sort === "asc" ? 1 : -1;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.list.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );
  const listGoal = await repository.list.listGoal(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );

  listGoal.sort((a, b) => {
    const dateTypeA = a.food_goal_dateType;
    const dateTypeB = b.food_goal_dateType;
    const dateStartA = new Date(a.food_goal_dateStart);
    const dateStartB = new Date(b.food_goal_dateStart);
    const sortOrder = sort;

    const dateTypeDiff = dateTypeOrder.indexOf(dateTypeA) - dateTypeOrder.indexOf(dateTypeB);
    const dateDiff = dateStartA.getTime() - dateStartB.getTime();

    if (dateTypeDiff !== 0) {
      return dateTypeDiff;
    }
    return sortOrder === 1 ? dateDiff : -dateDiff;
  });

  const finalResult = await Promise.all(listGoal.map(async (goal) => {
    const dateStart = goal?.food_goal_dateStart;
    const dateEnd = goal?.food_goal_dateEnd;

    const listReal = await repository.list.listReal(
      user_id_param, dateType, dateStart, dateEnd
    );

    const foodTotalKcal = listReal.reduce((acc, curr) => (
      acc + (parseFloat(curr?.food_total_kcal) ?? 0)
    ), 0);
    const foodTotalCarb = listReal.reduce((acc, curr) => (
      acc + (parseFloat(curr?.food_total_carb) ?? 0)
    ), 0);
    const foodTotalProtein = listReal.reduce((acc, curr) => (
      acc + (parseFloat(curr?.food_total_protein) ?? 0)
    ), 0);
    const foodTotalFat = listReal.reduce((acc, curr) => (
      acc + (parseFloat(curr?.food_total_fat) ?? 0)
    ), 0);

    return {
      ...goal,
      food_total_kcal: String(foodTotalKcal),
      food_total_carb: String(foodTotalCarb),
      food_total_protein: String(foodTotalProtein),
      food_total_fat: String(foodTotalFat),
    };
  }));

  return {
    totalCnt : totalCnt,
    result : finalResult
  }
};

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
export const detail = async (
  user_id_param, _id_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const finalResult = await repository.detail.detail(
    user_id_param, _id_param, dateType, dateStart, dateEnd
  );

  const sectionCnt = finalResult ? 1 : 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save -----------------------------------------------------------------------------------------
export const save = async (
  user_id_param, OBJECT_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const findResult = await repository.save.detail(
    user_id_param, "", dateType, dateStart, dateEnd
  );

  let finalResult = null;
  if (!findResult) {
    finalResult = await repository.save.create(
      user_id_param, OBJECT_param, dateType, dateStart, dateEnd
    );
  }
  else {
    finalResult = await repository.save.update(
      user_id_param, findResult._id, OBJECT_param, dateType, dateStart, dateEnd
    );
  }

  return finalResult
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param, _id_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const findResult = await repository.deletes.detail(
    user_id_param, _id_param, dateType, dateStart, dateEnd
  );

  if (!findResult) {
    return null;
  }
  else {
    await repository.deletes.deletes(
      user_id_param, _id_param
    );
    return "deleted";
  }
}