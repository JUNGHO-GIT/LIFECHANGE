// userSyncService.ts

import * as repository from "@repositories/user/userSyncRepository";
import { strToDecimal, decimalToStr } from "@scripts/utils";
import { timeToDecimal, decimalToTime } from "@scripts/utils";

// 0. category -------------------------------------------------------------------------------------
// 카테고리 조회
export const category = async (
  user_id_param: string
) => {

  // result 변수 선언
  let findCategory: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  findCategory = await repository.listCategory(
    user_id_param
  );

  if (!findCategory) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = findCategory;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 1. percent --------------------------------------------------------------------------------------
// 퍼센트 조회
export const percent = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findExerciseGoal: any = null;
  let findExercise: any = null;
  let findFoodGoal: any = null;
  let findFood: any = null;
  let findMoneyGoal: any = null;
  let findMoney: any = null;
  let findSleepGoal: any = null;
  let findSleep: any = null;

  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // date 변수 선언 (이번달 기간 계산)
  const dateStart = DATE_param.monthStart;
  const dateEnd = DATE_param.monthEnd;

  // 1-1. exerciseGoal
  findExerciseGoal = await repository.percent.listExerciseGoal(
    user_id_param, dateStart, dateEnd
  );

  // 1-2. exercise
  findExercise = await repository.percent.listExercise(
    user_id_param, dateStart, dateEnd
  );

  findExercise = findExercise.length > 0 && findExercise?.reduce((acc: any, curr: any) => {
    const exerciseTotalCount = (
      parseFloat(acc?.exercise_total_count) + parseFloat(curr?.exercise_total_count)
    );
    const exerciseTotalVolume = (
      parseFloat(acc?.exercise_total_volume) +  parseFloat(curr?.exercise_total_volume)
    );
    const exerciseTotalCardio = (
      timeToDecimal(acc?.exercise_total_cardio) + timeToDecimal(curr?.exercise_total_cardio)
    );
    const exerciseTotalWeight = (
      curr?.exercise_total_weight !== '0' ? curr?.exercise_total_weight : acc?.exercise_total_weight
    );
    return {
      exercise_total_count: String(exerciseTotalCount.toFixed(0)),
      exercise_total_volume: String(exerciseTotalVolume.toFixed(0)),
      exercise_total_cardio: String(decimalToTime(exerciseTotalCardio)),
      exercise_total_weight: String(exerciseTotalWeight),
    };
  });

  // 2-1. foodGoal
  findFoodGoal = await repository.percent.listFoodGoal(
    user_id_param, dateStart, dateEnd
  );

  // 2-2. food
  findFood = await repository.percent.listFood(
    user_id_param, dateStart, dateEnd
  );
  findFood = findFood.length > 0 && findFood?.reduce((acc: any, curr: any) => {
    const foodTotalKcal = (
      parseFloat(acc?.food_total_kcal) + parseFloat(curr?.food_total_kcal)
    );
    const foodTotalCarb = (
      parseFloat(acc?.food_total_carb) + parseFloat(curr?.food_total_carb)
    );
    const foodTotalProtein = (
      parseFloat(acc?.food_total_protein) + parseFloat(curr?.food_total_protein)
    );
    const foodTotalFat = (
      parseFloat(acc?.food_total_fat) + parseFloat(curr?.food_total_fat)
    );
    return {
      food_total_kcal: String(foodTotalKcal.toFixed(0)),
      food_total_carb: String(foodTotalCarb.toFixed(0)),
      food_total_protein: String(foodTotalProtein.toFixed(0)),
      food_total_fat: String(foodTotalFat.toFixed(0)),
    };
  });

  // 3-1. moneyGoal
  findMoneyGoal = await repository.percent.listMoneyGoal(
    user_id_param, dateStart, dateEnd
  );

  // 3-2. money
  findMoney = await repository.percent.listMoney(
    user_id_param, dateStart, dateEnd
  );
  findMoney = findMoney.length > 0 && findMoney?.reduce((acc: any, curr: any) => {
    const moneyTotalIncome = (
      parseFloat(acc?.money_total_income) + parseFloat(curr?.money_total_income)
    );
    const moneyTotalExpense = (
      parseFloat(acc?.money_total_expense) + parseFloat(curr?.money_total_expense)
    );
    return {
      money_total_income: String(moneyTotalIncome.toFixed(0)),
      money_total_expense: String(moneyTotalExpense.toFixed(0)),
    };
  });

  // 4-1. sleepGoal
  findSleepGoal = await repository.percent.listSleepGoal(
    user_id_param, dateStart, dateEnd
  );

  // 4-2. sleep
  findSleep = await repository.percent.listSleep(
    user_id_param, dateStart, dateEnd
  );
  const findSleepLength = findSleep?.length;
  findSleep = findSleep.length > 0 && findSleep?.reduce((acc: any, curr: any) => {
    const sleepBedTime = (
      timeToDecimal(acc?.sleep_bedTime) + timeToDecimal(curr?.sleep_bedTime)
    );
    const sleepWakeTime = (
      timeToDecimal(acc?.sleep_wakeTime) + timeToDecimal(curr?.sleep_wakeTime)
    );
    const sleepSleepTime = (
      timeToDecimal(acc?.sleep_sleepTime) + timeToDecimal(curr?.sleep_sleepTime)
    );
    return {
      sleep_bedTime: String(decimalToTime(sleepBedTime)),
      sleep_wakeTime: String(decimalToTime(sleepWakeTime)),
      sleep_sleepTime: String(decimalToTime(sleepSleepTime)),
    };
  });

  findResult = {
    exerciseGoal: findExerciseGoal[0],
    exercise: findExercise,
    foodGoal: findFoodGoal[0],
    food: findFood,
    moneyGoal: findMoneyGoal[0],
    money: findMoney,
    sleepGoal: findSleepGoal[0],
    sleep: {
      sleep_bedTime: decimalToTime(timeToDecimal(findSleep?.sleep_bedTime) / findSleepLength),
      sleep_wakeTime: decimalToTime(timeToDecimal(findSleep?.sleep_wakeTime) / findSleepLength),
      sleep_sleepTime: decimalToTime(timeToDecimal(findSleep?.sleep_sleepTime) / findSleepLength),
    },
  };

  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = findResult;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2. scale ----------------------------------------------------------------------------------------
// 체중 조회
export const scale = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findRegDt: any = null;
  let findInitScale: any = null;
  let findScaleMinMax: any = null;
  let findScaleCur: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // 가입날짜 ~ 현재날짜
  findRegDt = await repository.scale.findScaleRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  findInitScale = await repository.scale.findScaleInit(
    user_id_param
  );
  findScaleMinMax = await repository.scale.findScaleMinMax(
    user_id_param, regDt, todayDt
  );
  findScaleCur = await repository.scale.findScaleCur(
    user_id_param, regDt, todayDt
  );
  await repository.scale.updateScale(
    user_id_param, findScaleCur?.exercise_total_weight
  );

  if (!findInitScale && !findScaleMinMax && !findScaleCur) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    statusResult = "success";
    finalResult = {
      initScale: String (
        findInitScale?.user_initScale
        ? parseFloat(findInitScale?.user_initScale)
        : "0"
      ),
      minScale: String (
        findScaleMinMax?.scale_min
        ? parseFloat(findScaleMinMax?.scale_min)
        : "0"
      ),
      maxScale: String (
        findScaleMinMax?.scale_max
        ? parseFloat(findScaleMinMax?.scale_max)
        : "0"
      ),
      curScale: String (
        findScaleCur?.exercise_total_weight
        ? parseFloat(findScaleCur?.exercise_total_weight)
        : "0"
      ),
      dateStart: regDt,
      dateEnd: todayDt,
    };
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 3. favorite -------------------------------------------------------------------------------------
// 저장 음식 조회
export const favorite = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findRegDt: any = null;
  let findFavorite: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // 가입날짜 ~ 현재날짜
  findRegDt = await repository.favorite.findFavoriteRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  findFavorite = await repository.favorite.findFavorite(
    user_id_param
  );

  if (!findFavorite) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    statusResult = "success";
    finalResult = {
      foodFavorite: findFavorite,
      dateStart: regDt,
      dateEnd: todayDt,
    };
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 4. property -------------------------------------------------------------------------------------
// 자산 조회
export const property = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findRegDt: any = null;
  let findInitProperty: any = null;
  let findMoney: any = null;
  let finalResult: any = null;
  let curPropertyAll: string = "0";
  let curProperty: string = "0";
  let statusResult: string = "";

  // 가입날짜 ~ 현재날짜
  findRegDt = await repository.property.findPropertyRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  findInitProperty = await repository.property.findPropertyInit(
    user_id_param
  );
  findMoney = await repository.property.findPropertyMoney(
    user_id_param, regDt, todayDt
  );

  curPropertyAll = String (
    parseFloat(findInitProperty?.user_initProperty || "0") +
    parseFloat(findMoney?.curPropertyAllResult?.money_total_income || "0") -
    parseFloat(findMoney?.curPropertyAllResult?.money_total_expense || "0")
  );

  curProperty = String (
    parseFloat(findInitProperty?.user_initProperty || "0") +
    parseFloat(findMoney?.curPropertyResult?.money_total_income || "0") -
    parseFloat(findMoney?.curPropertyResult?.money_total_expense || "0")
  );

  await repository.property.updateProperty(
    user_id_param, curPropertyAll, curProperty
  );

  if (!findInitProperty && !findMoney) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    statusResult = "success";
    finalResult = {
      initProperty: String (
        findInitProperty?.user_initProperty
        ? parseFloat(findInitProperty?.user_initProperty)
        : "0"
      ),
      totalIncomeAll: String (
        findMoney?.curPropertyAllResult?.money_total_income
        ? parseFloat(findMoney?.curPropertyAllResult?.money_total_income)
        : "0"
      ),
      totalExpenseAll: String (
        findMoney?.curPropertyAllResult?.money_total_expense
        ? parseFloat(findMoney?.curPropertyAllResult?.money_total_expense)
        : "0"
      ),
      totalIncome: String (
        findMoney?.curPropertyResult?.money_total_income
        ? parseFloat(findMoney?.curPropertyResult?.money_total_income)
        : "0"
      ),
      totalExpense: String (
        findMoney?.curPropertyResult?.money_total_expense
        ? parseFloat(findMoney?.curPropertyResult?.money_total_expense)
        : "0"
      ),
      curPropertyAll: curPropertyAll,
      curProperty: curProperty,
      dateStart: regDt,
      dateEnd: todayDt,
    };
  }

  return {
    status: statusResult,
    result: finalResult
  };
};