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

  for (let key in dataFields) {

    const findParam = {
      user_id: user_id_param,
      sleep_day: moment().tz("Asia/Seoul").format("YYYY-MM-DD").toString(),
    };

    const findResult = await Sleep.findOne(findParam);

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
  let names = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

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

// 0-3. dash(avg-week) ---------------------------------------------------------------------------->
export const dashAvgWeek = async (
  user_id_param
) => {

  let finalResult = [];
  let names = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];
  let sumSleepStart = Array(5).fill(0);
  let sumSleepEnd = Array(5).fill(0);
  let sumSleepTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

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

    if (findResult) {
      const weekNum = Math.max(0, moment(findParam.sleep_day).week() - moment(findParam.sleep_day).startOf("month").week() + 1);
      sumSleepStart[weekNum - 1] += fmtData(findResult.sleep_real.sleep_start);
      sumSleepEnd[weekNum - 1] += fmtData(findResult.sleep_real.sleep_end);
      sumSleepTime[weekNum - 1] += fmtData(findResult.sleep_real.sleep_time);
      countRecords[weekNum - 1]++;
    }
  };

  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: names[i],
      취침: sumSleepStart[i] / countRecords[i] || 0,
      기상: sumSleepEnd[i] / countRecords[i] || 0,
      수면: sumSleepTime[i] / countRecords[i] || 0,
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash(avg-month) --------------------------------------------------------------------------->
export const dashAvgMonth = async (
  user_id_param
) => {

  let finalResult = [];
  let names = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];
  let sumSleepStart = Array(12).fill(0);
  let sumSleepEnd = Array(12).fill(0);
  let sumSleepTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  for (
    let m = moment(moment().tz("Asia/Seoul").startOf("year"));
    m.isBefore(moment().tz("Asia/Seoul").endOf("year"));
    m.add(1, "days")
  ) {
    const findParam = {
      user_id: user_id_param,
      sleep_day: m.format("YYYY-MM-DD"),
    };

    const findResult = await Sleep.findOne(findParam);

    if (findResult) {
      const monthNum = m.month();
      sumSleepStart[monthNum] += fmtData(findResult.sleep_real.sleep_start);
      sumSleepEnd[monthNum] += fmtData(findResult.sleep_real.sleep_end);
      sumSleepTime[monthNum] += fmtData(findResult.sleep_real.sleep_time);
      countRecords[monthNum]++;
    }
  };

  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: names[i],
      취침: sumSleepStart[i] / countRecords[i] || 0,
      기상: sumSleepEnd[i] / countRecords[i] || 0,
      수면: sumSleepTime[i] / countRecords[i] || 0,
    });
  };

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

  let totalCount;
  let finalResult;
  let startDay = sleep_dur_param.split(` ~ `)[0];
  let endDay = sleep_dur_param.split(` ~ `)[1];

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

  totalCount = await Sleep.countDocuments(findQuery);
  finalResult = await Sleep.find(findQuery).sort({sleep_day: sortOrder}).skip((page - 1) * limit).limit(limit);

  return {
    totalCount: totalCount,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  user_id_param,
  sleep_dur_param
) => {

  let finalResult;
  let startDay = sleep_dur_param.split(` ~ `)[0];
  let endDay = sleep_dur_param.split(` ~ `)[1];

  const findQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  finalResult = await Sleep.findOne(findQuery);

  return {
    result: finalResult,
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
  let startDay = sleep_dur_param.split(` ~ `)[0];
  let endDay = sleep_dur_param.split(` ~ `)[1];

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

  let finalResult;
  let startDay = sleep_dur_param.split(` ~ `)[0];
  let endDay = sleep_dur_param.split(` ~ `)[1];

  const deleteQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    },
  };

  finalResult = await Sleep.deleteMany(deleteQuery);

  return {
    result: finalResult,
  };
};