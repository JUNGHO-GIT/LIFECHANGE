// sleepPlanService.js

import {compareTime, strToDecimal, decimalToStr} from "../assets/js/date.js";
import * as repository from "../repository/sleepPlanRepository.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  customer_id_param, FILTER_param, PAGING_param, duration_param
) => {

  const [startDtPlan, endDtPlan] = duration_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.list.cnt(
    customer_id_param, startDtPlan, endDtPlan
  );
  const listPlan = await repository.list.listPlan(
    customer_id_param, sort, limit, page, startDtPlan, endDtPlan
  );

  const finalResult = await Promise.all(listPlan.map(async (plan) => {
    const startDt = plan.sleep_plan_startDt;
    const endDt = plan.sleep_plan_endDt;

    const listReal = await repository.list.list (
      customer_id_param, startDt, endDt
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

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  customer_id_param, _id_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    customer_id_param, _id_param, startDt_param, endDt_param
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  customer_id_param, OBJECT_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const listPlan = await repository.save.detail(
    customer_id_param, "", startDt_param, endDt_param
  );

  let finalResult = null;
  if (!listPlan) {
    finalResult = await repository.save.create(
      customer_id_param, OBJECT_param, startDt_param, endDt_param
    );
  }
  else {
    finalResult = await repository.save.update(
      customer_id_param, listPlan._id, OBJECT_param, startDt_param, endDt_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  customer_id_param, _id_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const findResult = await repository.deletes.detail(
    customer_id_param, _id_param, startDt_param, endDt_param
  );

  if (!findResult) {
    return null;
  }
  else {
    await repository.deletes.deletes(
      customer_id_param, _id_param
    );
    return "deleted";
  }
}