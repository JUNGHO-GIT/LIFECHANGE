// sleepRepository.ts

import mongoose from "mongoose";
import { Sleep } from "@schemas/sleep/Sleep";
import { newDate } from "@scripts/date";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Sleep.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? {
          sleep_dateType: dateType_param
        } : {},
      }
    },
    {
      $match: {
        $expr: {
          $gt: [
            { $size: "$sleep_section" }, 0
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        existDate: {
          $addToSet: "$sleep_dateStart"
        }
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

  const finalResult = await Sleep.countDocuments(
    {
      user_id: user_id_param,
      sleep_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      sleep_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      ...dateType_param ? {
        sleep_dateType: dateType_param
      } : {},
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

  const finalResult = await Sleep.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? {
          sleep_dateType: dateType_param
        } : {},
      }
    },
    {
      $unwind: "$sleep_section"
    },
    {
      $project: {
        _id: 1,
        sleep_dateType: 1,
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: [{
          _id: "$sleep_section._id",
          sleep_bedTime: "$sleep_section.sleep_bedTime",
          sleep_wakeTime: "$sleep_section.sleep_wakeTime",
          sleep_sleepTime: "$sleep_section.sleep_sleepTime",
        }]
      }
    },
    {
      $sort: {
        sleep_dateStart: sort_param
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

  const finalResult = await Sleep.findOne(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      sleep_dateStart: {
        $eq: dateStart_param
      },
      sleep_dateEnd: {
        $eq: dateEnd_param
      },
      ...dateType_param ? {
        sleep_dateType: dateType_param
      } : {},
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

  const finalResult = await Sleep.create(
    {
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      sleep_dummy: "N",
      sleep_dateType: dateType_param,
      sleep_dateStart: dateStart_param,
      sleep_dateEnd: dateEnd_param,
      sleep_section: OBJECT_param.sleep_section,
      sleep_regDt: newDate,
      sleep_updateDt: "",
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

  const finalResult = await Sleep.findOneAndUpdate(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param
    },
    {
      $set: {
        sleep_dateType: dateType_param,
        sleep_dateStart: dateStart_param,
        sleep_dateEnd: dateEnd_param,
        sleep_section: OBJECT_param.sleep_section,
        sleep_updateDt: newDate,
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

// 5. delete --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  _id_param: string,
) => {

  const finalResult = await Sleep.findOneAndDelete(
    {
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
    }
  )
  .lean();

  return finalResult;
};