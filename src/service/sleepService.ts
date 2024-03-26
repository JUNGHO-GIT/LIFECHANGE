// sleepService.ts

import Sleep from "../schema/Sleep";
import * as mongoose from "mongoose";
import moment from "moment";

// 1-0. sleepDash --------------------------------------------------------------------------------->
export const sleepDash = async (
  user_id_param: any
) => {

  let finalResult;
  let listArray:any = [];
  let avgArray:any = [];

  const findSleepList = async (startDay: string, endDay: string) => {
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

    let mergedData:any = [];
    if (listPlanN.length > 0 || listPlanY.length > 0) {
      const allSleepDays
        = [...listPlanN, ...listPlanY]
        .map(item => item.sleep_day)
        .filter((value, index, self) => self.indexOf(value) === index);

      mergedData = allSleepDays.map(sleep_day => {
        const listItem = listPlanN.find((item:any) => item.sleep_day === sleep_day);
        const planItem = listPlanY.find((item:any) => item.sleep_day === sleep_day);
        return {
          sleep_day: sleep_day,
          sleep_night_real: listItem?.sleep_night || "00:00",
          sleep_time_real: listItem?.sleep_time || "00:00",
          sleep_morning_real: listItem?.sleep_morning || "00:00",
          sleep_night_plan: planItem?.sleep_night || "00:00",
          sleep_time_plan: planItem?.sleep_time || "00:00",
          sleep_morning_plan: planItem?.sleep_morning || "00:00",
        };
      });
    }

    return mergedData;
  };

  const findSleepAvg = async (name: string, startDay: string, endDay: string) => {
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
      const [nightHours, nightMinutes] = sleep.sleep_night.split(":").map(Number);
      const [morningHours, morningMinutes] = sleep.sleep_morning.split(":").map(Number);
      total_time_real += (hours * 60) + minutes;
      total_night_real += (nightHours * 60) + nightMinutes;
      total_morning_real += (morningHours * 60) + morningMinutes;
    });

    listPlanY.forEach((sleep) => {
      const [hours, minutes] = sleep.sleep_time.split(":").map(Number);
      const [nightHours, nightMinutes] = sleep.sleep_night.split(":").map(Number);
      const [morningHours, morningMinutes] = sleep.sleep_morning.split(":").map(Number);
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

// 1-1. sleepList --------------------------------------------------------------------------------->
export const sleepList = async (
  user_id_param: any,
  sleep_dur_param: any,
  planYn_param: any,
  filter_param: any,
) => {

  let totalCount;
  let findQuery;
  let findResult;
  let finalResult;

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  // plan : Y, N
  let filterPlan = planYn_param;

  // asc, desc
  let order = filter_param.order;

  // paging
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;

  findQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    },
    sleep_planYn: filterPlan,
  };

  // asc, desc 정렬
  let sortCondition = {};
  if (order === "asc") {
    sortCondition = { sleep_day: 1 };
  }
  else {
    sortCondition = { sleep_day: -1 };
  }

  // totalCount
  totalCount = await Sleep
    .countDocuments(findQuery);

  // .find()에 정렬, 페이징 처리 추가
  findResult = await Sleep
    .find(findQuery)
    .sort(sortCondition)
    .skip((page - 1) * limit)
    .limit(limit);

  finalResult = {
    totalCount: totalCount,
    sleepList: findResult,
  };

  return finalResult;
};

// 2. sleepDetail --------------------------------------------------------------------------------->
export const sleepDetail = async (
  _id_param : any
) => {

  let findQuery;
  let findResult;

  findQuery = {
    _id: _id_param,
  };

  findResult = await Sleep.findOne(findQuery);

  return findResult;
};

// 3-1. sleepCheckInsert -------------------------------------------------------------------------->
export const sleepCheckInsert = async (
  user_id_param: any,
  SLEEP_param : any
) => {

  let findQuery;
  let findResult;

  findQuery = {
    user_id: user_id_param,
    sleep_day: SLEEP_param.sleepDay,
    sleep_planYn: SLEEP_param.sleep_planYn,
  };

  findResult = await Sleep.findOne(findQuery);

  return findResult;
};

// 3-2. sleepInsert ------------------------------------------------------------------------------->
export const sleepInsert = async (
  user_id_param : any,
  SLEEP_param : any
) => {

  let createQuery;
  let createResult;

  createQuery = {
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    sleep_night: SLEEP_param.sleep_night,
    sleep_morning: SLEEP_param.sleep_morning,
    sleep_time: SLEEP_param.sleep_time,
    sleep_planYn: SLEEP_param.sleep_planYn,
    sleep_day: SLEEP_param.sleepDay,
    sleep_dur: SLEEP_param.sleep_dur,
    sleep_regdate: SLEEP_param.sleep_regdate,
    sleep_update: SLEEP_param.sleep_update,
  };

  createResult = await Sleep.create(createQuery);

  return createResult;
};

// 4. sleepUpdate --------------------------------------------------------------------------------->
export const sleepUpdate = async (
  _id_param : any,
  SLEEP_param : any
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

// 5. sleepDelete --------------------------------------------------------------------------------->
export const sleepDelete = async (
  _id_param : any
) => {

  let deleteQuery;
  let deleteResult;

  deleteQuery = {
    _id: _id_param,
  };

  deleteResult = await Sleep.deleteOne(deleteQuery);

  return deleteResult;
};