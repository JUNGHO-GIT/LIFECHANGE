// userSyncService.ts

import * as repository from "@repositories/user/userSyncRepository";
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

  let minScale: any = null;
  let maxScale: any = null;
  let curScale: any = null;

  let finalResult: any = null;
  let statusResult: string = "";

  // 가입날짜 ~ 현재날짜
  findRegDt = await repository.scale.findScaleRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  // 최초 체중 조회
  findInitScale = await repository.scale.findScaleInit(
    user_id_param
  );

  // 최소 체중
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

  // 현재 체중 업데이트
  await repository.scale.updateScale(
    user_id_param, curScale?.exercise_total_weight
  );

  if (!findInitScale && !minScale && !maxScale && !curScale) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = {
      initScale: String (
        findInitScale?.user_initScale
        ? parseFloat(findInitScale?.user_initScale).toFixed(1)
        : "0"
      ),
      minScale: String (
        minScale?.exercise_total_weight
        ? parseFloat(minScale?.exercise_total_weight).toFixed(1)
        : "0"
      ),
      maxScale: String (
        maxScale?.exercise_total_weight
        ? parseFloat(maxScale?.exercise_total_weight).toFixed(1)
        : "0"
      ),
      curScale: String (
        curScale?.exercise_total_weight
        ? parseFloat(curScale?.exercise_total_weight).toFixed(1)
        : "0"
      ),
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

// 3-1. kcal ---------------------------------------------------------------------------------------
// 칼로리 조회
export const kcal = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findRegDt: any = null;
  let findTotalCnt: any = null;
  let findInitKcal: any = null;
  let findNutrition: any = null;

  let totalKcal: any = null;
  let totalCarb: any = null;
  let totalProtein: any = null;
  let totalFat: any = null;
  let curAvgKcal: any = null;
  let curAvgCarb: any = null;
  let curAvgProtein: any = null;
  let curAvgFat: any = null;

  let finalResult: any = null;
  let statusResult: string = "";

  // 가입날짜 ~ 현재날짜
  findRegDt = await repository.kcal.findKcalRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  // 데이터 총 개수 조회
  findTotalCnt = await repository.kcal.findTotalCnt(
    user_id_param, regDt, todayDt
  );

  // 최초 칼로리 조회
  findInitKcal = await repository.kcal.findKcalInit(
    user_id_param
  );

  // 영양소 조회
  findNutrition = await repository.kcal.findNutrition(
    user_id_param, regDt, todayDt
  );

  // 총 칼로리
  totalKcal = findNutrition?.food_total_kcal;

  // 총 탄수화물
  totalCarb = findNutrition?.food_total_carb;

  // 총 단백질
  totalProtein = findNutrition?.food_total_protein;

  // 총 지방
  totalFat = findNutrition?.food_total_fat;

  // 현재 칼로리 평균
  curAvgKcal = (
    parseFloat(totalKcal) / findTotalCnt
  );

  // 현재 탄수화물 평균
  curAvgCarb = (
    parseFloat(totalCarb) / findTotalCnt
  );

  // 현재 단백질 평균
  curAvgProtein = (
    parseFloat(totalProtein) / findTotalCnt
  );

  // 현재 지방 평균
  curAvgFat = (
    parseFloat(totalFat) / findTotalCnt
  );

  if (!findInitKcal && !findNutrition) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = {
      initAvgKcal: String (
        findInitKcal?.user_initAvgKcal
        ? parseFloat(findInitKcal?.user_initAvgKcal).toFixed(0)
        : "0"
      ),
      totalKcal: String (
        totalKcal
        ? parseFloat(totalKcal).toFixed(0)
        : "0"
      ),
      totalCarb: String (
        totalCarb
        ? parseFloat(totalCarb).toFixed(0)
        : "0"
      ),
      totalProtein: String (
        totalProtein
        ? parseFloat(totalProtein).toFixed(0)
        : "0"
      ),
      totalFat: String (
        totalFat
        ? parseFloat(totalFat).toFixed(0)
        : "0"
      ),
      curAvgKcal: String (
        curAvgKcal
        ? parseFloat(curAvgKcal).toFixed(0)
        : "0"
      ),
      curAvgCarb: String (
        curAvgCarb
        ? parseFloat(curAvgCarb).toFixed(0)
        : "0"
      ),
      curAvgProtein: String (
        curAvgProtein
        ? parseFloat(curAvgProtein).toFixed(0)
        : "0"
      ),
      curAvgFat: String (
        curAvgFat
        ? parseFloat(curAvgFat).toFixed(0)
        : "0"
      ),
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

// 3-2. favorite -----------------------------------------------------------------------------------
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

// 4. property -------------------------------------------------------------------------------------
// 자산 조회
export const property = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findRegDt: any = null;
  let findInitProperty: any = null;
  let findPropertyMoney: any = null;

  let totalIncomeInclude: any = null;
  let totalIncomeExclude: any = null;
  let totalExpenseInclude: any = null;
  let totalExpenseExclude: any = null;
  let curPropertyInclude: any = null;
  let curPropertyExclude: any = null;

  let finalResult: any = null;
  let statusResult: string = "";

  // 가입날짜 ~ 현재날짜
  findRegDt = await repository.property.findPropertyRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  // 최초 자산 조회
  findInitProperty = await repository.property.findPropertyInit(
    user_id_param
  );

  // 자산 조회
  findPropertyMoney = await repository.property.findPropertyMoney(
    user_id_param, regDt, todayDt
  );

  // 총 수입 (포함)
  totalIncomeInclude = findPropertyMoney?.incomeOrExpenseIncludeResult?.money_total_income;

  // 총 지출 (포함)
  totalExpenseInclude = findPropertyMoney?.incomeOrExpenseIncludeResult?.money_total_expense;

  // 총 수입 (미포함)
  totalIncomeExclude = findPropertyMoney?.incomeOrExpenseResult?.money_total_income;

  // 총 지출 (미포함)
  totalExpenseExclude = findPropertyMoney?.incomeOrExpenseResult?.money_total_expense;

  // 현재 자산 (포함)
  curPropertyInclude = String (
    parseFloat(findInitProperty?.user_initProperty || "0") +
    parseFloat(totalIncomeInclude || "0") -
    parseFloat(totalExpenseInclude || "0")
  );

  // 현재 자산 (미포함)
  curPropertyExclude = String (
    parseFloat(findInitProperty?.user_initProperty || "0") +
    parseFloat(totalIncomeExclude || "0") -
    parseFloat(totalExpenseExclude || "0")
  );

  // 자산 업데이트
  await repository.property.updateProperty(
    user_id_param, totalIncomeInclude, totalExpenseInclude, totalIncomeExclude, totalExpenseExclude, curPropertyInclude, curPropertyExclude
  );

  if (!findInitProperty && !findPropertyMoney) {
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
      totalIncomeInclude: String (
        totalIncomeInclude
        ? parseFloat(totalIncomeInclude)
        : "0"
      ),
      totalIncomeExclude: String (
        totalIncomeExclude
        ? parseFloat(totalIncomeExclude)
        : "0"
      ),
      totalExpenseInclude: String (
        totalExpenseInclude
        ? parseFloat(totalExpenseInclude)
        : "0"
      ),
      totalExpenseExclude: String (
        totalExpenseExclude
        ? parseFloat(totalExpenseExclude)
        : "0"
      ),
      curPropertyInclude: String (
        curPropertyInclude
        ? parseFloat(curPropertyInclude)
        : "0"
      ),
      curPropertyExclude: String (
        curPropertyExclude
        ? parseFloat(curPropertyExclude)
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