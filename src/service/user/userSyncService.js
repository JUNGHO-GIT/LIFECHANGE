// userSyncService.js

import * as repository from "../../repository/user/userSyncRepository.js";

// 1-1. list ---------------------------------------------------------------------------------------
export const list = async (
  user_id_param, DATE_param
) => {

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

  // todo
  const initProperty = await repository.property.initProperty(
    user_id_param
  );
  const findMoney = await repository.property.findMoney(
    user_id_param
  );

  const curProperty
    = parseInt(initProperty?.user_initProperty)
    + parseInt(findMoney?.money_total_income)
    - parseInt(findMoney?.money_total_expense);

  const updateProperty = await repository.property.updateProperty(
    user_id_param, curProperty
  );

  if (updateProperty?.user_curProperty) {
    console.log(
      "property update result: "
      + JSON.stringify(updateProperty?.user_curProperty, null, 2)
    );
  }

  const finalResult = {
    initProperty: parseInt(initProperty?.user_initProperty),
    totalIncome: findMoney?.money_total_income,
    totalExpense: findMoney?.money_total_expense,
    curProperty: curProperty,
    dateStart: (initProperty?.user_regDt).toISOString().slice(0, 10),
    dateEnd: findMoney?.money_dateEnd,
  };

  return finalResult;
};