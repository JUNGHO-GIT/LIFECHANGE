// testService.js

import * as repository from "../repository/tweakRepository.js";

// 1-1. dataset ----------------------------------------------------------------------------------->
export const dataset = async (
  customer_id_param
) => {

  const findResult = await repository.dataset.list(
    customer_id_param
  );

  return findResult;
};

// 1-2. list -------------------------------------------------------------------------------------->
export const list = async (
  customer_id_param, PAGING_param
) => {

  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);

  const findExercisePlan = await repository.list.listExercisePlan(
    customer_id_param, page
  );
  const findFoodPlan = await repository.list.listFoodPlan(
    customer_id_param, page
  );
  const findMoneyPlan = await repository.list.listMoneyPlan(
    customer_id_param, page
  );
  const findSleepPlan = await repository.list.listSleepPlan(
    customer_id_param, page
  );

  const findExerciseReal = await repository.list.listExerciseReal(
    customer_id_param, page
  );
  const findFoodReal = await repository.list.listFoodReal(
    customer_id_param, page
  );
  const findMoneyReal = await repository.list.listMoneyReal(
    customer_id_param, page
  );
  const findSleepReal = await repository.list.listSleepReal(
    customer_id_param, page
  );

  const exercisePlanCnt = findExercisePlan.length;
  const foodPlanCnt = findFoodPlan.length;
  const moneyPlanCnt = findMoneyPlan.length;
  const sleepPlanCnt = findSleepPlan.length;

  const exerciseCnt = findExerciseReal.length;
  const foodCnt = findFoodReal.length;
  const moneyCnt = findMoneyReal.length;
  const sleepCnt = findSleepReal.length;

  const finalResult = {
    exercisePlan: findExercisePlan,
    foodPlan: findFoodPlan,
    moneyPlan: findMoneyPlan,
    sleepPlan: findSleepPlan,
    exercise: findExerciseReal,
    food: findFoodReal,
    money: findMoneyReal,
    sleep: findSleepReal,
    exercisePlanCnt: exercisePlanCnt,
    foodPlanCnt: foodPlanCnt,
    moneyPlanCnt: moneyPlanCnt,
    sleepPlanCnt: sleepPlanCnt,
    exerciseCnt: exerciseCnt,
    foodCnt: foodCnt,
    moneyCnt: moneyCnt,
    sleepCnt: sleepCnt
  };

  return {
    result: finalResult
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  customer_id_param, OBJECT_param
) => {

  const findResult = await repository.detail(
    customer_id_param, ""
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.create(
      customer_id_param, OBJECT_param
    );
  }
  else {
    finalResult = await repository.update(
      customer_id_param, findResult._id, OBJECT_param
    );
  }

  return finalResult
};