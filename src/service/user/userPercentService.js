// userPercentService.js

import * as repository from "../../repository/user/userPercentRepository.js";

// 1-1. list ---------------------------------------------------------------------------------------
export const list = async (
  user_id_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  // 1. exercise
  const listExerciseGoal = await repository.percent.listExerciseGoal(
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
  const listFoodGoal = await repository.percent.listFoodGoal(
    user_id_param, dateStart, dateEnd
  );
  const listFood = await repository.percent.listFood(
    user_id_param, dateStart, dateEnd
  );

  // 3. money
  const listMoneyGoal = await repository.percent.listMoneyGoal(
    user_id_param, dateStart, dateEnd
  );
  const listMoney = await repository.percent.listMoney(
    user_id_param, dateStart, dateEnd
  );

  // 4. sleep
  const listSleepGoal = await repository.percent.listSleepGoal(
    user_id_param, dateStart, dateEnd
  );
  const listSleep = await repository.percent.listSleep(
    user_id_param, dateStart, dateEnd
  );

  const finalResult = {
    exerciseGoal: listExerciseGoal,
    exercise: listExercise,
    foodGoal: listFoodGoal,
    food: listFood,
    moneyGoal: listMoneyGoal,
    money: listMoney,
    sleepGoal: listSleepGoal,
    sleep: listSleep,
  };

  return finalResult;
};


// 2. property -------------------------------------------------------------------------------------
// 현재 재산 상태
export const property = async (
  user_id_param
) => {

  const findResult = await repository.property.listMoney(
    user_id_param
  );
  const finalResult = {
    totalIncome: findResult?.money_total_income,
    totalExpense: findResult?.money_total_expense,
    totalProperty: findResult?.money_total_income - findResult?.money_total_expense,
    dateStart: findResult?.property_dateStart,
    dateEnd: findResult?.property_dateEnd,
  };

  return finalResult;
};