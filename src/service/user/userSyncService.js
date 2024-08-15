// userSyncService.js

import * as repository from "../../repository/user/userSyncRepository.js";

// 1. percent --------------------------------------------------------------------------------------
// 퍼센트 조회
export const percent = async (
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
    if (
      parseFloat(result?.exercise_total_volume) <= 1 &&
      result?.exercise_total_cardio === "00:00"
    ) {
      return {
        ...result,
        exercise_total_count: ""
      };
    }
    else {
      return {
        ...result,
        exercise_total_count: "1"
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
  user_id_param, DATE_param
) => {

  // 가입날짜 ~ 현재날짜
  const findRegDt = await repository.property.findRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  const initProperty = await repository.property.initProperty(
    user_id_param
  );
  const findMoney = await repository.property.findMoney(
    user_id_param, regDt, todayDt
  );

  const curProperty = String (
    (parseInt(initProperty?.user_initProperty) || 0) +
    (parseInt(findMoney?.money_total_income) || 0) -
    (parseInt(findMoney?.money_total_expense) || 0)
  );

  await repository.property.updateCurProperty(
    user_id_param, curProperty
  );

  const finalResult = {
    totalIncome: String (
      findMoney?.money_total_income ? parseInt(findMoney?.money_total_income) : 0
    ),
    totalExpense: String (
      findMoney?.money_total_expense ? parseInt(findMoney?.money_total_expense) : 0
    ),
    initProperty: String (
      initProperty?.user_initProperty ? parseInt(initProperty?.user_initProperty) : 0
    ),
    curProperty: curProperty,
    dateStart: regDt,
    dateEnd: todayDt,
  };

  return finalResult;
};

// 3. scale ----------------------------------------------------------------------------------------
// 체중 조회
export const scale = async (
  user_id_param, DATE_param
) => {

  // 가입날짜 ~ 현재날짜
  const findRegDt = await repository.property.findRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  const initScale = await repository.scale.initScale(
    user_id_param
  );
  const findScaleMinMax = await repository.scale.findScaleMinMax(
    user_id_param, regDt, todayDt
  );
  const findScaleCur = await repository.scale.findScaleCur(
    user_id_param, regDt, todayDt
  );

  await repository.scale.updateCurScale(
    user_id_param, findScaleCur?.exercise_body_weight
  );

  const finalResult = {
    initScale: String (
      initScale?.user_initScale ? parseInt(initScale?.user_initScale) : 0
    ),
    minScale: String (
      findScaleMinMax?.scale_min ? parseInt(findScaleMinMax?.scale_min) : 0
    ),
    maxScale: String (
      findScaleMinMax?.scale_max ? parseInt(findScaleMinMax?.scale_max) : 0
    ),
    curScale: String (
      findScaleCur?.exercise_body_weight ? parseInt(findScaleCur?.exercise_body_weight) : 0
    ),
    dateStart: regDt,
    dateEnd: todayDt,
  };

  return finalResult;
};