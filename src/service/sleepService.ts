// sleepService.ts
import Sleep from "../schema/Sleep";
import * as mongoose from "mongoose";

// 1. sleepList ----------------------------------------------------------------------------------->
export const sleepList = async (
  user_id_param : any,
  sleep_regdate_param : any
) => {
  const sleepList = await Sleep.find ({
    user_id : user_id_param,
    sleep_regdate : sleep_regdate_param
  });
  return sleepList;
};

// 2. sleepDetail --------------------------------------------------------------------------------->
export const sleepDetail = async (
  _id_param : any
) => {
  const sleepDetail = await Sleep.findOne ({
    _id : _id_param
  });
  return sleepDetail;
};

// 3. sleepInsert --------------------------------------------------------------------------------->
export const sleepInsert = async (
  sleep_param : any
) => {

  // week 관련 로직 추가
  function getWeek() {
    const date = new Date();
    date.setHours(date.getHours() + 9);
    const currentMonth = date.toISOString().split('T')[0].split('-')[1];
    const currentRegdate = sleep_param.sleep_regdate;

    let weekStr;

    for(let i = 1; i <= 5; i++) {

      // 월요일
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay() + (i * 7) - 5);
      const startString = startOfWeek.toISOString().split('T')[0];

      // 목요일
      const thursday = new Date(startOfWeek);
      thursday.setDate(startOfWeek.getDate() + 3);
      const thursdayString = thursday.toISOString().split('T')[0];
      const thursdayMonth = thursdayString.split('-')[1];

      // 일요일
      const endOfWeek = new Date(date);
      endOfWeek.setDate(date.getDate() - date.getDay() + (i * 7) + 1);
      const endString = endOfWeek.toISOString().split('T')[0];

      if (thursdayMonth === currentMonth) {
        if (currentRegdate >= startString && currentRegdate <= endString) {
          weekStr = `${i}번째 주: ${startString} ~ ${endString}`;
          break;
        }
      }
    }
    return weekStr;
  }

  const sleepInsert = await Sleep.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : sleep_param.user_id,
    sleep_title : sleep_param.sleep_title,
    sleep_night : sleep_param.sleep_night,
    sleep_morning : sleep_param.sleep_morning,
    sleep_time : sleep_param.sleep_time,
    sleep_regdate : sleep_param.sleep_regdate,
    sleep_week : getWeek(),
    sleep_update : sleep_param.sleep_update
  });
  return sleepInsert;
};

// 4. sleepUpdate --------------------------------------------------------------------------------->
export const sleepUpdate = async (
  _id_param : any,
  sleep_param : any
) => {
  const sleepUpdate = await Sleep.updateOne ({
    _id : _id_param,
    $set : sleep_param
  });
  return sleepUpdate;
};

// 5. sleepDelete --------------------------------------------------------------------------------->
export const sleepDelete = async (
  _id_param : any
) => {
  const sleepDelete = await Sleep.deleteOne ({
    _id : _id_param,
  });
  return sleepDelete;
};
