// calendarService.js

import mongoose from "mongoose";
import {Calendar} from "../schema/Calendar.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
  };

  findResult = await Calendar.find(findQuery).sort({ _id: -1 }).lean();

  return findResult;
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    _id: _id_param
  };

  findResult = await Calendar.findOne(findQuery).lean();

  return findResult;
};

// 3. insert -------------------------------------------------------------------------------------->
export const insert = async (
  user_id_param,
  CALENDAR_param
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

// 4. update -------------------------------------------------------------------------------------->
export const update = async (
  _id_param,
  CALENDAR_param
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
  ).lean();

  return updateResult;
};

// 5. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param
) => {

  let deleteQuery;
  let deleteResult;
  let finalResult;

  deleteQuery = {
    _id : _id_param
  };

  deleteResult = await Calendar.deleteOne(deleteQuery).lean();

  return deleteResult;
};