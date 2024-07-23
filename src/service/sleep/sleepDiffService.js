// sleepDiffService.js

import {strToDecimal, decimalToStr} from "../../assets/js/utils.js";
import * as repository from "../../repository/sleep/sleepDiffRepository.js";
import {log} from "../../assets/js/utils.js";

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = async (
  user_id_param, PAGING_param, DATE_param
) => {

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

  const finalResult = await Promise.all(listGoal.map(async (goal) => {
    const dateStart = goal?.sleep_goal_dateStart;
    const dateEnd = goal?.sleep_goal_dateEnd;

    const listReal = await repository.list.list (
      user_id_param, dateType, dateStart, dateEnd
    );

    const bedTime = listReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_bedTime)
    ), 0);
    const wakeTime = listReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_wakeTime)
    ), 0);
    const sleepTime = listReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_sleepTime)
    ), 0);

    return {
      ...goal,
      sleep_bedTime: decimalToStr(bedTime),
      sleep_wakeTime: decimalToStr(wakeTime),
      sleep_sleepTime: decimalToStr(sleepTime)
    };
  }));
  
  return {
    totalCnt : totalCnt,
    result : finalResult
  }
};