// diaryPlanRepository.js

import mongoose from "mongoose";
import {Diary} from "../schema/Diary.js";
import {fmtDate} from "../assets/common/date.js";

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  customer_id_param, category_param, startDt_param, endDt_param
) => {

  const finalResult = await Diary.countDocuments({
    customer_id: customer_id_param,
    diary_category: category_param,
    diary_startDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    },
    diary_endDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    },
  });

  return finalResult;
}

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  find: async (
    customer_id_param, sort_param, limit_param, page_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Diary.aggregate([
      {$match: {
        customer_id: customer_id_param,
        diary_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        diary_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: "$diary_section"},
      {$project: {
        _id: 1,
        diary_startDt: 1,
        diary_endDt: 1,
        diary_section: [{
          _id: "$diary_section._id",
          diary_night: "$diary_section.diary_night",
          diary_morning: "$diary_section.diary_morning",
          diary_time: "$diary_section.diary_time",
        }]
      }},
      {$sort: {
        diary_startDt: sort_param,
        diary_endDt: sort_param
      }},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit:  Number(limit_param)},
    ]);

    return finalResult;
  },
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    _id_param, customer_id_param, category_param, startDt_param, endDt_param
  ) => {

    const finalResult = await Diary.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      diary_category: category_param,
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
    _id_param, customer_id_param, category_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Diary.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      diary_category: category_param,
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
      _id: new mongoose.Types.ObjectId(),
      customer_id: customer_id_param,
      diary_startDt: startDt_param,
      diary_endDt: endDt_param,
      diary_category: OBJECT_param.diary_category,
      diary_title: OBJECT_param.diary_title,
      diary_detail: OBJECT_param.diary_detail,
      diary_regDt: fmtDate,
      diary_updateDt: "",
    });

    return finalResult;
  },
  update: async (
    _id_param, OBJECT_param
  ) => {
    const finalResult = await Diary.findOneAndUpdate(
      {_id: _id_param
      },
      {$set: {
        ...OBJECT_param,
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
    _id_param, customer_id_param, category_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Diary.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      diary_category: category_param,
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
    _id_param
  ) => {
    const deleteResult = await Diary.deleteOne({
      _id: _id_param
    })
    .lean();
    return deleteResult;
  }
};