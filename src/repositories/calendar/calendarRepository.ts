// calendarRepository.ts

import mongoose from "mongoose";
import { Calendar } from "@schemas/calendar/Calendar";
import { newDate } from "@scripts/date";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Calendar.aggregate([
    {
      $match: {
        user_id: user_id_param,
        calendar_dateStart: {
          $lte: dateEnd_param,
        },
        calendar_dateEnd: {
          $gte: dateStart_param,
        },
        ...((!dateType_param || dateType_param === "") ? {} : {
          calendar_dateType: dateType_param
        }),
      }
    },
    {
      $match: {
        $expr: {
          $gt: [
            { $size: "$calendar_section" }, 0
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        existDate: {
          $addToSet: "$calendar_dateStart"
        }
      }
    }
  ]);

  return finalResult;
}

// 0. cnt ------------------------------------------------------------------------------------------
export const cnt = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Calendar.countDocuments(
    {
      user_id: user_id_param,
      calendar_dateStart: {
        $lte: dateEnd_param,
      },
      calendar_dateEnd: {
        $gte: dateStart_param,
      },
      ...((!dateType_param || dateType_param === "") ? {} : {
        calendar_dateType: dateType_param
      }),
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

  const finalResult = await Calendar.aggregate([
    {
      $match: {
        user_id: user_id_param,
        calendar_dateStart: {
          $lte: dateEnd_param,
        },
        calendar_dateEnd: {
          $gte: dateStart_param,
        },
        ...((!dateType_param || dateType_param === "") ? {} : {
          calendar_dateType: dateType_param
        }),
      }
    },
    {
      $project: {
        _id: 1,
        calendar_dateType: 1,
        calendar_dateStart: 1,
        calendar_dateEnd: 1,
        calendar_section: 1,
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
  _id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Calendar.findOne(
    {
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      calendar_dateStart: {
        $eq: dateStart_param
      },
      calendar_dateEnd: {
        $eq: dateEnd_param
      },
      ...((!dateType_param || dateType_param === "") ? {} : {
        calendar_dateType: dateType_param
      }),
    }
  )
  .lean();

  return finalResult;
};

// 3. save -----------------------------------------------------------------------------------------
export const save = async (
  user_id_param: string,
  _id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Calendar.create(
    {
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      calendar_dummy: "N",
      calendar_dateType: dateType_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      calendar_section: OBJECT_param.calendar_section,
      calendar_regDt: newDate,
      calendar_updateDt: "",
    }
  );

  return finalResult;
};

// 4. update ---------------------------------------------------------------------------------------
export const update = async (
  user_id_param: string,
  _id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Calendar.findOneAndUpdate(
    {
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    },
    {
      $set: {
        calendar_dateType: dateType_param,
        calendar_dateStart: dateStart_param,
        calendar_dateEnd: dateEnd_param,
        calendar_section: OBJECT_param.calendar_section,
        calendar_updateDt: newDate
      }
    },
    {
      upsert: true,
      new: false
    }
  )
  .lean();

  return finalResult;
};

// 5. deletes --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  _id_param: string,
) => {

  const finalResult = await Calendar.findOneAndDelete(
    {
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
    }
  )
  .lean();

  return finalResult;
};