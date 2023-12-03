// sleepService.ts
import Sleep from "../schema/Sleep";
import * as mongoose from "mongoose";
import moment from "moment";

// 1-1. sleepList --------------------------------------------------------------------------------->
export const sleepList = async (
  user_id_param: any,
  sleep_dur_param: any,
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const sleepList = await Sleep.find({
    user_id: user_id_param,
    sleep_day : {
      $gte : startDay,
      $lte : endDay,
    },
  }).sort({sleep_day : -1});

  // 배열 리턴
  return sleepList;
};

// 1-2. sleepAvg ---------------------------------------------------------------------------------->
export const sleepAvg = async (
  user_id_param: any,
  sleep_dur_param: any,
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const sleepsInRange = await Sleep.find({
    user_id : user_id_param,
    sleep_day : {
      $gte : startDay,
      $lte : endDay,
    },
  });

  // 데이터가 없는 경우 빈 배열 반환
  if (sleepsInRange.length === 0) {
    return [];
  }

  let totalSleepTime = 0;
  let totalSleepNight = 0;
  let totalSleepMorning = 0;

  sleepsInRange.forEach((sleep) => {
    const [hours, minutes] = sleep.sleep_time.split(":").map(Number);
    totalSleepTime += (hours * 60) + minutes;

    const [nightHours, nightMinutes] = sleep.sleep_night.split(":").map(Number);
    const [morningHours, morningMinutes] = sleep.sleep_morning.split(":").map(Number);
    totalSleepNight += (nightHours * 60) + nightMinutes;
    totalSleepMorning += (morningHours * 60) + morningMinutes;
  });

  const avgSleepTime = moment.utc((totalSleepTime / sleepsInRange.length) * 60000).format("HH:mm");
  const avgSleepNight = moment.utc((totalSleepNight / sleepsInRange.length) * 60000).format("HH:mm");
  const avgSleepMorning = moment.utc((totalSleepMorning / sleepsInRange.length) * 60000).format("HH:mm");

  const sleepAvg = [{
    "avgSleepTime" : avgSleepTime,
    "avgSleepNight" : avgSleepNight,
    "avgSleepMorning" : avgSleepMorning,
  }];

  // 배열 리턴
  return sleepAvg;
};

// 2. sleepDetail --------------------------------------------------------------------------------->
export const sleepDetail = async (
  _id_param : any
) => {
  const sleepDetail = await Sleep.findOne ({
    _id: _id_param,
  });
  return sleepDetail;
};

// 3. sleepInsert --------------------------------------------------------------------------------->
export const sleepInsert = async (
  user_id_param : any,
  SLEEP_param : any
) => {
  const sleepInsert = await Sleep.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    sleep_night : SLEEP_param.sleep_night,
    sleep_morning : SLEEP_param.sleep_morning,
    sleep_time : SLEEP_param.sleep_time,
    sleep_day : SLEEP_param.sleepDay,
    sleep_dur : SLEEP_param.sleep_dur,
    sleep_regdate : SLEEP_param.sleep_regdate,
    sleep_update : SLEEP_param.sleep_update,
  });
  return sleepInsert;
};

// 4. sleepUpdate --------------------------------------------------------------------------------->
export const sleepUpdate = async (
  _id_param : any,
  SLEEP_param : any
) => {
  const sleepUpdate = await Sleep.updateOne (
    {_id : _id_param},
    {$set : SLEEP_param},
  );
  return sleepUpdate;
};

// 5. sleepDelete --------------------------------------------------------------------------------->
export const sleepDelete = async (
  _id_param : any
) => {
  const sleepDelete = await Sleep.deleteOne({
    _id: _id_param,
  });
  return sleepDelete;
};
