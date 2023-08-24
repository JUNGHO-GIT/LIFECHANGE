// userService.ts
import User from "../schemas/User";
import * as mongoose from "mongoose";

// checkId ---------------------------------------------------------------------------------------->
export const checkId = async (user_idParam: any) => {
  return User.findOne({user_id: user_idParam});
};

// checkIdPw -------------------------------------------------------------------------------------->
export const checkIdPw = async (user_idParam: any, user_pwParam: any) => {
  return User.findOne({user_id: user_idParam, user_pw: user_pwParam});
};

// userInsert ------------------------------------------------------------------------------------->
export const userSignup = async (
  user_idParam: any,
  user_pwParam: any
) => {
  return User.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_idParam,
    user_pw: user_pwParam
  });
};

// userLogin -------------------------------------------------------------------------------------->
export const userLogin = async (user_idParam: any, user_pwParam: any) => {
  return User.findOne({user_id: user_idParam, user_pw: user_pwParam});
};

// userDetail ------------------------------------------------------------------------------------->
export const userDetail = async (user_idParam: any) => {
  return User.findOne({user_id: user_idParam});
};

// userUpdate ------------------------------------------------------------------------------------->
export const userUpdate = async (user_idParam: any, updatePwParam: any) => {
  return User.findOneAndUpdate({user_id: user_idParam, user_pw: updatePwParam});
};

// userDelete ------------------------------------------------------------------------------------->
export const userDelete = async (user_idParam: any) => {
  return User.findOneAndDelete({user_id: user_idParam});
};
