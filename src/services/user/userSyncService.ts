// userSyncService.ts

import * as repository from "@repositories/user/userSyncRepository";

// 1. percent --------------------------------------------------------------------------------------
// 퍼센트 조회
export const percent = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findExerciseGoal: any = null;
  let findExercise: any = null;
  let findFoodGoal: any = null;
  let findFood: any = null;
  let findMoneyGoal: any = null;
  let findMoney: any = null;
  let findSleepGoal: any = null;
  let findSleep: any = null;
  let finalResult: any = null;

  // date 변수 선언
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  // 1. exercise
  findExerciseGoal = await repository.percent.listExerciseGoal(
    user_id_param, dateStart, dateEnd
  );
  findExercise = await repository.percent.listExercise(
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
  findFoodGoal = await repository.percent.listFoodGoal(
    user_id_param, dateStart, dateEnd
  );
  findFood = await repository.percent.listFood(
    user_id_param, dateStart, dateEnd
  );

  // 3. money
  findMoneyGoal = await repository.percent.listMoneyGoal(
    user_id_param, dateStart, dateEnd
  );
  findMoney = await repository.percent.listMoney(
    user_id_param, dateStart, dateEnd
  );

  // 4. sleep
  findSleepGoal = await repository.percent.listSleepGoal(
    user_id_param, dateStart, dateEnd
  );
  findSleep = await repository.percent.listSleep(
    user_id_param, dateStart, dateEnd
  );

  finalResult = {
    exerciseGoal: findExerciseGoal,
    exercise: findExercise,
    foodGoal: findFoodGoal,
    food: findFood,
    moneyGoal: findMoneyGoal,
    money: findMoney,
    sleepGoal: findSleepGoal,
    sleep: findSleep,
  };

  return finalResult;
};

// 2. property -------------------------------------------------------------------------------------
// 현재 재산 상태
export const property = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findRegDt: any = null;
  let findInitProperty: any = null;
  let findMoney: any = null;
  let finalResult: any = null;
  let curProperty: string = "0";

  // 가입날짜 ~ 현재날짜
  findRegDt = await repository.property.findRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  findInitProperty = await repository.property.initProperty(
    user_id_param
  );
  findMoney = await repository.property.findMoney(
    user_id_param, regDt, todayDt
  );
  curProperty = String (
    (parseFloat(findInitProperty?.user_initProperty) || 0) +
    (parseFloat(findMoney?.money_total_income) || 0) -
    (parseFloat(findMoney?.money_total_expense) || 0)
  );

  await repository.property.updateCurProperty(
    user_id_param, curProperty
  );

  finalResult = {
    totalIncome: String (
      findMoney?.money_total_income ? parseFloat(findMoney?.money_total_income) : 0
    ),
    totalExpense: String (
      findMoney?.money_total_expense ? parseFloat(findMoney?.money_total_expense) : 0
    ),
    initProperty: String (
      findInitProperty?.user_initProperty ? parseFloat(findInitProperty?.user_initProperty) : 0
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
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findRegDt: any = null;
  let findInitScale: any = null;
  let findScaleMinMax: any = null;
  let findScaleCur: any = null;
  let finalResult: any = null;

  // 가입날짜 ~ 현재날짜
  findRegDt = await repository.property.findRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  findInitScale = await repository.scale.initScale(
    user_id_param
  );
  findScaleMinMax = await repository.scale.findScaleMinMax(
    user_id_param, regDt, todayDt
  );
  findScaleCur = await repository.scale.findScaleCur(
    user_id_param, regDt, todayDt
  );

  await repository.scale.updateCurScale(
    user_id_param, findScaleCur?.exercise_total_weight
  );

  finalResult = {
    initScale: String (
      findInitScale?.user_initScale ? parseFloat(findInitScale?.user_initScale) : 0
    ),
    minScale: String (
      findScaleMinMax?.scale_min ? parseFloat(findScaleMinMax?.scale_min) : 0
    ),
    maxScale: String (
      findScaleMinMax?.scale_max ? parseFloat(findScaleMinMax?.scale_max) : 0
    ),
    curScale: String (
      findScaleCur?.exercise_total_weight ? parseFloat(findScaleCur?.exercise_total_weight) : 0
    ),
    dateStart: regDt,
    dateEnd: todayDt,
  };

  return finalResult;
};