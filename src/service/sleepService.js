// sleepService.js

import mongoose from "mongoose";
import moment from "moment";
import {Sleep} from "../schema/Sleep.js";

// 0-1. dash(bar) --------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
) => {

  const dataFields = {
    "취침": { plan: "sleep_night", real: "sleep_night" },
    "기상": { plan: "sleep_morning", real: "sleep_morning" },
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

  let finalResult = [];
  for (let key in dataFields) {
    const findResult = await Sleep.findOne({
      user_id: user_id_param,
      sleep_date: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
    }).lean();

    finalResult.push({
      name: key,
      목표: fmtData(
        findResult?.sleep_plan?.sleep_section?.map((item) => item[dataFields[key].plan]).join(":")
      ),
      실제: fmtData(
        findResult?.sleep_real?.sleep_section?.map((item) => item[dataFields[key].real]).join(":")
      ),
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

  const names = [
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

  let finalResult = [];
  for (let i = 0; i < 7; i++) {
    const findResult = await Sleep.findOne({
      user_id: user_id_param,
      sleep_date: moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days").format("YYYY-MM-DD"),
    }).lean();

    finalResult.push({
      name: names[i],
      취침: fmtData(
        findResult?.sleep_real?.sleep_section?.map((item) => item.sleep_night).join(":")
      ),
      기상: fmtData(
        findResult?.sleep_real?.sleep_section?.map((item) => item.sleep_morning).join(":")
      ),
      수면: fmtData(
        findResult?.sleep_real?.sleep_section?.map((item) => item.sleep_time).join(":")
      ),
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

  let sumSleepStart = Array(5).fill(0);
  let sumSleepEnd = Array(5).fill(0);
  let sumSleepTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const names = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
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
    const findResult = await Sleep.findOne({
      user_id: user_id_param,
      sleep_date: moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days").format("YYYY-MM-DD"),
    }).lean();

    if (findResult) {
      const weekNum = Math.max(moment(findResult.sleep_date).week() - moment(findResult.sleep_date).startOf("month").week() + 1);
      sumSleepStart[weekNum - 1] += fmtData(
        findResult?.sleep_real?.sleep_section?.map((item) => item.sleep_night).join(":")
      );
      sumSleepEnd[weekNum - 1] += fmtData(
        findResult?.sleep_real?.sleep_section?.map((item) => item.sleep_morning).join(":")
      );
      sumSleepTime[weekNum - 1] += fmtData(
        findResult?.sleep_real?.sleep_section?.map((item) => item.sleep_time).join(":")
      );
      countRecords[weekNum - 1]++;
    }
  };

  let finalResult = [];
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

  let sumSleepStart = Array(12).fill(0);
  let sumSleepEnd = Array(12).fill(0);
  let sumSleepTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const names = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
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

  for (
    let m = moment(moment().tz("Asia/Seoul").startOf("year"));
    m.isBefore(moment().tz("Asia/Seoul").endOf("year"));
    m.add(1, "days")
  ) {
    const findResult = await Sleep.findOne({
      user_id: user_id_param,
      sleep_date: m.format("YYYY-MM-DD"),
    }).lean();

    if (findResult) {
      const monthNum = m.month();
      sumSleepStart[monthNum] += fmtData(
        findResult?.sleep_real?.sleep_section?.map((item) => item.sleep_night).join(":")
      );
      sumSleepEnd[monthNum] += fmtData(
        findResult?.sleep_real?.sleep_section?.map((item) => item.sleep_morning).join(":")
      );
      sumSleepTime[monthNum] += fmtData(
        findResult?.sleep_real?.sleep_section?.map((item) => item.sleep_time).join(":")
      );
      countRecords[monthNum]++;
    }
  };

  let finalResult = [];
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
  filter_param,
  paging_param,
  planYn_param
) => {

  const [startDay, endDay] = sleep_dur_param.split(` ~ `);
  const part = filter_param.part || "전체";
  const sort = filter_param.order === "asc" ? 1 : -1;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;
  const page = paging_param.page === 0 ? 1 : paging_param.page;
  const planYn = planYn_param === "Y" ? "sleep_plan" : "sleep_real";

  const findResult = await Sleep.find({
    user_id: user_id_param,
    sleep_date: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .sort({ sleep_date: sort })
  .lean();

  let totalCount = 0;
  const finalResult = findResult.map((sleep) => {
    if (sleep[planYn] && sleep[planYn].sleep_section) {
      let sections = sleep[planYn].sleep_section.filter((section) => (
        part === "전체" ? true : section.sleep_part === part
      ));

      // 배열 갯수 누적 계산
      totalCount += sections.length;

      // section 배열에서 페이지에 맞는 항목만 선택합니다.
      const startIdx = (limit * page - 1) - (limit - 1);
      const endIdx = (limit * page);
      sections = sections.slice(startIdx, endIdx);

      sleep[planYn].sleep_section = sections;
    }
    return sleep;
  });

  return {
    totalCount: totalCount,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  sleep_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = sleep_dur_param.split(` ~ `);
  const planYn = planYn_param === "Y" ? "sleep_plan" : "sleep_real";

  const finalResult = await Sleep.findOne({
    _id: _id_param === "" ? { $exists: true } : _id_param,
    user_id: user_id_param,
    sleep_date: {
      $gte: startDay,
      $lte: endDay,
    },
  }).lean();

  const sectionCount = finalResult?.[planYn]?.sleep_section?.length || 0;

  return {
    sectionCount: sectionCount,
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

  const [startDay, endDay] = sleep_dur_param.split(` ~ `);
  const planYn = planYn_param === "Y" ? "sleep_plan" : "sleep_real";

  const findResult = await Sleep.findOne({
    user_id: user_id_param,
    sleep_date: {
      $gte: startDay,
      $lte: endDay,
    },
  }).lean();

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      sleep_date: startDay,
      [planYn]: SLEEP_param[planYn],
      sleep_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      sleep_update: "",
    };
    finalResult = await Sleep.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        [planYn]: SLEEP_param[planYn],
        sleep_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      }
    };
    finalResult = await Sleep.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  sleep_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = sleep_dur_param.split(` ~ `);
  const planYn = planYn_param === "Y" ? "sleep_plan" : "sleep_real";

  const updateResult = await Sleep.updateOne(
    {
      user_id: user_id_param,
      sleep_date: {
        $gte: startDay,
        $lte: endDay,
      },
    },
    {
      $pull: {
        [`${planYn}.sleep_section`]: {
          _id: _id_param
        },
      },
      $set: {
        sleep_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    },
    {
      arrayFilters: [{
        "elem._id": _id_param
      }],
    }
  ).lean();

  let finalResult;
  if (updateResult.modifiedCount > 0) {
    const doc = await Sleep.findOne({
      user_id: user_id_param,
      sleep_date: {
        $gte: startDay,
        $lte: endDay,
      },
    }).lean();

    if (
      (doc) &&
      (!doc[planYn]?.sleep_section || doc[planYn]?.sleep_section?.length === 0)
    ) {
      finalResult = await Sleep.deleteOne({
        _id: doc._id
      }).lean();
    }
  }

  return {
    result: finalResult
  };
};
