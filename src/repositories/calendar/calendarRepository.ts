// calendarRepository.ts

import mongoose from "mongoose";
import { Calendar } from "@schemas/calendar/Calendar";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.aggregate([
    {
      $match: {
        user_id: user_id_param,
        calendar_dateStart: {
          $lte: dateEnd_param
        },
        calendar_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { calendar_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 1,
        calendar_dateType: 1,
        calendar_dateStart: 1,
        calendar_dateEnd: 1,
      }
    },
    {
      $sort: {
        calendar_dateStart: 1
      }
    }
  ]);

  return finalResult;
};

// 0. cnt ------------------------------------------------------------------------------------------
export const cnt = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.countDocuments(
    {
      user_id: user_id_param,
      calendar_dateStart: {
        $lte: dateEnd_param,
      },
      calendar_dateEnd: {
        $gte: dateStart_param,
      },
      ...dateType_param ? { calendar_dateType: dateType_param } : {},
    }
  );

  return finalResult;
};

// 1. list -----------------------------------------------------------------------------------------
export const list = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
  sort_param: 1 | -1,
  page_param: number,
) => {

  const finalResult:any = await Calendar.aggregate([
    {
      $match: {
        user_id: user_id_param,
        calendar_dateStart: {
          $lte: dateEnd_param,
        },
        calendar_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param ? { calendar_dateType: dateType_param } : {}),
      }
    },
    {
      $lookup: {
        from: "exercise",
        let: { user_id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user_id", "$$user_id"] },
                  { $lte: ["$exercise_dateStart", dateEnd_param] },
                  { $gte: ["$exercise_dateEnd", dateStart_param] },
                ]
              }
            }
          },
          {
            $project: {
              _id: 0,
              exercise_dateType: 1,
              exercise_dateStart: 1,
              exercise_dateEnd: 1,
              exercise_section: 1,
            }
          }
        ],
        as: "exercise"
      }
    },
    {
      $lookup: {
        from: "food",
        let: { user_id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user_id", "$$user_id"] },
                  { $lte: ["$food_dateStart", dateEnd_param] },
                  { $gte: ["$food_dateEnd", dateStart_param] },
                ]
              }
            }
          },
          {
            $project: {
              _id: 0,
              food_dateType: 1,
              food_dateStart: 1,
              food_dateEnd: 1,
              food_section: 1,
            }
          }
        ],
        as: "food"
      }
    },
    {
      $lookup: {
        from: "money",
        let: { user_id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user_id", "$$user_id"] },
                  { $lte: ["$money_dateStart", dateEnd_param] },
                  { $gte: ["$money_dateEnd", dateStart_param] },
                ]
              }
            }
          },
          {
            $project: {
              _id: 0,
              money_dateType: 1,
              money_dateStart: 1,
              money_dateEnd: 1,
              money_section: 1,
            }
          }
        ],
        as: "money"
      }
    },
    {
      $lookup: {
        from: "sleep",
        let: { user_id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user_id", "$$user_id"] },
                  { $lte: ["$sleep_dateStart", dateEnd_param] },
                  { $gte: ["$sleep_dateEnd", dateStart_param] },
                ]
              }
            }
          },
          {
            $project: {
              _id: 0,
              sleep_dateType: 1,
              sleep_dateStart: 1,
              sleep_dateEnd: 1,
              sleep_section: 1,
            }
          }
        ],
        as: "sleep"
      }
    },
    {
      $project: {
        _id: 1,
        calendar_dateType: 1,
        calendar_dateStart: 1,
        calendar_dateEnd: 1,
        calendar_section: 1,
        exercise_dateType: { $arrayElemAt: ["$exercise.exercise_dateType", 0] },
        exercise_dateStart: { $arrayElemAt: ["$exercise.exercise_dateStart", 0] },
        exercise_dateEnd: { $arrayElemAt: ["$exercise.exercise_dateEnd", 0] },
        exercise_section: { $arrayElemAt: ["$exercise.exercise_section", 0] },
        food_dateType: { $arrayElemAt: ["$food.food_dateType", 0] },
        food_dateStart: { $arrayElemAt: ["$food.food_dateStart", 0] },
        food_dateEnd: { $arrayElemAt: ["$food.food_dateEnd", 0] },
        food_section: { $arrayElemAt: ["$food.food_section", 0] },
        money_dateType: { $arrayElemAt: ["$money.money_dateType", 0] },
      }
    },
    {
      $sort: {
        calendar_dateStart: sort_param
      }
    },
    {
      $skip: (Number(page_param) - 1)
    }
  ]);

  return finalResult;
};

// 2. detail ---------------------------------------------------------------------------------------
export const detail = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.findOne(
    {
      user_id: user_id_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      ...dateType_param ? { calendar_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};

// 3. create ---------------------------------------------------------------------------------------
export const create = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.create(
    {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      calendar_dateType: dateType_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      calendar_section: OBJECT_param.calendar_section,
      calendar_regDt: new Date(),
      calendar_updateDt: "",
    }
  );

  return finalResult;
};

// 4. update ---------------------------------------------------------------------------------------
export const update = {

  // 1. update (기존항목 유지 + 타겟항목으로 수정)
  update: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const finalResult:any = await Calendar.findOneAndUpdate(
      {
        user_id: user_id_param,
        calendar_dateStart: dateStart_param,
        calendar_dateEnd: dateEnd_param,
        ...dateType_param ? { calendar_dateType: dateType_param } : {},
      },
      {
        $set: {
          calendar_section: OBJECT_param.calendar_section,
          calendar_updateDt: new Date(),
        },
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  },

  // 2. insert (기존항목 제거 + 타겟항목에 추가)
  insert: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const finalResult:any = await Calendar.findOneAndUpdate(
      {
        user_id: user_id_param,
        calendar_dateStart: dateStart_param,
        calendar_dateEnd: dateEnd_param,
        ...dateType_param ? { calendar_dateType: dateType_param } : {},
      },
      {
        $set: {
          calendar_updateDt: new Date(),
        },
        $push: {
          calendar_section: OBJECT_param.calendar_section
        }
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  },

  // 3. replace (기존항목 제거 + 타겟항목을 교체)
  replace: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const finalResult:any = await Calendar.findOneAndUpdate(
      {
        user_id: user_id_param,
        calendar_dateStart: dateStart_param,
        calendar_dateEnd: dateEnd_param,
        ...dateType_param ? { calendar_dateType: dateType_param } : {},
      },
      {
        $set: {
          calendar_section: OBJECT_param.calendar_section,
          calendar_updateDt: new Date(),
        },
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  }
};

// 4. insert (기존항목 제거 + 타겟항목에 끼워넣기) -------------------------------------------------
export const insert = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.findOneAndUpdate(
    {
      user_id: user_id_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      ...dateType_param ? { calendar_dateType: dateType_param } : {},
    },
    {
      $set: {
        calendar_updateDt: new Date(),
      },
      $push: {
        calendar_section: OBJECT_param.calendar_section
      }
    },
    {
      upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};

// 5. replace (기존항목 제거 + 타겟항목을 대체) ----------------------------------------------------
export const replace = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.findOneAndUpdate(
    {
      user_id: user_id_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      ...dateType_param ? { calendar_dateType: dateType_param } : {},
    },
    {
      $set: {
        calendar_section: OBJECT_param.calendar_section,
        calendar_updateDt: new Date(),
      },
    },
    {
      upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};

// 5. delete ---------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.findOneAndDelete(
    {
      user_id: user_id_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      ...dateType_param ? { calendar_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};