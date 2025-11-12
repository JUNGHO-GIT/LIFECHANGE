// userSyncService.ts

import * as repository from "@repositories/user/UserSyncRepository";
import { timeToDecimal, decimalToTime } from "@assets/scripts/utils";

// 0. category (카테고리 조회) ---------------------------------------------------------------------
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

// 1. percent (퍼센트 조회) ------------------------------------------------------------------------
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

  findExercise = findExercise?.length > 0 && findExercise?.reduce((acc: any, curr: any) => {
    const exerciseTotalCount = (
      parseFloat(acc?.exercise_record_total_count) + parseFloat(curr?.exercise_record_total_count)
    );
    const exerciseTotalVolume = (
      parseFloat(acc?.exercise_record_total_volume) +  parseFloat(curr?.exercise_record_total_volume)
    );
    const exerciseTotalCardio = (
  timeToDecimal(acc?.exercise_record_total_cardio) + timeToDecimal(curr?.exercise_record_total_cardio)
    );
    const exerciseTotalScale = (
      curr?.exercise_record_total_scale !== '0' ? curr?.exercise_record_total_scale : acc?.exercise_record_total_scale
    );
    return {
      exercise_record_total_count: String(exerciseTotalCount),
      exercise_record_total_volume: String(exerciseTotalVolume),
  exercise_record_total_cardio: String(decimalToTime(exerciseTotalCardio)),
      exercise_record_total_scale: String(exerciseTotalScale),
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
  findFood = findFood?.length > 0 && findFood?.reduce((acc: any, curr: any) => {
    const foodTotalKcal = (
      parseFloat(acc?.food_record_total_kcal) + parseFloat(curr?.food_record_total_kcal)
    );
    const foodTotalCarb = (
      parseFloat(acc?.food_record_total_carb) + parseFloat(curr?.food_record_total_carb)
    );
    const foodTotalProtein = (
      parseFloat(acc?.food_record_total_protein) + parseFloat(curr?.food_record_total_protein)
    );
    const foodTotalFat = (
      parseFloat(acc?.food_record_total_fat) + parseFloat(curr?.food_record_total_fat)
    );
    return {
      food_record_total_kcal: String(foodTotalKcal),
      food_record_total_carb: String(foodTotalCarb),
      food_record_total_protein: String(foodTotalProtein),
      food_record_total_fat: String(foodTotalFat),
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
  findMoney = findMoney?.length > 0 && findMoney?.reduce((acc: any, curr: any) => {
    const moneyTotalIncome = (
      parseFloat(acc?.money_record_total_income) + parseFloat(curr?.money_record_total_income)
    );
    const moneyTotalExpense = (
      parseFloat(acc?.money_record_total_expense) + parseFloat(curr?.money_record_total_expense)
    );
    return {
      money_record_total_income: String(moneyTotalIncome),
      money_record_total_expense: String(moneyTotalExpense),
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

  // aggregate across all sections (support multi-section records)
  let totalBedDecimal = 0;
  let totalWakeDecimal = 0;
  let totalSleepDecimal = 0;
  let totalBedCount = 0;
  let totalWakeCount = 0;
  let totalSleepCount = 0;

  (findSleep || []).forEach((doc: any) => {
    const bedArr = Array.isArray(doc?.sleep_record_bedTime) ? doc.sleep_record_bedTime : (doc?.sleep_record_bedTime ? [doc.sleep_record_bedTime] : []);
    const wakeArr = Array.isArray(doc?.sleep_record_wakeTime) ? doc.sleep_record_wakeTime : (doc?.sleep_record_wakeTime ? [doc.sleep_record_wakeTime] : []);
    const sleepArr = Array.isArray(doc?.sleep_record_sleepTime) ? doc.sleep_record_sleepTime : (doc?.sleep_record_sleepTime ? [doc.sleep_record_sleepTime] : []);

    bedArr.forEach((val: any) => {
  totalBedDecimal += timeToDecimal(val || "00:00");
      totalBedCount++;
    });
    wakeArr.forEach((val: any) => {
  totalWakeDecimal += timeToDecimal(val || "00:00");
      totalWakeCount++;
    });
    sleepArr.forEach((val: any) => {
  totalSleepDecimal += timeToDecimal(val || "00:00");
      totalSleepCount++;
    });
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
  sleep_record_bedTime: decimalToTime(totalBedDecimal / (totalBedCount || 1)),
  sleep_record_wakeTime: decimalToTime(totalWakeDecimal / (totalWakeCount || 1)),
  sleep_record_sleepTime: decimalToTime(totalSleepDecimal / (totalSleepCount || 1)),
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

// 2. scale (체중 조회) ----------------------------------------------------------------------------
export const scale = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findRegDt: any = null;
  let findInitScale: any = null;

  let initScale: any = null;
  let minScale: any = null;
  let maxScale: any = null;
  let curScale: any = null;

  let finalResult: any = null;
  let statusResult: string = "";

  // 가입날짜 - 현재날짜
  findRegDt = await repository.scale.findRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = findRegDt?.user_regDt && findRegDt?.user_regDt.toISOString().slice(0, 10);
  const todayDt = DATE_param?.dateEnd;

  // 최초 체중 조회
  findInitScale = await repository.scale.findInitScale(
    user_id_param
  );
  // 최소 체중 조회
  minScale = await repository.scale.findMinScale(
    user_id_param, regDt, todayDt
  );
  // 최대 체중 조회
  maxScale = await repository.scale.findMaxScale(
    user_id_param, regDt, todayDt
  );
  // 현재 체중 조회
  curScale = await repository.scale.findCurScale(
    user_id_param, regDt, todayDt
  );

  // 형식 포맷
  initScale = String (parseFloat(findInitScale?.user_initScale || "0"));
  minScale = String (parseFloat(minScale?.minScale || "0"));
  maxScale = String (parseFloat(maxScale?.maxScale || "0"));
  curScale = String (parseFloat(curScale?.exercise_record_total_scale || "0"));

  if (!findInitScale && !minScale && !maxScale && !curScale) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = {
      initScale: initScale,
      minScale: minScale,
      maxScale: maxScale,
      curScale: curScale,
      dateStart: regDt,
      dateEnd: todayDt,
    };
    statusResult = "success";
  }

  // 체중 업데이트
  await repository.scale.updateScale(
    user_id_param, initScale, minScale, maxScale, curScale
  );

  return {
    status: statusResult,
    result: finalResult
  };
};

// 3-1. nutrition (영양소 조회) --------------------------------------------------------------------
export const nutrition = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findRegDt: any = null;
  let findTotalCnt: any = null;
  let findInitNutrition: any = null;
  let findAllInformation: any = null;

  let initAvgKcalIntake: any = null;
  let totalKcalIntake: any = null;
  let totalCarbIntake: any = null;
  let totalProteinIntake: any = null;
  let totalFatIntake: any = null;

  let curAvgKcalIntake: any = null;
  let curAvgCarbIntake: any = null;
  let curAvgProteinIntake: any = null;
  let curAvgFatIntake: any = null;

  let finalResult: any = null;
  let statusResult: string = "";

  // 가입날짜 - 현재날짜
  findRegDt = await repository.nutrition.findRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = findRegDt?.user_regDt && findRegDt?.user_regDt.toISOString().slice(0, 10);
  const todayDt = DATE_param?.dateEnd;

  // 데이터 총 개수 조회
  findTotalCnt = await repository.nutrition.findTotalCnt(
    user_id_param, regDt, todayDt
  );
  // 최초 칼로리 목표 조회
  findInitNutrition = await repository.nutrition.findInitNutrition(
    user_id_param
  );
  // 전체 영양 정보 조회
  findAllInformation = await repository.nutrition.findAllInformation(
    user_id_param, regDt, todayDt
  );

  // 형식 포맷
  initAvgKcalIntake = String (
    parseFloat(findInitNutrition?.user_initAvgKcalIntake || "0").toFixed(0)
  );
  totalKcalIntake = String (
    parseFloat(findAllInformation?.food_record_total_kcal || "0").toFixed(0)
  );
  totalCarbIntake = String (
    parseFloat(findAllInformation?.food_record_total_carb || "0").toFixed(0)
  );
  totalProteinIntake = String (
    parseFloat(findAllInformation?.food_record_total_protein || "0").toFixed(0)
  );
  totalFatIntake = String (
    parseFloat(findAllInformation?.food_record_total_fat || "0").toFixed(0)
  );
  curAvgKcalIntake = String(
    (parseFloat(totalKcalIntake || "0") / (findTotalCnt || 1)).toFixed(0)
  );
  curAvgCarbIntake = String(
    (parseFloat(totalCarbIntake || "0") / (findTotalCnt || 1)).toFixed(0)
  );
  curAvgProteinIntake = String(
    (parseFloat(totalProteinIntake || "0") / (findTotalCnt || 1)).toFixed(0)
  );
  curAvgFatIntake = String(
    (parseFloat(totalFatIntake || "0") / (findTotalCnt || 1)).toFixed(0)
  );

  if (!findInitNutrition && !findAllInformation) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = {
      initAvgKcalIntake: initAvgKcalIntake,
      totalKcalIntake: totalKcalIntake,
      totalCarbIntake: totalCarbIntake,
      totalProteinIntake: totalProteinIntake,
      totalFatIntake: totalFatIntake,
      curAvgKcalIntake: curAvgKcalIntake,
      curAvgCarbIntake: curAvgCarbIntake,
      curAvgProteinIntake: curAvgProteinIntake,
      curAvgFatIntake: curAvgFatIntake,
      dateStart: regDt,
      dateEnd: todayDt,
    };
    statusResult = "success";
  }

  // 영양소 업데이트
  await repository.nutrition.updateNutrition(
    user_id_param, initAvgKcalIntake, totalKcalIntake, totalCarbIntake, totalProteinIntake, totalFatIntake, curAvgKcalIntake, curAvgCarbIntake, curAvgProteinIntake, curAvgFatIntake
  );

  return {
    status: statusResult,
    result: finalResult
  };
};

// 3-2. favorite (저장 음식 조회) ------------------------------------------------------------------
export const favorite = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findRegDt: any = null;
  let findFavorite: any = null;

  let finalResult: any = null;
  let statusResult: string = "";

  // 가입날짜 - 현재날짜
  findRegDt = await repository.favorite.findRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = findRegDt?.user_regDt && findRegDt?.user_regDt.toISOString().slice(0, 10);
  const todayDt = DATE_param?.dateEnd;

  // 저장 음식 조회
  findFavorite = await repository.favorite.findFavorite(
    user_id_param
  );

  if (!findFavorite) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = {
      foodFavorite: findFavorite,
      dateStart: regDt,
      dateEnd: todayDt,
    };
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 4. property (자산 조회) -------------------------------------------------------------------------
export const property = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findRegDt: any = null;
  let findInitProperty: any = null;
  let findAllInformation: any = null;

  let initProperty: any = null;
  let totalIncomeAll: any = null;
  let totalExpenseAll: any = null;
  let totalIncomeExclusion: any = null;
  let totalExpenseExclusion: any = null;
  let curPropertyAll: any = null;
  let curPropertyExclusion: any = null;

  let finalResult: any = null;
  let statusResult: string = "";

  // 가입날짜 - 현재날짜
  findRegDt = await repository.property.findRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = findRegDt?.user_regDt && findRegDt?.user_regDt.toISOString().slice(0, 10);
  const todayDt = DATE_param?.dateEnd;

  // 최초 자산 조회
  findInitProperty = await repository.property.findInitProperty(
    user_id_param
  );

  // 전체 자산 정보 조회
  findAllInformation = await repository.property.findAllInformation(
    user_id_param, regDt, todayDt
  );

  // 형식 포맷
  initProperty = String (
    parseFloat(findInitProperty?.user_initProperty || "0")
  );
  totalIncomeAll = String(
    parseFloat(findAllInformation?.allResult?.money_record_total_income || "0")
  );
  totalExpenseAll = String(
    parseFloat(findAllInformation?.allResult?.money_record_total_expense || "0")
  );
  totalIncomeExclusion = String(
    parseFloat(findAllInformation?.exclusionResult?.money_record_total_income || "0")
  );
  totalExpenseExclusion = String(
    parseFloat(findAllInformation?.exclusionResult?.money_record_total_expense || "0")
  );
  curPropertyAll = String (
    parseFloat(findInitProperty?.user_initProperty || "0") +
    parseFloat(totalIncomeAll) -
    parseFloat(totalExpenseAll)
  );
  curPropertyExclusion = String (
    parseFloat(findInitProperty?.user_initProperty || "0") +
    parseFloat(totalIncomeExclusion) -
    parseFloat(totalExpenseExclusion)
  );

  if (!findInitProperty && !findAllInformation) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    statusResult = "success";
    finalResult = {
      initProperty: initProperty,
      totalIncomeAll: totalIncomeAll,
      totalIncomeExclusion: totalIncomeExclusion,
      totalExpenseAll: totalExpenseAll,
      totalExpenseExclusion: totalExpenseExclusion,
      curPropertyAll: curPropertyAll,
      curPropertyExclusion: curPropertyExclusion,
      dateStart: regDt,
      dateEnd: todayDt,
    };
  }

  // 자산 업데이트
  await repository.property.updateProperty(
    user_id_param, initProperty, totalIncomeAll, totalIncomeExclusion, totalExpenseAll, totalExpenseExclusion, curPropertyAll, curPropertyExclusion
  );

  return {
    status: statusResult,
    result: finalResult
  };
};