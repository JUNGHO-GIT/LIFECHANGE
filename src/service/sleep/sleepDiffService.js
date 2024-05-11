// sleepDiffService.js

import {strToDecimal, decimalToStr} from "../../assets/js/date.js";
import * as repository from "../../repository/sleep/sleepDiffRepository.js";

// 1. diff ---------------------------------------------------------------------------------------->
export const diff = async (
  user_id_param, FILTER_param, PAGING_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split("~");

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = PAGING_param.limit === 0 ? 5 : PAGING_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const listPlan = await repository.diff.listPlan(
    user_id_param, sort, limit, page, startDt_param, endDt_param
  );

  const finalResult = await Promise.all(listPlan.map(async (plan) => {
    const startDt = plan.sleep_plan_startDt;
    const endDt = plan.sleep_plan_endDt;

    const listReal = await repository.diff.list (
      user_id_param, startDt, endDt
    );

    const sleepNight = listReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_night)
    ), 0);
    const sleepMorning = listReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_morning)
    ), 0);
    const sleepTime = listReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_time)
    ), 0);

    return {
      ...plan,
      sleep_night: decimalToStr(sleepNight),
      sleep_morning: decimalToStr(sleepMorning),
      sleep_time: decimalToStr(sleepTime)
    };
  }));

  console.log("===================================");
  console.log("finalResult: ", JSON.stringify(finalResult, null, 2));
  console.log("===================================");

  return finalResult;
};