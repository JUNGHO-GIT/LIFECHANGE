// sleepService.ts
import Sleep from "../schema/Sleep";
import * as mongoose from "mongoose";
import moment from "moment";

// 1-1. sleepList --------------------------------------------------------------------------------->
export const sleepList = async (
  user_id_param:any,
  sleep_dur_param:any,
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const sleepList = await Sleep.find({
    user_id: user_id_param,
    sleepDay: {
      $gte: startDay,
      $lte: endDay,
    },
  }).sort({sleepDay: -1});

  return sleepList;
};

// 1-2. sleepAvg ------------------------------------------------------------------------------>
export const sleepAvg = async (
  user_id_param:any,
  sleep_dur_param:any,
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const sleepsInRange = await Sleep.find({
    user_id : user_id_param,
    sleepDay : {
      $gte: startDay,
      $lte: endDay,
    },
  });

  let totalSleepTime = 0;
  let totalSleepNight = 0;
  let totalSleepMorning = 0;

  sleepsInRange.forEach((sleep) => {

    const [hours, minutes] = sleep.sleep_time.split(":").map(Number);
    totalSleepTime += (hours * 60) + minutes;

    totalSleepNight += moment.duration(`00:${sleep.sleep_night}`).asMinutes();
    totalSleepMorning += moment.duration(`00:${sleep.sleep_morning}`).asMinutes();
  });

  const avgSleepTime = totalSleepTime / sleepsInRange.length;
  const avgSleepNight = totalSleepNight / sleepsInRange.length;
  const avgSleepMorning = totalSleepMorning / sleepsInRange.length;

  return {
    avgSleepTime : moment.utc(avgSleepTime * 60000).format("HH:mm").toString(),
    avgSleepNight : moment.utc(avgSleepNight * 60000).format("HH:mm").toString(),
    avgSleepMorning : moment.utc(avgSleepMorning * 60000).format("HH:mm").toString(),
  };
};

// 2. sleepDetail --------------------------------------------------------------------------------->
export const sleepDetail = async (
  _id_param:any
) => {
  const sleepDetail = await Sleep.findOne ({
    _id: _id_param,
  });
  return sleepDetail;
};

// 3. sleepInsert --------------------------------------------------------------------------------->
export const sleepInsert = async (
  user_id_param:any,
  SLEEP_param:any
) => {
  const sleepInsert = await Sleep.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    sleep_night : SLEEP_param.sleep_night,
    sleep_morning : SLEEP_param.sleep_morning,
    sleep_time : SLEEP_param.sleep_time,
    sleepDay : SLEEP_param.sleepDay,
    sleep_dur : SLEEP_param.sleep_dur,
    sleep_regdate : SLEEP_param.sleep_regdate,
    sleep_update : SLEEP_param.sleep_update,
  });
  return sleepInsert;
};

// 4. sleepUpdate --------------------------------------------------------------------------------->
export const sleepUpdate = async (
  _id_param:any,
  SLEEP_param:any
) => {
  const sleepUpdate = await Sleep.updateOne (
    {_id: _id_param},
    {$set: SLEEP_param},
  );
  return sleepUpdate;
};

// 5. sleepDelete --------------------------------------------------------------------------------->
export const sleepDelete = async (
  _id_param:any
) => {
  const sleepDelete = await Sleep.deleteOne({
    _id: _id_param,
  });
  return sleepDelete;
};
