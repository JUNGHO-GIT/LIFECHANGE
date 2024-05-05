// userPlanService.js

import * as repository from "../repository/userPlanRepository.js";
import {strToDecimal, decimalToStr} from "../assets/js/date.js";

// 1-1. percent ----------------------------------------------------------------------------------->
export const percent = async (
  user_id_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  // 1. exercise
  const listExercisePlan = await repository.percent.listExercisePlan(
    user_id_param, startDt_param, endDt_param
  );
  const listExerciseReal = await Promise.all(listExercisePlan.map(async (plan) => {
    const startDt = plan.exercise_plan_startDt;
    const endDt = plan.exercise_plan_endDt;

    const listReal = await repository.percent.listExercise(
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
      (curr.exercise_body_weight !== null && (acc === null || curr.exercise_body_weight < acc)) ? curr.exercise_body_weight : acc
    ), null);

    return {
      exercise_total_count: exerciseTotalCount,
      exercise_total_volume: exerciseTotalVolume,
      exercise_total_cardio: decimalToStr(exerciseTotalCardio),
      exercise_body_weight: exerciseLessWeight
    };
  }));

  // 2. food
  const listFoodPlan = await repository.percent.listFoodPlan(
    user_id_param, startDt_param, endDt_param
  );
  const listFoodReal = await Promise.all(listFoodPlan.map(async (plan) => {
    const startDt = plan.food_plan_startDt;
    const endDt = plan.food_plan_endDt;

    const listReal = await repository.percent.listFood(
      user_id_param, startDt, endDt
    );

    const foodTotalKcal = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_kcal ?? 0)
    ), 0);
    const foodTotalCarb = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_carb ?? 0)
    ), 0);
    const foodTotalProtein = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_protein ?? 0)
    ), 0);
    const foodTotalFat = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_fat ?? 0)
    ), 0);

    return {
      food_total_kcal: foodTotalKcal,
      food_total_carb: foodTotalCarb,
      food_total_protein: foodTotalProtein,
      food_total_fat: foodTotalFat
    };
  }));

  // 3. money
  const listMoneyPlan = await repository.percent.listMoneyPlan(
    user_id_param, startDt_param, endDt_param
  );
  const listMoneyReal = await Promise.all(listMoneyPlan.map(async (plan) => {
    const startDt = plan.money_plan_startDt;
    const endDt = plan.money_plan_endDt;

    const listReal = await repository.percent.listMoney(
      user_id_param, startDt, endDt
    );

    const moneyTotalIn = listReal.reduce((acc, curr) => (
      acc + (curr?.money_total_in ?? 0)
    ), 0);
    const moneyTotalOut = listReal.reduce((acc, curr) => (
      acc + (curr?.money_total_out ?? 0)
    ), 0);

    return {
      money_total_in: moneyTotalIn,
      money_total_out: moneyTotalOut
    };
  }));

  // 4. sleep
  const listSleepPlan = await repository.percent.listSleepPlan(
    user_id_param, startDt_param, endDt_param
  );
  const listSleepReal = await Promise.all(listSleepPlan.map(async (plan) => {
    const startDt = plan.sleep_plan_startDt;
    const endDt = plan.sleep_plan_endDt;

    const listReal = await repository.percent.listSleep(
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
      sleep_night: decimalToStr(sleepNight),
      sleep_morning: decimalToStr(sleepMorning),
      sleep_time: decimalToStr(sleepTime)
    };
  }));

  const finalResult = {
    exercisePlan: listExercisePlan[0],
    exercise: listExerciseReal[0],
    foodPlan: listFoodPlan[0],
    food: listFoodReal[0],
    moneyPlan: listMoneyPlan[0],
    money: listMoneyReal[0],
    sleepPlan: listSleepPlan[0],
    sleep: listSleepReal[0],
  };

  return finalResult;
};