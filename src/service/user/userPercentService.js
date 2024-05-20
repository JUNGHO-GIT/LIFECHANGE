// userPercentService.js

import * as repository from "../../repository/user/userPercentRepository.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param, duration_param
) => {

  const [dateStart, dateEnd] = duration_param.split(` ~ `);

  // 1. exercise
  const listExercisePlan = await repository.percent.listExercisePlan(
    user_id_param, dateStart, dateEnd
  );
  const listExercise = await repository.percent.listExercise(
    user_id_param, dateStart, dateEnd
  )
  .then((result) => {
    if (result?.exercise_total_volume <= 1 && result?.exercise_total_cardio === "00:00") {
      return {
        ...result,
        exercise_total_count: 0
      };
    }
    else {
      return {
        ...result,
        exercise_total_count: 1
      };
    }
  });

  // 2. food
  const listFoodPlan = await repository.percent.listFoodPlan(
    user_id_param, dateStart, dateEnd
  );
  const listFood = await repository.percent.listFood(
    user_id_param, dateStart, dateEnd
  );

  // 3. money
  const listMoneyPlan = await repository.percent.listMoneyPlan(
    user_id_param, dateStart, dateEnd
  );
  const listMoney = await repository.percent.listMoney(
    user_id_param, dateStart, dateEnd
  );

  // 4. sleep
  const listSleepPlan = await repository.percent.listSleepPlan(
    user_id_param, dateStart, dateEnd
  );
  const listSleep = await repository.percent.listSleep(
    user_id_param, dateStart, dateEnd
  );

  const finalResult = {
    exercisePlan: listExercisePlan,
    exercise: listExercise,
    foodPlan: listFoodPlan,
    food: listFood,
    moneyPlan: listMoneyPlan,
    money: listMoney,
    sleepPlan: listSleepPlan,
    sleep: listSleep,
  };

  return finalResult;
};


// 2. property ------------------------------------------------------------------------------------>
// 현재 재산 상태
export const property = async (
  user_id_param
) => {

  const findResult = await repository.property.listMoney(
    user_id_param
  );
  const finalResult = {
    totalIn: findResult?.money_total_in,
    totalOut: findResult?.money_total_out,
    totalProperty: findResult?.money_total_in - findResult?.money_total_out,
    date_start: findResult?.property_date_start,
    date_end: findResult?.property_date_end,
  };

  return finalResult;
};