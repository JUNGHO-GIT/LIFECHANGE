// calendarService.ts
import Calendar from "../schema/Calendar";
import * as mongoose from "mongoose";

// 1. calendarList -------------------------------------------------------------------------------->
export const calendarList = async (
) => {
  const calendarList = await Calendar.find (
  );
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
  user_id_param : any,
  CALENDAR_param : any
) => {
  const calendarInsert = await Calendar.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    calendar_title : CALENDAR_param.calendar_title,
    calendar_content : CALENDAR_param.calendar_content,
    calendar_date : CALENDAR_param.calendar_date,
  });
  return calendarInsert;
};

// 4. calendarUpdate ------------------------------------------------------------------------------>
export const calendarUpdate = async (
  _id_param : any,
  CALENDAR_param : any
) => {
  const calendarUpdate = await Calendar.updateOne (
    {_id : _id_param},
    {$set : CALENDAR_param}
  );
  return calendarUpdate;
};

// 5. calendarDelete ------------------------------------------------------------------------------>
export const calendarDelete = async (
  _id_param : any
) => {
  const calendarDelete = await Calendar.deleteOne ({
    _id : _id_param,
  });
  return calendarDelete;
};
