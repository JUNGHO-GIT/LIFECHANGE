// userService.ts

import User from "../schema/User";
import * as mongoose from "mongoose";

// 1. userList ------------------------------------------------------------------------------------>
export const userList = async (
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
  };

  findResult = await User.find(findQuery).sort({ _id: -1 });

  return findResult;
};

// 2. userDetail ---------------------------------------------------------------------------------->
export const userDetail = async (
  user_id_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    user_id : user_id_param
  };

  findResult = await User.findOne(findQuery);

  return findResult;
};

// 3-1. userCheckId ------------------------------------------------------------------------------->
export const userCheckId = async (
  user_id_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    user_id : user_id_param
  };

  findResult = await User.findOne(findQuery);

  return findResult;
};

// 3-2. userInsert -------------------------------------------------------------------------------->
export const userInsert = async (
  user_id_param: any,
  user_pw_param: any
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

// 3-3. userCheckIdPw ----------------------------------------------------------------------------->
export const userCheckIdPw = async (
  user_id_param: any,
  user_pw_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    user_id : user_id_param,
    user_pw : user_pw_param
  };

  findResult = await User.findOne(findQuery);

  return findResult;
};

// 3-4. userLogin --------------------------------------------------------------------------------->
export const userLogin = async (
  user_id_param: any,
  user_pw_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    user_id : user_id_param,
    user_pw : user_pw_param
  };

  findResult = await User.findOne(findQuery);

  return findResult;
};

// 4. userUpdate ---------------------------------------------------------------------------------->
export const userUpdate = async (
  user_id_param: any,
  update_pw_param: any
) => {

  let updateQuery;
  let updateResult;
  let finalResult;

  updateQuery = {
    user_id : user_id_param,
    user_pw : update_pw_param
  };

  updateResult = await User.findOneAndUpdate(updateQuery);

  return updateResult;
};

// 5. userDelete ---------------------------------------------------------------------------------->
export const userDelete = async (
  _id_param: any
) => {

  let deleteQuery;
  let deleteResult;
  let finalResult;

  deleteQuery = {
    _id : _id_param
  };

  deleteResult = await User.deleteOne(deleteQuery);

  return deleteResult;
};