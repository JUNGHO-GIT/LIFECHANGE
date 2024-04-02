// workService.js

import mongoose from "mongoose";
import moment from "moment";
import {Work} from "../schema/Work.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  work_dur_param,
  filter_param
) => {

  let totalCount;
  let finalResult;
  let startDay = work_dur_param.split(` ~ `)[0];
  let endDay = work_dur_param.split(` ~ `)[1];

  const filterOrder = filter_param.order;
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;

  const findQuery = {
    user_id: user_id_param,
    work_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  const sortOrder = filterOrder === "asc" ? 1 : -1;

  totalCount = await Work.countDocuments(findQuery);
  finalResult = await Work.find(findQuery).sort({work_day: sortOrder}).skip((page - 1) * limit).limit(limit);

  return {
    totalCount: totalCount,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  user_id_param,
  work_dur_param
) => {

  let realCount;
  let planCount;
  let finalResult;
  let startDay = work_dur_param.split(` ~ `)[0];
  let endDay = work_dur_param.split(` ~ `)[1];

  const findQuery = {
    user_id: user_id_param,
    work_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  finalResult = await Work.findOne(findQuery);
  realCount = finalResult.work_real?.work_section.length || 0;
  planCount = finalResult.work_plan?.work_section.length || 0;

  return {
    realCount: realCount,
    planCount: planCount,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  WORK_param,
  work_dur_param,
  planYn_param
) => {

  let finalResult;
  let startDay = work_dur_param.split(` ~ `)[0];
  let endDay = work_dur_param.split(` ~ `)[1];

  const findQuery = {
    user_id: user_id_param,
    work_day: {
      $gte: startDay,
      $lte: endDay,
    },
  };

  const findResult = await Work.findOne(findQuery);

  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      work_day: startDay,
      work_plan: WORK_param.work_plan,
      work_real: WORK_param.work_real,
      work_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss"),
      work_update: "default",
    };
    finalResult = await Work.create(createQuery);
  }
  else {
    const updateQuery = {_id: findResult._id};
    const updateAction = planYn_param === "Y"
    ? {$set: {
      work_plan: WORK_param.work_plan,
      work_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss")
    }}
    : {$set: {
      work_real: WORK_param.work_real,
      work_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss")
    }}
    finalResult = await Work.updateOne(updateQuery, updateAction);
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  user_id_param,
  work_dur_param
) => {

  let finalResult;
  let startDay = work_dur_param.split(` ~ `)[0];
  let endDay = work_dur_param.split(` ~ `)[1];

  const deleteQuery = {
    user_id: user_id_param,
    work_day: {
      $gte: startDay,
      $lte: endDay,
    },
  };

  finalResult = await Work.deleteMany(deleteQuery);

  return {
    result: finalResult,
  };
};