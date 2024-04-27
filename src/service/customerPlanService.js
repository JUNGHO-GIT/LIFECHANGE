// customerPlanService.js

import * as repository from "../repository/customerPlanRepository.js";
import {strToDecimal, decimalToStr} from "../assets/common/date.js";

// 1-1. percent ----------------------------------------------------------------------------------->
export const percent = async (
  customer_id_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  // 1. exercise
  const findExercisePlan = await repository.percent.findExercisePlan(
    customer_id_param, startDt_param, endDt_param
  );
  const findExerciseReal = await Promise.all(findExercisePlan.map(async (plan) => {
    const startDt = plan.exercise_plan_startDt;
    const endDt = plan.exercise_plan_endDt;

    const findReal = await repository.percent.findExerciseReal(
      customer_id_param, startDt, endDt
    );

    const exerciseTotalCount = findReal.reduce((acc, curr) => (
      acc + (curr?.exercise_total_volume !== 1 ? 1 : 0)
    ), 0);
    const exerciseTotalVolume = findReal.reduce((acc, curr) => (
      acc + (curr?.exercise_total_volume ?? 0)
    ), 0);
    const exerciseTotalCardio = findReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.exercise_total_cardio ?? "00:00")
    ), 0);
    const exerciseLessWeight = findReal.reduce((acc, curr) => (
      (curr.exercise_body_weight !== null && (acc === null || curr.exercise_body_weight < acc)) ? curr.exercise_body_weight : acc
    ), null);

    return {
      ...plan,
      exercise_total_count: exerciseTotalCount,
      exercise_total_volume: exerciseTotalVolume,
      exercise_total_cardio: decimalToStr(exerciseTotalCardio),
      exercise_body_weight: exerciseLessWeight
    };
  }));

  // 2. food
  const findFoodPlan = await repository.percent.findFoodPlan(
    customer_id_param, startDt_param, endDt_param
  );
  const findFoodReal = await Promise.all(findFoodPlan.map(async (plan) => {
    const startDt = plan.food_plan_startDt;
    const endDt = plan.food_plan_endDt;

    const findReal = await repository.percent.findFoodReal(
      customer_id_param, startDt_param, endDt_param
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

  // 3. money
  const findMoneyPlan = await repository.percent.findMoneyPlan(
    customer_id_param, startDt_param, endDt_param
  );
  const findMoneyReal = await Promise.all(findMoneyPlan.map(async (plan) => {
    const startDt = plan.money_plan_startDt;
    const endDt = plan.money_plan_endDt;

    const findReal = await repository.percent.findMoneyReal(
      customer_id_param, startDt_param, endDt_param
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

  // 4. sleep
  const findSleepPlan = await repository.percent.findSleepPlan(
    customer_id_param, startDt_param, endDt_param
  );
  const findSleepReal = await Promise.all(findSleepPlan.map(async (plan) => {
    const startDt = plan.sleep_plan_startDt;
    const endDt = plan.sleep_plan_endDt;

    const findReal = await repository.percent.findSleepReal(
      customer_id_param, startDt_param, endDt_param
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

  return {
    exercisePlan: findExercisePlan[0] || {},
    exerciseReal: findExerciseReal[0] || {},
    foodPlan: findFoodPlan[0] || {},
    foodReal: findFoodReal[0] || {},
    moneyPlan: findMoneyPlan[0] || {},
    moneyReal: findMoneyReal[0] || {},
    sleepPlan: findSleepPlan[0] || {},
    sleepReal: findSleepReal[0] || {},
  };
};