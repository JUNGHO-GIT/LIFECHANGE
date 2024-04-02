// sleepService.js

import mongoose from "mongoose";
import moment from "moment";
import {Sleep} from "../schema/Sleep.js";

// 0-1. dash(bar) --------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
) => {

  let finalResult = [];
  let dataFields = {
    "취침": { plan: "sleep_start", real: "sleep_start" },
    "기상": { plan: "sleep_end", real: "sleep_end" },
    "수면": { plan: "sleep_time", real: "sleep_time" }
  };

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  const findParam = {
    user_id: user_id_param,
    sleep_day: moment().tz("Asia/Seoul").format("YYYY-MM-DD").toString(),
  };

  const findResult = await Sleep.findOne(findParam);

  for (let key in dataFields) {
    finalResult.push({
      name: key,
      목표: fmtData(findResult?.sleep_plan[dataFields[key].plan]),
      실제: fmtData(findResult?.sleep_real[dataFields[key].real]),
    });
  }

  return {
    result: finalResult,
  };
};

// 0-2. dash(line) -------------------------------------------------------------------------------->
export const dashLine = async (
  user_id_param
) => {

  let finalResult = [];
  let names = ["월", "화", "수", "목", "금", "토", "일"];

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  for (let i = 0; i < 7; i++) {
    const findParam = {
      user_id: user_id_param,
      sleep_day: moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days").format("YYYY-MM-DD"),
    };

    const findResult = await Sleep.findOne(findParam);

    finalResult.push({
      name: names[i],
      취침: fmtData(findResult?.sleep_real?.sleep_start),
      기상: fmtData(findResult?.sleep_real?.sleep_end),
      수면: fmtData(findResult?.sleep_real?.sleep_time),
    });
  }

  return {
    result: finalResult,
  };
};

// 0-3. dash(avg) --------------------------------------------------------------------------------->
export const dashAvg = async (
  user_id_param,
  sleep_dur_param
) => {

  let finalResult = [];

  return {
    result: finalResult,
  };
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  sleep_dur_param,
  filter_param
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const filterOrder = filter_param.order;
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;

  const findQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  const sortOrder = filterOrder === "asc" ? 1 : -1;

  const totalCount = await Sleep.countDocuments(findQuery);
  const findResult = await Sleep.find(findQuery).sort({sleep_day: sortOrder}).skip((page - 1) * limit).limit(limit);

  return {
    totalCount: totalCount,
    result: findResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  user_id_param,
  sleep_dur_param
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const findQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  const findResult = await Sleep.findOne(findQuery);

  return {
    result: findResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  SLEEP_param,
  sleep_dur_param,
  planYn_param
) => {

  let finalResult;

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const findQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    },
  };
  const findResult = await Sleep.findOne(findQuery);

  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: SLEEP_param.user_id,
      sleep_day: startDay,
      sleep_real: SLEEP_param.sleep_real,
      sleep_plan: SLEEP_param.sleep_plan
    };
    const createResult = await Sleep.create(createQuery);
    finalResult = createResult;
  }
  else {
    const updateQuery = {_id: findResult._id};
    const updateAction = planYn_param === "N"
    ? {$set: {sleep_real: SLEEP_param.sleep_real}}
    : {$set: {sleep_plan: SLEEP_param.sleep_plan}}

    const updateResult = await Sleep.updateOne(updateQuery, updateAction);
    finalResult = updateResult;
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  user_id_param,
  sleep_dur_param
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const deleteQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    },
  };

  const deleteResult = await Sleep.deleteMany(deleteQuery);

  return {
    result: deleteResult,
  };
};