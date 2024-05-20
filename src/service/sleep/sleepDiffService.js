// sleepDiffService.js

import {strToDecimal, decimalToStr} from "../../assets/js/date.js";
import * as repository from "../../repository/sleep/sleepDiffRepository.js";

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
    const dateStart = plan.sleep_plan_date_start;
    const dateEnd = plan.sleep_plan_date_end;

    const listReal = await repository.list.list (
      user_id_param, dateType, dateStart, dateEnd
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

  return {
    totalCnt : totalCnt,
    result : finalResult
  }
};