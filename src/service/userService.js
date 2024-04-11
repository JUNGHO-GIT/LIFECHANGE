// userService.js

import mongoose from "mongoose";
import {User} from "../schema/User.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
  };

  findResult = await User.find(findQuery).sort({ _id: -1 })
    .lean();

  return findResult;
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  user_id_param
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    user_id : user_id_param
  };

  findResult = await User.findOne(findQuery).lean();

  return findResult;
};

// 3-1. checkId ----------------------------------------------------------------------------------->
export const checkId = async (
  user_id_param
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    user_id : user_id_param
  };

  findResult = await User.findOne(findQuery).lean();

  return findResult;
};

// 3-2. insert ------------------------------------------------------------------------------------>
export const insert = async (
  user_id_param,
  user_pw_param
) => {

  let createQuery;
  let createResult;
  let finalResult;

  createQuery = {
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    user_pw : user_pw_param
  };

  createResult = await User.create(createQuery);

  return createResult;
};

// 3-3. checkIdPw --------------------------------------------------------------------------------->
export const checkIdPw = async (
  user_id_param,
  user_pw_param
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    user_id : user_id_param,
    user_pw : user_pw_param
  };

  findResult = await User.findOne(findQuery).lean();

  return findResult;
};

// 3-4. login ------------------------------------------------------------------------------------->
export const login = async (
  user_id_param,
  user_pw_param
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    user_id : user_id_param,
    user_pw : user_pw_param
  };

  findResult = await User.findOne(findQuery).lean();

  return findResult;
};

// 4. update -------------------------------------------------------------------------------------->
export const update = async (
  user_id_param,
  update_pw_param
) => {

  let updateQuery;
  let updateResult;
  let finalResult;

  updateQuery = {
    user_id : user_id_param,
    user_pw : update_pw_param
  };

  updateResult = await User.findOneAndUpdate(updateQuery).lean();

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

  deleteResult = await User.deleteOne(deleteQuery).lean();

  return deleteResult;
};