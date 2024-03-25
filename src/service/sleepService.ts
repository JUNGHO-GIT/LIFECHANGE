// sleepService.ts

import Sleep from "../schema/Sleep";
import * as mongoose from "mongoose";
import moment from "moment";

// 1-0. sleepDash --------------------------------------------------------------------------------->
export const sleepDash = async (
  user_id_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  const findSleepData = async (startDay: string, endDay: string) => {
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

  // 오늘
  const todayList = await findSleepData (
    moment().format("YYYY-MM-DD"),
    moment().format("YYYY-MM-DD")
  );

  // 이번주
  const weekList = await findSleepData (
    moment().startOf("week").format("YYYY-MM-DD"),
    moment().endOf("week").format("YYYY-MM-DD")
  );

  // 이번달
  const monthList = await findSleepData (
    moment().startOf("month").format("YYYY-MM-DD"),
    moment().endOf("month").format("YYYY-MM-DD")
  );

  finalResult = {
    todayList: todayList,
    weekList: weekList,
    monthList: monthList,
  };

  console.log("===============================================");
  console.log("finalResult : " + JSON.stringify(finalResult));
  console.log("===============================================");

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
  let filterSub = filter_param.filterSub;

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
  if (filterSub === "asc") {
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

// 1-2. sleepAvg ---------------------------------------------------------------------------------->
export const sleepAvg = async (
  user_id_param: any,
  sleep_dur_param: any,
) => {

  let findQuery;
  let findResult;
  let finalResult;

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  findQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  findResult = await Sleep.find(findQuery).sort({ sleep_day: -1 });

  // 데이터가 없는 경우 빈 배열 반환
  if (findResult.length === 0) {
    return [];
  }

  let totalSleepTime = 0;
  let totalSleepNight = 0;
  let totalSleepMorning = 0;

  findResult.forEach((sleep) => {
    const [hours, minutes] = sleep.sleep_time.split(":").map(Number);
    const [nightHours, nightMinutes] = sleep.sleep_night.split(":").map(Number);
    const [morningHours, morningMinutes] = sleep.sleep_morning.split(":").map(Number);
    totalSleepTime += (hours * 60) + minutes;
    totalSleepNight += (nightHours * 60) + nightMinutes;
    totalSleepMorning += (morningHours * 60) + morningMinutes;
  });

  const avgSleepTime = moment.utc((totalSleepTime / findResult.length) * 60000).format("HH:mm");
  const avgSleepNight = moment.utc((totalSleepNight / findResult.length) * 60000).format("HH:mm");
  const avgSleepMorning = moment.utc((totalSleepMorning / findResult.length) * 60000).format("HH:mm");

  finalResult = [{
    "avgSleepTime" : avgSleepTime,
    "avgSleepNight" : avgSleepNight,
    "avgSleepMorning" : avgSleepMorning,
  }];

  return finalResult;
};

// 2. sleepDetail --------------------------------------------------------------------------------->
export const sleepDetail = async (
  _id_param : any
) => {

  let findQuery;
  let findResult;
  let finalResult;

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
  let finalResult;

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
  let finalResult;

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
  let finalResult;

  updateQuery = {
    filter_id : {_id : _id_param},
    filter_set : {$set : SLEEP_param}
  };

  updateResult = await Sleep.updateOne(updateQuery.filter_id, updateQuery.filter_set);

  console.log("===============================================");
  console.log("_id : " + _id_param);
  console.log("SLEEP : " + JSON.stringify(updateResult));
  console.log("===============================================");

  return updateResult;
};

// 5. sleepDelete --------------------------------------------------------------------------------->
export const sleepDelete = async (
  _id_param : any
) => {

  let deleteQuery;
  let deleteResult;
  let finalResult;

  deleteQuery = {
    _id: _id_param,
  };

  deleteResult = await Sleep.deleteOne(deleteQuery);

  return deleteResult;
};