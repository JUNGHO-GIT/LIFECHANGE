// sleepService.ts

import Sleep from "../schema/Sleep";
import * as mongoose from "mongoose";
import moment from "moment";

// 1-1. sleepList --------------------------------------------------------------------------------->
export const sleepList = async (
  user_id_param: any,
  sleep_dur_param: any,
  filter_param: any,
) => {

  let findQuery;
  let findResult;
  let finalResult;

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const page = filter_param.page;
  const limit = filter_param.limit;

  // number, day
  let filterPre = filter_param.filterPre;

  // asc, desc
  let filterSub = filter_param.filterSub;

  findQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  // 번호순 asc, desc 정렬, 날짜순 asc, desc 정렬
  let sortCondition = {};
  if (filterPre === "number") {
    sortCondition = {sleep_number: filterSub};
  }
  else if (filterPre === "day") {
    sortCondition = {sleep_day: filterSub};
  }

  const totalCount = await Sleep.countDocuments(findQuery);

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

  // 배열 리턴
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

// 3. sleepInsert --------------------------------------------------------------------------------->
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

  updateResult = await SLEEP_param.updateOne(
    updateQuery.filter_id,
    updateQuery.filter_set
  );

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