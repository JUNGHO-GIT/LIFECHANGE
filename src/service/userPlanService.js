// userPlanService.js

import * as repository from "../repository/userPlanRepository.js";
import {strToDecimal, decimalToStr} from "../assets/common/date.js";

// 1-1. percent ----------------------------------------------------------------------------------->
export const percent = async (
  user_id_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const findFoodPlan = await repository.percent.findFoodPlan(
    user_id_param, startDt, endDt
  );
  const findFoodReal = await Promise.all(findFoodPlan.map(async (plan) => {
    const startDt = plan.food_plan_startDt;
    const endDt = plan.food_plan_endDt;

    const findReal = await repository.percent.findFoodReal(
      user_id_param, startDt, endDt
    );

    const foodTotalKcal = findReal.reduce((acc, curr) => (
      acc + (curr?.food_total_kcal ?? 0)
    ), 0);
    const foodTotalCarb = findReal.reduce((acc, curr) => (
      acc + (curr?.food_total_carb ?? 0)
    ), 0);
    const foodTotalProtein = findReal.reduce((acc, curr) => (
      acc + (curr?.food_total_protein ?? 0)
    ), 0);
    const foodTotalFat = findReal.reduce((acc, curr) => (
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

  const findMoneyPlan = await repository.percent.findMoneyPlan(
    user_id_param, startDt, endDt
  );
  const findMoneyReal = await Promise.all(findMoneyPlan.map(async (plan) => {
    const startDt = plan.money_plan_startDt;
    const endDt = plan.money_plan_endDt;

    const findReal = await repository.percent.findMoneyReal(
      user_id_param, startDt, endDt
    );

    const moneyTotalIn = findReal.reduce((acc, curr) => (
      acc + (curr?.money_total_in ?? 0)
    ), 0);
    const moneyTotalOut = findReal.reduce((acc, curr) => (
      acc + (curr?.money_total_out ?? 0)
    ), 0);

    return {
      ...plan,
      money_total_in: moneyTotalIn,
      money_total_out: moneyTotalOut
    };
  }));

  const findSleepPlan = await repository.percent.findSleepPlan(
    user_id_param, startDt, endDt
  );
  const findSleepReal = await Promise.all(findSleepPlan.map(async (plan) => {
    const startDt = plan.sleep_plan_startDt;
    const endDt = plan.sleep_plan_endDt;

    const findReal = await repository.percent.findSleepReal(
      user_id_param, startDt, endDt
    );

    const sleepNight = findReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_night)
    ), 0);
    const sleepMorning = findReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_morning)
    ), 0);
    const sleepTime = findReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.sleep_time)
    ), 0);

    return {
      ...plan,
      sleep_night: decimalToStr(sleepNight),
      sleep_morning: decimalToStr(sleepMorning),
      sleep_time: decimalToStr(sleepTime)
    };
  }));

  const findWorkPlan = await repository.percent.findWorkPlan(
    user_id_param, startDt, endDt
  );
  const findWorkReal = await Promise.all(findWorkPlan.map(async (plan) => {
    const startDt = plan.work_plan_startDt;
    const endDt = plan.work_plan_endDt;

    const findReal = await repository.percent.findWorkReal(
      user_id_param, startDt, endDt
    );

    const workTotalCount = findReal.reduce((acc, curr) => (
      acc + (curr?.work_total_volume !== 1 ? 1 : 0)
    ), 0);
    const workTotalVolume = findReal.reduce((acc, curr) => (
      acc + (curr?.work_total_volume ?? 0)
    ), 0);
    const workTotalCardio = findReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.work_total_cardio ?? "00:00")
    ), 0);
    const workLessWeight = findReal.reduce((acc, curr) => (
      (curr.work_body_weight !== null && (acc === null || curr.work_body_weight < acc)) ? curr.work_body_weight : acc
    ), null);

    return {
      ...plan,
      work_total_count: workTotalCount,
      work_total_volume: workTotalVolume,
      work_total_cardio: decimalToStr(workTotalCardio),
      work_body_weight: workLessWeight
    };
  }));

  return {
    foodPlan: findFoodPlan[0] || {},
    foodReal: findFoodReal[0] || {},
    moneyPlan: findMoneyPlan[0] || {},
    moneyReal: findMoneyReal[0] || {},
    sleepPlan: findSleepPlan[0] || {},
    sleepReal: findSleepReal[0] || {},
    workPlan: findWorkPlan[0] || {},
    workReal: findWorkReal[0] || {},
  };
};