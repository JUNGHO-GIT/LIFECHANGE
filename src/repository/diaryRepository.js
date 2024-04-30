// diaryPlanRepository.js

import mongoose from "mongoose";
import {Diary} from "../schema/Diary.js";
import {fmtDate} from "../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Diary.countDocuments({
      customer_id: customer_id_param,
      diary_startDt: {
        $lte: endDt_param,
      },
      diary_endDt: {
        $gte: startDt_param,
      },
    });
    return finalResult;
  },

  list: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Diary.aggregate([
      {$match: {
        customer_id: customer_id_param,
        diary_startDt: {
          $lte: endDt_param,
        },
        diary_endDt: {
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
    customer_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Diary.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      diary_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      diary_endDt: {
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
    customer_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Diary.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      diary_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      diary_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },

  create: async (
    customer_id_param, OBJECT_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Diary.create({
      customer_id: customer_id_param,
      _id: new mongoose.Types.ObjectId(),
      diary_startDt: startDt_param,
      diary_endDt: endDt_param,
      diary_section: OBJECT_param.diary_section,
      diary_regDt: fmtDate,
      diary_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    customer_id_param, _id_param, OBJECT_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Diary.findOneAndUpdate(
      {customer_id: customer_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        diary_startDt: startDt_param,
        diary_endDt: endDt_param,
        diary_section: OBJECT_param.diary_section,
        diary_updateDt: fmtDate,
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
    customer_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Diary.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      diary_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      diary_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },

  deletes: async (
    customer_id_param, _id_param
  ) => {
    const deleteResult = await Diary.deleteOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};