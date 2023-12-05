// calendarService.ts
import Calendar from "../schema/Calendar";
import * as mongoose from "mongoose";

// 1. calendarList -------------------------------------------------------------------------------->
export const calendarList = async (
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
  };

  findResult = await Calendar.find(findQuery).sort({ _id: -1 });

  return findResult;
};

// 2. calendarDetail ------------------------------------------------------------------------------>
export const calendarDetail = async (
  _id_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    _id: _id_param
  };

  findResult = await Calendar.findOne(findQuery);

  return findResult;
};

// 3. calendarInsert ------------------------------------------------------------------------------>
export const calendarInsert = async (
  user_id_param: any,
  CALENDAR_param: any
) => {

  let createQuery;
  let createResult;
  let finalResult;

  createQuery = {
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    calendar_title : CALENDAR_param.calendar_title,
    calendar_content : CALENDAR_param.calendar_content,
    calendar_date : CALENDAR_param.calendar_date,
  };

  createResult = await Calendar.create(createQuery);

  return createResult;
};

// 4. calendarUpdate ------------------------------------------------------------------------------>
export const calendarUpdate = async (
  _id_param: any,
  CALENDAR_param: any
) => {

  let updateQuery;
  let updateResult;
  let finalResult;

  updateQuery = {
    filter_id : {_id : _id_param},
    filter_set : {$set : CALENDAR_param}
  };

  updateResult = await CALENDAR_param.updateOne(
    updateQuery.filter_id,
    updateQuery.filter_set
  );

  return updateResult;
};

// 5. calendarDelete ------------------------------------------------------------------------------>
export const calendarDelete = async (
  _id_param: any
) => {

  let deleteQuery;
  let deleteResult;
  let finalResult;

  deleteQuery = {
    _id : _id_param
  };

  deleteResult = await Calendar.deleteOne(deleteQuery);

  return deleteResult;
};