// exerciseDiffService.js

import * as repository from "../../repository/exercise/exerciseDiffRepository.js";
import {strToDecimal, decimalToStr} from "../../assets/js/date.js";

// 1. diff ---------------------------------------------------------------------------------------->
export const diff = async (
  user_id_param, FILTER_param, PAGING_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = PAGING_param.limit === 0 ? 5 : PAGING_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.diff.cnt(
    user_id_param, startDt_param, endDt_param
  );

  const listPlan = await repository.diff.listPlan(
    user_id_param, sort, limit, page, startDt_param, endDt_param
  );

  const finalResult = await Promise.all(listPlan.map(async (plan) => {
    const startDt = plan.exercise_plan_startDt;
    const endDt = plan.exercise_plan_endDt;

    const listReal = await repository.diff.list (
      user_id_param, startDt, endDt
    );

    const exerciseTotalCount = listReal.reduce((acc, curr) => (
      acc + (curr?.exercise_total_volume !== 1 ? 1 : 0)
    ), 0);
    const exerciseTotalVolume = listReal.reduce((acc, curr) => (
      acc + (curr?.exercise_total_volume ?? 0)
    ), 0);
    const exerciseTotalCardio = listReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.exercise_total_cardio ?? "00:00")
    ), 0);
    const exerciseLessWeight = listReal.reduce((acc, curr) => (
      (curr.exercise_body_weight !== null && (
        acc === null || curr.exercise_body_weight < acc
      )) ? curr.exercise_body_weight : acc
    ), null);

    return {
      ...plan,
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