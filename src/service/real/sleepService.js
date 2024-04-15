// sleepService.js

import moment from "moment";
import * as repository from "../../repository/real/sleepRepository.js";

// 0. common -------------------------------------------------------------------------------------->
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

// 0-2. format ------------------------------------------------------------------------------------>
const dateFormat = (data) => {
  if (!data) {
    return 0;
  }
  else {
    const time = data.split(":");
    return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
  }
};
const intFormat = (data) => {
  if (!data) {
    return 0;
  }
  else if (typeof data === "string") {
    const toInt = parseInt(data, 10);
    return Math.round(toInt);
  }
  else {
    return Math.round(data);
  }
};

// 0-1. dash (bar) -------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
) => {

  const dataFields = {
    "취침": {
      plan: "sleep_plan_night",
      real: "sleep_night"
    },
    "기상": {
      plan: "sleep_plan_morning",
      real: "sleep_morning"
    },
    "수면": {
      plan: "sleep_plan_time",
      real: "sleep_time"
    },
  };

  let finalResult = [];
  for (let key in dataFields) {
    const findResultPlan = await SleepPlan.findOne({
      user_id: user_id_param,
      sleep_plan_startDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
      sleep_plan_endDt: {
        $gte: koreanDate,
        $lte: koreanDate
      }
    })
    .lean();
    const findResultReal = await Sleep.findOne({
      user_id: user_id_param,
      sleep_startDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
      sleep_endDt: {
        $gte: koreanDate,
        $lte: koreanDate
      }
    })
    .lean();

    finalResult.push({
      name: key,
      목표: dateFormat(findResultPlan?.[dataFields[key].plan]),
      실제: dateFormat(findResultReal?.sleep_section?.map((item) => item[dataFields[key].real]).join(":")
      ),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-3. dash (line) ------------------------------------------------------------------------------->
export const dashLine = async (
  user_id_param
) => {

  const names = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  let finalResult = [];
  for (let i in names) {
    const date = moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days");
    const findResult = await Sleep.findOne({
      user_id: user_id_param,
      sleep_startDt: date.format("YYYY-MM-DD"),
      sleep_endDt: date.format("YYYY-MM-DD"),
    })
    .lean();

    finalResult.push({
      name: `${names[i]} ${date.format("MM/DD")}`,
      취침: dateFormat(
        findResult?.sleep_section?.map((item) => (item.sleep_night)).join(":")
      ),
      기상: dateFormat(
        findResult?.sleep_section?.map((item) => (item.sleep_morning)).join(":")
      ),
      수면: dateFormat(
        findResult?.sleep_section?.map((item) => (item.sleep_time)).join(":")
      ),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash (avg-week) --------------------------------------------------------------------------->
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

  const curMonthStart = moment().tz("Asia/Seoul").startOf('month');
  const curMonthEnd = moment().tz("Asia/Seoul").endOf('month');

  for (
    let w = curMonthStart.clone();
    w.isBefore(curMonthEnd);
    w.add(1, "days")
  ) {
    const weekNum = w.week() - curMonthStart.week() + 1;

    if (weekNum >= 1 && weekNum <= 5) {
      const findResult = await Sleep.findOne({
        user_id: user_id_param,
        sleep_startDt: w.format("YYYY-MM-DD"),
        sleep_endDt: w.format("YYYY-MM-DD"),
      }).lean();

      if (findResult) {
        sumSleepStart[weekNum - 1] += dateFormat(
          findResult?.sleep_section?.map((item) => (item.sleep_night)).join(":")
        );
        sumSleepEnd[weekNum - 1] += dateFormat(
          findResult?.sleep_section?.map((item) => (item.sleep_morning)).join(":")
        );
        sumSleepTime[weekNum - 1] += dateFormat(
          findResult?.sleep_section?.map((item) => (item.sleep_time)).join(":")
        );
        countRecords[weekNum - 1]++;
      }
    }
  };

  let finalResult = [];
  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: `${names[i]}`,
      취침: countRecords[i] > 0 ? (sumSleepStart[i] / countRecords[i]).toFixed(1) : "0",
      기상: countRecords[i] > 0 ? (sumSleepEnd[i] / countRecords[i]).toFixed(1) : "0",
      수면: countRecords[i] > 0 ? (sumSleepTime[i] / countRecords[i]).toFixed(1) : "0",
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash (avg-month) -------------------------------------------------------------------------->
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

  const curMonthStart = moment().tz("Asia/Seoul").startOf('month');
  const curMonthEnd = moment().tz("Asia/Seoul").endOf('month');

  for (
    let m = curMonthStart.clone();
    m.isBefore(curMonthEnd);
    m.add(1, "days")
  ) {
    const monthNum = m.month();

    const findResult = await Sleep.findOne({
      user_id: user_id_param,
      sleep_startDt: m.format("YYYY-MM-DD"),
      sleep_endDt: m.format("YYYY-MM-DD"),
    })
    .lean();

    if (findResult) {
      sumSleepStart[monthNum] += dateFormat(
        findResult?.sleep_section?.map((item) => (item.sleep_night)).join(":")
      );
      sumSleepEnd[monthNum] += dateFormat(
        findResult?.sleep_section?.map((item) => (item.sleep_morning)).join(":")
      );
      sumSleepTime[monthNum] += dateFormat(
        findResult?.sleep_section?.map((item) => (item.sleep_time)).join(":")
      );
      countRecords[monthNum]++;
    }
  };

  let finalResult = [];
  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: names[i],
      취침: countRecords[i] > 0 ? (sumSleepStart[i] / countRecords[i]).toFixed(1) : "0",
      기상: countRecords[i] > 0 ? (sumSleepEnd[i] / countRecords[i]).toFixed(1) : "0",
      수면: countRecords[i] > 0 ? (sumSleepTime[i] / countRecords[i]).toFixed(1) : "0",
    });
  };

  return {
    result: finalResult,
  };
};

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  sleep_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDt, endDt] = sleep_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = parseInt(FILTER_param.limit) === 0 ? 5 : parseInt(FILTER_param.limit);
  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);

  const totalCnt = await repository.totalCnt(
    user_id_param, startDt, endDt
  );

  const finalResult = await repository.findReal(
    user_id_param, sort, limit, page, startDt, endDt
  );

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  sleep_dur_param
) => {

  const [startDt, endDt] = sleep_dur_param.split(` ~ `);

  const finalResult = await repository.detail(
    _id_param, user_id_param, startDt, endDt
  );

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  SLEEP_param,
  sleep_dur_param
) => {

  const [startDt, endDt] = sleep_dur_param.split(` ~ `);

  const findResult = await repository.detail(
    "", user_id_param, startDt, endDt
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.create(
      user_id_param, SLEEP_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.update(
      findResult._id, SLEEP_param
    );
  }

  return {
    result: finalResult
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  sleep_dur_param
) => {

  const [startDt, endDt] = sleep_dur_param.split(` ~ `);

  const finalResult = await repository.deletes(
    _id_param, user_id_param, startDt, endDt
  );

  return {
    result: finalResult
  };
};