// sleepPlanRepository.js

import mongoose from "mongoose";
import {Sleep} from "../../schema/sleep/Sleep.js";
import {newDate} from "../../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await Sleep.countDocuments({
      user_id: user_id_param,
      sleep_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      sleep_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      ...(dateType_param === "전체" ? {} : {
        sleep_dateType: dateType_param
      }),
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param,
    limit_param, page_param,
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        ...(dateType_param === "전체" ? {} : {
          sleep_dateType: dateType_param
        }),
      }},
      {$unwind: "$sleep_section"},
      {$project: {
        _id: 1,
        sleep_dateType: 1,
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: [{
          _id: "$sleep_section._id",
          sleep_night: "$sleep_section.sleep_night",
          sleep_morning: "$sleep_section.sleep_morning",
          sleep_time: "$sleep_section.sleep_time",
        }]
      }},
      {$sort: {
        sleep_dateStart: sort_param,
        sleep_dateEnd: sort_param
      }},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
    ]);

    return finalResult;
  },
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      sleep_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    user_id_param, _id_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      sleep_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      sleep_demo: false,
      sleep_dateType: OBJECT_param.sleep_dateType,
      sleep_dateStart: dateStart_param,
      sleep_dateEnd: dateEnd_param,
      sleep_section: OBJECT_param.sleep_section,
      sleep_regDt: newDate,
      sleep_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        sleep_dateType: OBJECT_param.sleep_dateType,
        sleep_dateStart: dateStart_param,
        sleep_dateEnd: dateEnd_param,
        sleep_section: OBJECT_param.sleep_section,
        sleep_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();
    return finalResult;
  }
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = {
  detail: async (
    user_id_param, _id_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      sleep_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    })
    .lean();
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, section_id_param, dateStart_param, dateEnd_param,
  ) => {
    const updateResult = await Sleep.updateOne(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      },
      {$pull: {
        sleep_section: {
          _id: section_id_param
        },
      },
      $set: {
        sleep_updateDt: newDate,
      }}
    )
    .lean();
    return updateResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await Sleep.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};