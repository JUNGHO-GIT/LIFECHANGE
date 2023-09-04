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
  _id_param : any,
  user_id_param : any,
  sleep_regdate_param : any
) => {
  const sleepDetail = await Sleep.findOne ({
    _id : _id_param,
    user_id : user_id_param,
    sleep_regdate : sleep_regdate_param
  });
  return sleepDetail;
};

// 3. sleepInsert --------------------------------------------------------------------------------->
export const sleepInsert = async (
  sleep_param : any
) => {
  const sleepInsert = await Sleep.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : sleep_param.user_id,
    sleep_title : sleep_param.sleep_title,
    sleep_night : sleep_param.sleep_night,
    sleep_morning : sleep_param.sleep_morning,
    sleep_time : sleep_param.sleep_time,
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
  const sleepUpdate = await Sleep.updateOne(
    { _id : _id_param }, // Query
    { $set : sleep_param } // Update
  );

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
