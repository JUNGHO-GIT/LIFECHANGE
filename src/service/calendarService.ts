// calendarService.ts
import Calendar from "../schema/Calendar";
import * as mongoose from "mongoose";

// 1. calendarList -------------------------------------------------------------------------------->
export const calendarList = async (
) => {
  const calendarList = await Calendar.find();
  return calendarList;
};

// 2. calendarDetail ------------------------------------------------------------------------------>
export const calendarDetail = async (
  _id_param : any
) => {
  const calendarDetail = await Calendar.findOne ({
    _id : _id_param,
  });
  return calendarDetail;
};

// 3. calendarInsert ------------------------------------------------------------------------------>
export const calendarInsert = async (
  calendar_param : any
) => {
  const calendarInsert = await Calendar.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : calendar_param.user_id,
    calendar_title : calendar_param.calendar_title,
    calendar_content : calendar_param.calendar_content,
    calendar_date : calendar_param.calendar_date,
  });
  return calendarInsert;
};

// 4. calendarUpdate ------------------------------------------------------------------------------>
export const calendarUpdate = async (
  _id_param : any,
  calendar_param : any
) => {
  const calendarUpdate = await Calendar.updateOne(
    { _id : _id_param }, // Query
    { $set : calendar_param } // Update
  );

  return calendarUpdate;
};

// 5. calendarDelete ------------------------------------------------------------------------------>
export const calendarDelete = async (
  _id_param : any
) => {
  const calendarDelete = await Calendar.deleteOne({
    _id : _id_param,
  });
  return calendarDelete;
};
