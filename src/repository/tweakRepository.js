// exercisePlanRepository.js

import {Exercise} from "../schema/Exercise.js";

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  customer_id_param, part_param, title_param, startDt_param, endDt_param
) => {

  const finalResult = await Exercise.countDocuments({
    customer_id: customer_id_param,
    exercise_startDt: {
      $gte: startDt_param,
    },
    exercise_endDt: {
      $lte: endDt_param,
    },
    ...(part_param !== "전체" && {
      "exercise_section.exercise_part_val": part_param
    }),
    ...(title_param !== "전체" && {
      "exercise_section.exercise_title_val": title_param
    }),
  });
  return finalResult;
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  find: async (
    customer_id_param, part_param, title_param, sort_param, limit_param, page_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        ...(part_param !== "전체" && {
          "exercise_section.exercise_part_val": part_param
        }),
        ...(title_param !== "전체" && {
          "exercise_section.exercise_title_val": title_param
        }),
      }},
      {$project: {
        exercise_startDt: 1,
        exercise_endDt: 1,
        exercise_total_volume: 1,
        exercise_total_cardio: 1,
        exercise_body_weight: 1,
        exercise_section: {
          $filter: {
            input: "$exercise_section",
            as: "section",
            cond: {
              $and: [
                part_param === "전체"
                ? {$ne: ["$$section.exercise_part_val", null]}
                : {$eq: ["$$section.exercise_part_val", part_param]},
                title_param === "전체"
                ? {$ne: ["$$section.exercise_title_val", null]}
                : {$eq: ["$$section.exercise_title_val", title_param]}
              ]
            }
          }
        }
      }},
      {$sort: {exercise_startDt: sort_param}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
};
