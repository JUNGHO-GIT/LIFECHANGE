// sleepService.js

import mongoose from "mongoose";
import moment from "moment";
import {Sleep} from "../schema/Sleep.js";

// 1. dash ---------------------------------------------------------------------------------------->
export const dash = async (
  user_id_param
) => {

  let finalResult;
  let listArray;
  let avgArray;

  const findSleepList = async (startDay, endDay) => {
    const listPlanN = await Sleep.find({
      user_id: user_id_param,
      sleep_day: {
        $gte: startDay,
        $lte: endDay,
      },
      sleep_planYn: "N",
    });

    const listPlanY = await Sleep.find({
      user_id: user_id_param,
      sleep_day: {
        $gte: startDay,
        $lte: endDay,
      },
      sleep_planYn: "Y",
    });

    let mergedData;
    if (listPlanN.length > 0 || listPlanY.length > 0) {
      const allSleepDays
        = [...listPlanN, ...listPlanY]
        .map(item => item.sleep_day)
        .filter((value, index, self) => self.indexOf(value) === index);

      mergedData = allSleepDays.map(sleep_day => {
        const listItem = listPlanN.find((item) => item.sleep_day === sleep_day);
        const planItem = listPlanY.find((item) => item.sleep_day === sleep_day);
        return {
          sleep_day: sleep_day,
          sleep_start_real: listItem?.sleep_start || "00:00",
          sleep_time_real: listItem?.sleep_time || "00:00",
          sleep_end_real: listItem?.sleep_end || "00:00",
          sleep_start_plan: planItem?.sleep_start || "00:00",
          sleep_time_plan: planItem?.sleep_time || "00:00",
          sleep_end_plan: planItem?.sleep_end || "00:00",
        };
      });
    }

    return mergedData;
  };

  const findSleepAvg = async (name, startDay, endDay) => {
    const listPlanN = await Sleep.find({
      user_id: user_id_param,
      sleep_day: {
        $gte: startDay,
        $lte: endDay,
      },
      sleep_planYn: "N",
    });

    const listPlanY = await Sleep.find({
      user_id: user_id_param,
      sleep_day: {
        $gte: startDay,
        $lte: endDay,
      },
      sleep_planYn: "Y",
    });

    if (listPlanN.length === 0 && listPlanY.length === 0) {
      return {
        name: name,
        avg_night_real: "00:00",
        avg_time_real: "00:00",
        avg_morning_real: "00:00",
        avg_night_plan: "00:00",
        avg_time_plan: "00:00",
        avg_morning_plan: "00:00",
      };
    }

    let total_night_real = 0;
    let total_time_real = 0;
    let total_morning_real = 0;

    let total_night_plan = 0;
    let total_time_plan = 0;
    let total_morning_plan = 0;

    listPlanN.forEach((sleep) => {
      const [hours, minutes] = sleep.sleep_time.split(":").map(Number);
      const [nightHours, nightMinutes] = sleep.sleep_start.split(":").map(Number);
      const [morningHours, morningMinutes] = sleep.sleep_end.split(":").map(Number);
      total_time_real += (hours * 60) + minutes;
      total_night_real += (nightHours * 60) + nightMinutes;
      total_morning_real += (morningHours * 60) + morningMinutes;
    });

    listPlanY.forEach((sleep) => {
      const [hours, minutes] = sleep.sleep_time.split(":").map(Number);
      const [nightHours, nightMinutes] = sleep.sleep_start.split(":").map(Number);
      const [morningHours, morningMinutes] = sleep.sleep_end.split(":").map(Number);
      total_time_plan += (hours * 60) + minutes;
      total_night_plan += (nightHours * 60) + nightMinutes;
      total_morning_plan += (morningHours * 60) + morningMinutes;
    });

    const avg_night_real = moment.utc((total_night_real / listPlanN.length) * 60000).format("HH:mm");
    const avg_time_real = moment.utc((total_time_real / listPlanN.length) * 60000).format("HH:mm");
    const avg_morning_real = moment.utc((total_morning_real / listPlanN.length) * 60000).format("HH:mm");

    const avg_night_plan = moment.utc((total_night_plan / listPlanY.length) * 60000).format("HH:mm");
    const avg_time_plan = moment.utc((total_time_plan / listPlanY.length) * 60000).format("HH:mm");
    const avg_morning_plan = moment.utc((total_morning_plan / listPlanY.length) * 60000).format("HH:mm");

    return {
      name: name,
      avg_night_real: avg_night_real,
      avg_time_real: avg_time_real,
      avg_morning_real: avg_morning_real,
      avg_night_plan: avg_night_plan,
      avg_time_plan: avg_time_plan,
      avg_morning_plan: avg_morning_plan,
    };
  };

  // 오늘 (리스트)
  const todayList = await findSleepList (
    moment().format("YYYY-MM-DD"),
    moment().format("YYYY-MM-DD")
  );
  // 이번주 (리스트)
  const weekList = await findSleepList (
    moment().startOf("week").format("YYYY-MM-DD"),
    moment().endOf("week").format("YYYY-MM-DD")
  );
  // 이번달 (리스트)
  const monthList = await findSleepList (
    moment().startOf("month").format("YYYY-MM-DD"),
    moment().endOf("month").format("YYYY-MM-DD")
  );

  // 이번주 기준 5주 전 (평균)
  const beforeFiveWeekAvg = await findSleepAvg (
    `~${moment().startOf("week").subtract(5, "weeks").format("YYYY-MM-DD")}`,
    moment().startOf("week").subtract(5, "weeks").format("YYYY-MM-DD"),
    moment().startOf("week").subtract(4, "weeks").subtract(1, "days").format("YYYY-MM-DD")
  );
  // 이번주 기준 4주 전 (평균)
  const beforeFourWeekAvg = await findSleepAvg (
    `~${moment().startOf("week").subtract(4, "weeks").format("YYYY-MM-DD")}`,
    moment().startOf("week").subtract(4, "weeks").format("YYYY-MM-DD"),
    moment().startOf("week").subtract(3, "weeks").subtract(1, "days").format("YYYY-MM-DD")
  );
  // 이번주 기준 3주 전 (평균)
  const beforeThreeWeekAvg = await findSleepAvg (
    `~${moment().startOf("week").subtract(3, "weeks").format("YYYY-MM-DD")}`,
    moment().startOf("week").subtract(3, "weeks").format("YYYY-MM-DD"),
    moment().startOf("week").subtract(2, "weeks").subtract(1, "days").format("YYYY-MM-DD")
  );
  // 이번주 기준 2주 전 (평균)
  const beforeTwoWeekAvg = await findSleepAvg (
    `~${moment().startOf("week").subtract(2, "weeks").format("YYYY-MM-DD")}`,
    moment().startOf("week").subtract(2, "weeks").format("YYYY-MM-DD"),
    moment().startOf("week").subtract(1, "weeks").subtract(1, "days").format("YYYY-MM-DD")
  );
  // 이번주 기준 1주 전 (평균)
  const beforeOneWeekAvg = await findSleepAvg (
    `~${moment().startOf("week").subtract(1, "weeks").format("YYYY-MM-DD")}`,
    moment().startOf("week").subtract(1, "weeks").format("YYYY-MM-DD"),
    moment().endOf("week").subtract(1, "weeks").format("YYYY-MM-DD")
  );
  // 이번주 (평균)
  const beforeCurWeekAvg = await findSleepAvg (
    `~${moment().startOf("week").format("YYYY-MM-DD")}`,
    moment().startOf("week").format("YYYY-MM-DD"),
    moment().endOf("week").format("YYYY-MM-DD")
  );

  // 이번달 기준 5달 전 (평균)
  const beforeFiveMonthAvg = await findSleepAvg (
    `~${moment().startOf("month").subtract(5, "months").format("YYYY-MM-DD")}`,
    moment().startOf("month").subtract(5, "months").format("YYYY-MM-DD"),
    moment().startOf("month").subtract(4, "months").subtract(1, "days").format("YYYY-MM-DD")
  );
  // 이번달 기준 4달 전 (평균)
  const beforeFourMonthAvg = await findSleepAvg (
    `~${moment().startOf("month").subtract(4, "months").format("YYYY-MM-DD")}`,
    moment().startOf("month").subtract(4, "months").format("YYYY-MM-DD"),
    moment().startOf("month").subtract(3, "months").subtract(1, "days").format("YYYY-MM-DD")
  );
  // 이번달 기준 3달 전 (평균)
  const beforeThreeMonthAvg = await findSleepAvg (
    `~${moment().startOf("month").subtract(3, "months").format("YYYY-MM-DD")}`,
    moment().startOf("month").subtract(3, "months").format("YYYY-MM-DD"),
    moment().startOf("month").subtract(2, "months").subtract(1, "days").format("YYYY-MM-DD")
  );
  // 이번달 기준 2달 전 (평균)
  const beforeTwoMonthAvg = await findSleepAvg (
    `~${moment().startOf("month").subtract(2, "months").format("YYYY-MM-DD")}`,
    moment().startOf("month").subtract(2, "months").format("YYYY-MM-DD"),
    moment().startOf("month").subtract(1, "months").subtract(1, "days").format("YYYY-MM-DD")
  );
  // 이번달 기준 1달 전 (평균)
  const beforeOneMonthAvg = await findSleepAvg (
    `~${moment().startOf("month").subtract(1, "months").format("YYYY-MM-DD")}`,
    moment().startOf("month").subtract(1, "months").format("YYYY-MM-DD"),
    moment().endOf("month").subtract(1, "months").format("YYYY-MM-DD")
  );
  // 이번달 (평균)
  const beforeCurMonthAvg = await findSleepAvg (
    `~${moment().startOf("month").format("YYYY-MM-DD")}`,
    moment().startOf("month").format("YYYY-MM-DD"),
    moment().endOf("month").format("YYYY-MM-DD")
  );

  listArray = {
    todayList: todayList,
    weekList: weekList,
    monthList: monthList,
  };

  avgArray = {
    weekAvg: [
      beforeFiveWeekAvg,
      beforeFourWeekAvg,
      beforeThreeWeekAvg,
      beforeTwoWeekAvg,
      beforeOneWeekAvg,
      beforeCurWeekAvg,
    ],
    monthAvg: [
      beforeFiveMonthAvg,
      beforeFourMonthAvg,
      beforeThreeMonthAvg,
      beforeTwoMonthAvg,
      beforeOneMonthAvg,
      beforeCurMonthAvg,
    ],
  };

  finalResult = {
    listArray: listArray,
    avgArray: avgArray,
  };

  return finalResult;
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

  let findQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  const sortOrder = filterOrder === "asc" ? 1 : -1;
  const totalCount = await Sleep.countDocuments(findQuery);
  const findResult = await Sleep.find(findQuery).sort({ sleep_day: sortOrder }).skip((page - 1) * limit).limit(limit);
  const realResult = findResult.filter((item) => item.sleep_planYn === "N");
  const planResult = findResult.filter((item) => item.sleep_planYn === "Y");

  return {
    totalCount: totalCount,
    realResult: realResult,
    planResult: planResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  sleep_day_param,
  planYn_param,
) => {

  /* const startDay = sleep_dur_param.split(` ~ `)[0]; */
  /* const endDay = sleep_dur_param.split(` ~ `)[1]; */

  // 입력시 데이터조회 or 리스트에서 데이터조회
  const idParam = _id_param !== "" ? { $regex: _id_param } : { $exists: true };

  let findQuery = {
    _id: idParam,
    user_id: user_id_param,
    sleep_day: sleep_day_param,
    sleep_planYn: planYn_param,
  };

  const totalCount = await Sleep.countDocuments(findQuery);
  const findResult = await Sleep.find(findQuery);
  const realResult = findResult.filter((item) => item.sleep_planYn === "N");
  const planResult = findResult.filter((item) => item.sleep_planYn === "Y");

  return {
    totalCount: totalCount,
    realResult: realResult,
    planResult: planResult,
  };
};

// 3. insert -------------------------------------------------------------------------------------->
export const insert = async (
  user_id_param,
  SLEEP_param,
  planYn_param
) => {

  let createQuery;
  let createResult;
  let updateQuery;
  let findQuery;
  let findResult;

  findQuery = {
    user_id: user_id_param,
    sleep_day: SLEEP_param.sleep_day,
    sleep_planYn: planYn_param,
  };

  findResult = await Sleep.findOne(findQuery);

  createQuery = {
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    sleep_start : SLEEP_param.sleep_start,
    sleep_time : SLEEP_param.sleep_time,
    sleep_end : SLEEP_param.sleep_end,
    sleep_planYn : SLEEP_param.sleep_planYn,
    sleep_day : SLEEP_param.sleep_day,
    sleep_regdate : SLEEP_param.sleep_regdate,
    sleep_update : SLEEP_param.sleep_update,
  };

  updateQuery = {
    sleep_start : SLEEP_param.sleep_start,
    sleep_time : SLEEP_param.sleep_time,
    sleep_end : SLEEP_param.sleep_end,
    sleep_planYn : SLEEP_param.sleep_planYn,
    sleep_update : SLEEP_param.sleep_update,
  };

  if (!findResult) {
    createResult = await Sleep.create(
      createQuery
    );
  };
  if (findResult) {
    createResult = await Sleep.updateOne(
      findQuery,
      {$set: updateQuery}
    );
  };

  return createResult;
};

// 4. update -------------------------------------------------------------------------------------->
export const update = async (
  _id_param,
  SLEEP_param
) => {

  let updateQuery;
  let updateResult;

  updateQuery = {
    filter_id : {_id : _id_param},
    filter_set : {$set : SLEEP_param}
  };

  updateResult = await Sleep.updateOne(updateQuery.filter_id, updateQuery.filter_set);

  return updateResult;
};

// 5. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param
) => {

  let deleteQuery;
  let deleteResult;

  deleteQuery = {
    _id: _id_param,
  };

  deleteResult = await Sleep.deleteOne(deleteQuery);

  return deleteResult;
};