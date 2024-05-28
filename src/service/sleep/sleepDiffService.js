// sleepDiffService.js

import {strToDecimal, decimalToStr} from "../../assets/js/date.js";
import * as repository from "../../repository/sleep/sleepDiffRepository.js";

// 1. list (리스트는 gte lte) --------------------------------------------------------------------->
export const list = async (
  user_id_param, PAGING_param, DATE_param
) => {

  const dateType = DATE_param.dateType === "" ? "전체" : DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const sort = PAGING_param.order === "asc" ? 1 : -1;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.list.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );
  const listPlan = await repository.list.listPlan(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );

  const finalResult = await Promise.all(listPlan.map(async (plan) => {
    const dateStart = plan?.sleep_plan_dateStart;
    const dateEnd = plan?.sleep_plan_dateEnd;

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