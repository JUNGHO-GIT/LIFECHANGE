// sleepPlanService.js

import * as repository from "../repository/sleepPlanRepository.js";
import {compareTime, strToDecimal, decimalToStr} from "../assets/common/date.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  sleep_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDtPlan, endDtPlan] = sleep_plan_dur_param.split(` ~ `);

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
    const startDt = plan.sleep_plan_startDt;
    const endDt = plan.sleep_plan_endDt;

    const findReal = await repository.list.findReal(
      user_id_param, startDt, endDt
    );

    const sleepNight = findReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_night ?? "00:00")
    ), 0);
    const sleepMorning = findReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_morning ?? "00:00")
    ), 0);
    const sleepTime = findReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_time ?? "00:00")
    ), 0);

    console.log("findReal", findReal);
    console.log("sleepNight", sleepNight);
    console.log("sleepMorning", sleepMorning);
    console.log("sleepTime", sleepTime);

    return {
      ...plan,
      sleep_night: decimalToStr(sleepNight),
      sleep_morning: decimalToStr(sleepMorning),
      sleep_time: decimalToStr(sleepTime),
      sleep_diff_night: compareTime(
        plan.sleep_plan_night, decimalToStr(sleepNight)
      ),
      sleep_diff_morning: compareTime(
        plan.sleep_plan_morning, decimalToStr(sleepMorning)
      ),
      sleep_diff_time: compareTime(
        plan.sleep_plan_time, decimalToStr(sleepTime)
      )
    };
  }));

  return {
    totalCnt : totalCnt,
    result : finalResult
  }
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  sleep_plan_dur_param
) => {

  const [startDt, endDt] = sleep_plan_dur_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    _id_param, user_id_param, startDt, endDt
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  SLEEP_PLAN_param,
  sleep_plan_dur_param
) => {

  const [startDt, endDt] = sleep_plan_dur_param.split(` ~ `);

  const findPlan = await repository.save.detail(
    "", user_id_param, startDt, endDt
  );

  let finalResult = null;
  if (!findPlan) {
    finalResult = await repository.save.create(
      user_id_param, SLEEP_PLAN_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.save.update(
      findPlan._id, SLEEP_PLAN_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  sleep_plan_dur_param
) => {

  const [startDt, endDt] = sleep_plan_dur_param.split(` ~ `);

  const finalResult = await repository.deletes.deletes(
    _id_param, user_id_param, startDt, endDt
  );

  return finalResult
};