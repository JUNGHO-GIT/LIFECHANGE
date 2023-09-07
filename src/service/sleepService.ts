// sleepService.ts
import Sleep from "../schema/Sleep";
import * as mongoose from "mongoose";
import moment from "moment-timezone";

// 1. sleepList ----------------------------------------------------------------------------------->
export const sleepList = async (
  user_id_param : any,
  sleep_day_param : any
) => {
  const sleepList = await Sleep.find ({
    user_id : user_id_param,
    sleep_day : sleep_day_param
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

  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD").toString();

  // 1. getWeek ---------------------------------------------------------------------------------->
  const getWeek = () => {

    const currentMonth = koreanDate.split('-')[1];
    const currentRegdate = sleep_param.sleep_day;

    let weekValue;
    for(let i = 1; i <= 5; i++) {

      // 월요일
      const startOfWeek = moment().startOf('week').add(1, 'days');
      const startString = startOfWeek.format('YYYY-MM-DD').toString();

      // 목요일
      const thursdayOfWeek = moment().startOf('week').add(4, 'days');
      const thursdayMonth = thursdayOfWeek.format('MM').toString();

      // 일요일
      const endOfWeek = moment().endOf('week');
      const endString = endOfWeek.format('YYYY-MM-DD').toString();

      if (thursdayMonth === currentMonth) {
        if (currentRegdate >= startString && currentRegdate <= endString) {
          weekValue = `${i}번째 주: ${startString} ~ ${endString}`;
          break;
        }
      }
    }
    return weekValue;
  }
  // 2. getMonth --------------------------------------------------------------------------------->
  const getMonth = () => {
    const monthValue = koreanDate.split('-')[1];
    return monthValue;
  }

  // 3. getYear ---------------------------------------------------------------------------------->
  const getYear = () => {
    const yearValue = koreanDate.split('-')[0];
    return yearValue;
  }

  // 4. sleepInsert ------------------------------------------------------------------------------->
  const sleepInsert = await Sleep.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : sleep_param.user_id,
    sleep_title : sleep_param.sleep_title,
    sleep_night : sleep_param.sleep_night,
    sleep_morning : sleep_param.sleep_morning,
    sleep_time : sleep_param.sleep_time,
    sleep_day : sleep_param.sleep_day,
    sleep_week : getWeek(),
    sleep_month : getMonth(),
    sleep_year : getYear(),
    sleep_regdate : sleep_param.sleep_regdate,
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
