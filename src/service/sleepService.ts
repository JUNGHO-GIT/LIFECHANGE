// sleepService.ts
import Sleep from "../schema/Sleep";
import mongoose from "mongoose";
import moment from "moment";

// 1. sleepList ----------------------------------------------------------------------------------->
export const sleepList = async (
  user_id_param: any,
  sleep_duration_param: any,
) => {

  const startDay = sleep_duration_param.split(` ~ `)[0];
  const endDay = sleep_duration_param.split(` ~ `)[1];

  const sleepsInRange = await Sleep.find({
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    },
  });

  let totalSleepTime = 0;
  let totalSleepNight = 0;
  let totalSleepMorning = 0;

  sleepsInRange.forEach((sleep) => {
    // sleep_time 값을 분으로 변환
    const [hours, minutes] = sleep.sleep_time.split(":").map(Number);
    totalSleepTime += (hours * 60) + minutes;

    totalSleepNight += moment.duration(`00:${sleep.sleep_night}`).asMinutes();
    totalSleepMorning += moment.duration(`00:${sleep.sleep_morning}`).asMinutes();
  });

  // sleepsInRange.length = 실제 데이터가 있는 날짜 수
  const averageSleepTime = totalSleepTime / sleepsInRange.length;
  const averageSleepNight = totalSleepNight / sleepsInRange.length;
  const averageSleepMorning = totalSleepMorning / sleepsInRange.length;

  return {
    averageSleepTime : moment.utc(averageSleepTime * 60000).format("HH:mm").toString(),
    averageSleepNight : moment.utc(averageSleepNight * 60000).format("HH:mm").toString(),
    averageSleepMorning : moment.utc(averageSleepMorning * 60000).format("HH:mm").toString(),
  };
};

// 2. sleepDetail --------------------------------------------------------------------------------->
export const sleepDetail = async (_id_param: any) => {
  const sleepDetail = await Sleep.findOne({
    _id: _id_param,
  });
  return sleepDetail;
};

// 4. sleepInsert ------------------------------------------------------------------------------->
export const sleepInsert = async (
    sleep_param: any
  )=> {
  const sleepInsert = await Sleep.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: sleep_param.user_id,
    sleep_title: sleep_param.sleep_title,
    sleep_night: sleep_param.sleep_night,
    sleep_morning: sleep_param.sleep_morning,
    sleep_time: sleep_param.sleep_time,
    sleep_day: sleep_param.sleep_day,
    sleep_list_duration: sleep_param.sleep_list_duration,
    sleep_regdate: sleep_param.sleep_regdate,
    sleep_update: sleep_param.sleep_update,
  });
  return sleepInsert;
};
// 4. sleepUpdate --------------------------------------------------------------------------------->
export const sleepUpdate = async (
  _id_param: any,
  SLEEP_param: any
) => {
  const sleepUpdate = await Sleep.updateOne (
    {_id: _id_param},
    {$set: SLEEP_param},
  );
  return sleepUpdate;
};

// 5. sleepDelete --------------------------------------------------------------------------------->
export const sleepDelete = async (
  _id_param: any
) => {
  const sleepDelete = await Sleep.deleteOne({
    _id: _id_param,
  });
  return sleepDelete;
};
