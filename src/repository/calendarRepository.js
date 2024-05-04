// calendarPlanRepository.js

import mongoose from "mongoose";
import {Calendar} from "../schema/Calendar.js";
import {fmtDate} from "../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Calendar.countDocuments({
      user_id: user_id_param,
      calendar_startDt: {
        $lte: endDt_param,
      },
      calendar_endDt: {
        $gte: startDt_param,
      },
    });
    return finalResult;
  },

  list: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Calendar.aggregate([
      {$match: {
        user_id: user_id_param,
        calendar_startDt: {
          $lte: endDt_param,
        },
        calendar_endDt: {
          $gte: startDt_param,
        },
      }}
    ]);
    return finalResult;
  },
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Calendar.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      calendar_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      calendar_endDt: {
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
    const finalResult = await Calendar.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      calendar_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      calendar_endDt: {
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
    const finalResult = await Calendar.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      calendar_startDt: startDt_param,
      calendar_endDt: endDt_param,
      calendar_section: OBJECT_param.calendar_section,
      calendar_regDt: fmtDate,
      calendar_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Calendar.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        calendar_startDt: startDt_param,
        calendar_endDt: endDt_param,
        calendar_section: OBJECT_param.calendar_section,
        calendar_updateDt: fmtDate,
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
    const finalResult = await Calendar.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      calendar_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      calendar_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await Calendar.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};