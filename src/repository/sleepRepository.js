// sleepPlanRepository.js

import mongoose from "mongoose";
import {Sleep} from "../schema/Sleep.js";
import {fmtDate} from "../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Sleep.countDocuments({
      user_id: user_id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    });
    return finalResult;
  },

  list: async (
    user_id_param, sort_param, limit_param, page_param, startDt_param, endDt_param
  ) => {

    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        sleep_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: "$sleep_section"},
      {$project: {
        _id: 1,
        sleep_startDt: 1,
        sleep_endDt: 1,
        sleep_section: [{
          _id: "$sleep_section._id",
          sleep_night: "$sleep_section.sleep_night",
          sleep_morning: "$sleep_section.sleep_morning",
          sleep_time: "$sleep_section.sleep_time",
        }]
      }},
      {$sort: {
        sleep_startDt: sort_param,
        sleep_endDt: sort_param
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
    user_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    user_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Sleep.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      sleep_demo: false,
      sleep_startDt: startDt_param,
      sleep_endDt: endDt_param,
      sleep_section: OBJECT_param.sleep_section,
      sleep_regDt: fmtDate,
      sleep_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,startDt_param, endDt_param
  ) => {
    const finalResult = await Sleep.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        sleep_startDt: startDt_param,
        sleep_endDt: endDt_param,
        sleep_section: OBJECT_param.sleep_section,
        sleep_updateDt: fmtDate,
      }},
      {upsert: true,
        new: true
      }
    )
    .lean();
    return finalResult;
  }
};

// 4. delete -------------------------------------------------------------------------------------->
export const deletes = {
  detail: async (
    user_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, section_id_param, startDt_param, endDt_param,
  ) => {
    const updateResult = await Sleep.updateOne(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param,
        sleep_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        sleep_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      },
      {$pull: {
        sleep_section: {
          _id: section_id_param
        },
      },
      $set: {
        sleep_updateDt: fmtDate,
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