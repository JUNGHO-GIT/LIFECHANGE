// userPlanService.js

import * as repository from "../repository/userPlanRepository.js";

// 1-1. percent ----------------------------------------------------------------------------------->
export const percent = async (
  user_id_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const findFoodPlan = await repository.percent.findFoodPlan(
    user_id_param, startDt, endDt
  );
  const findFoodReal = await repository.percent.findFoodReal(
    user_id_param, startDt, endDt
  );

  const findMoneyPlan = await repository.percent.findMoneyPlan(
    user_id_param, startDt, endDt
  );
  const findMoneyReal = await repository.percent.findMoneyReal(
    user_id_param, startDt, endDt
  );

  const findSleepPlan = await repository.percent.findSleepPlan(
    user_id_param, startDt, endDt
  );
  const findSleepReal = await repository.percent.findSleepReal(
    user_id_param, startDt, endDt
  );

  const findWorkPlan = await repository.percent.findWorkPlan(
    user_id_param, startDt, endDt
  );
  const findWorkReal = await repository.percent.findWorkReal(
    user_id_param, startDt, endDt
  );

  const finalResult = {
    food: {
      plan: findFoodPlan,
      real: findFoodReal,
    },
    money: {
      plan: findMoneyPlan,
      real: findMoneyReal,
    },
    sleep: {
      plan: findSleepPlan,
      real: findSleepReal,
    },
    work: {
      plan: findWorkPlan,
      real: findWorkReal,
    },
  };

  return finalResult;
};