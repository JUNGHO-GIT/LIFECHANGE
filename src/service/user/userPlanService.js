// userPlanService.js

import * as repository from "../../repository/user/userPlanRepository.js";

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  user_id_param, _id_param
) => {

  const finalResult = await repository.detail(
    user_id_param, _id_param
  );

  return finalResult
};