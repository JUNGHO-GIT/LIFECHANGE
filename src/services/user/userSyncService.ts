// userSyncService.ts

import * as repository from "@repositories/user/userSyncRepository";

// 0. category -------------------------------------------------------------------------------------
// 카테고리 조회
export const category = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findCategory: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // date 변수 선언
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  findCategory = await repository.listCategory(
    user_id_param, dateStart, dateEnd
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

  // date 변수 선언
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  // 1. exercise
  findExerciseGoal = await repository.listExerciseGoal(
    user_id_param, dateStart, dateEnd
  );
  findExercise = await repository.listExercise(
    user_id_param, dateStart, dateEnd
  );

  // 2. food
  findFoodGoal = await repository.listFoodGoal(
    user_id_param, dateStart, dateEnd
  );
  findFood = await repository.listFood(
    user_id_param, dateStart, dateEnd
  );

  // 3. money
  findMoneyGoal = await repository.listMoneyGoal(
    user_id_param, dateStart, dateEnd
  );
  findMoney = await repository.listMoney(
    user_id_param, dateStart, dateEnd
  );

  // 4. sleep
  findSleepGoal = await repository.listSleepGoal(
    user_id_param, dateStart, dateEnd
  );
  findSleep = await repository.listSleep(
    user_id_param, dateStart, dateEnd
  );

  findResult = {
    exerciseGoal: findExerciseGoal,
    exercise: findExercise,
    foodGoal: findFoodGoal,
    food: findFood,
    moneyGoal: findMoneyGoal,
    money: findMoney,
    sleepGoal: findSleepGoal,
    sleep: findSleep,
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

// 2. property -------------------------------------------------------------------------------------
// 현재 재산 상태
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
  findRegDt = await repository.findPropertyRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  findInitProperty = await repository.findPropertyInit(
    user_id_param
  );
  findMoney = await repository.findPropertyMoney(
    user_id_param, regDt, todayDt
  );

  curPropertyAll = String (
    parseFloat(findInitProperty?.user_initProperty) +
    parseFloat(findMoney?.curPropertyAllResult?.money_total_income) -
    parseFloat(findMoney?.curPropertyAllResult?.money_total_expense)
  );

  curProperty = String (
    parseFloat(findInitProperty?.user_initProperty) +
    parseFloat(findMoney?.curPropertyResult?.money_total_income) -
    parseFloat(findMoney?.curPropertyResult?.money_total_expense)
  );

  await repository.updateProperty(
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
        findInitProperty?.user_initProperty ? parseFloat(findInitProperty?.user_initProperty) : 0
      ),
      totalIncomeAll: String (
        findMoney?.curPropertyAllResult?.money_total_income ? parseFloat(findMoney?.curPropertyAllResult?.money_total_income) : 0
      ),
      totalExpenseAll: String (
        findMoney?.curPropertyAllResult?.money_total_expense ? parseFloat(findMoney?.curPropertyAllResult?.money_total_expense) : 0
      ),
      totalIncome: String (
        findMoney?.curPropertyResult?.money_total_income ? parseFloat(findMoney?.curPropertyResult?.money_total_income) : 0
      ),
      totalExpense: String (
        findMoney?.curPropertyResult?.money_total_expense ? parseFloat(findMoney?.curPropertyResult?.money_total_expense) : 0
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

// 3. scale ----------------------------------------------------------------------------------------
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
  findRegDt = await repository.findScaleRegDt(
    user_id_param
  );

  // 2024-08-04T15:30:20.805Z -> 2024-08-04
  const regDt = (findRegDt?.user_regDt).toISOString().slice(0, 10);
  const todayDt = DATE_param.dateEnd;

  findInitScale = await repository.findScaleInit(
    user_id_param
  );
  findScaleMinMax = await repository.findScaleMinMax(
    user_id_param, regDt, todayDt
  );
  findScaleCur = await repository.findScaleCur(
    user_id_param, regDt, todayDt
  );
  await repository.updateScale(
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
  }

  return {
    status: statusResult,
    result: finalResult
  };
};