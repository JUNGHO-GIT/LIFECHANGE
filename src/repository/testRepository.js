// exercisePlanRepository.js

import {Exercise} from "../schema/Exercise.js";

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  customer_id_param, startDt_param, endDt_param
) => {
  const finalResult = await Exercise.countDocuments({
    customer_id: customer_id_param,
    exercise_startDt: {
      $lte: endDt_param,
    },
    exercise_endDt: {
      $gte: startDt_param,
    },
  });

  return finalResult;
}

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  find: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_startDt: {
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param,
        },
      }}
    ]);
    return finalResult;
  },
};