// exerciseDiffService.js

import * as repository from "../../repository/exercise/exerciseDiffRepository.js";
import {strToDecimal, decimalToStr} from "../../assets/js/utils.js";

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
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
    const dateTypeA = a.exercise_goal_dateType;
    const dateTypeB = b.exercise_goal_dateType;
    const dateStartA = new Date(a.exercise_goal_dateStart);
    const dateStartB = new Date(b.exercise_goal_dateStart);
    const sortOrder = sort;

    const dateTypeDiff = dateTypeOrder.indexOf(dateTypeA) - dateTypeOrder.indexOf(dateTypeB);
    const dateDiff = dateStartA.getTime() - dateStartB.getTime();

    if (dateTypeDiff !== 0) {
      return dateTypeDiff;
    }
    return sortOrder === 1 ? dateDiff : -dateDiff;
  });

  const finalResult = await Promise.all(listGoal.map(async (goal) => {
    const dateStart = goal?.exercise_goal_dateStart;
    const dateEnd = goal?.exercise_goal_dateEnd;

    const listReal = await repository.list.list (
      user_id_param, dateType, dateStart, dateEnd
    );

    const exerciseTotalCount = listReal.reduce((acc, curr) => (
      acc + (curr?.exercise_total_volume === "0" ? 0 : 1)
    ), 0);
    const exerciseTotalVolume = listReal.reduce((acc, curr) => (
      acc + (curr?.exercise_total_volume ?? 0)
    ), 0);
    const exerciseTotalCardio = listReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.exercise_total_cardio ?? "00:00")
    ), 0);

    // 기간중 가장 작은 값을 찾는다.
    const exerciseLessWeight = Math.min(...listReal.map((real) => (
      real?.exercise_body_weight ?? 0
    ))
    .filter((weight) => (
      weight >= 10
    )));

    return {
      ...goal,
      exercise_total_count: exerciseTotalCount,
      exercise_total_volume: exerciseTotalVolume,
      exercise_total_cardio: decimalToStr(exerciseTotalCardio),
      exercise_body_weight: exerciseLessWeight
    };
  }));

  return {
    totalCnt : totalCnt,
    result : finalResult
  }
};