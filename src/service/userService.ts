// userService.ts
import User from "../../src/model/User";

// checkId ---------------------------------------------------------------------------------------->
export const checkId = async (userIdParam: any) => {
  return User.findOne({userId: userIdParam});
};

// checkIdPw -------------------------------------------------------------------------------------->
export const checkIdPw = async (userIdParam: any, userPwParam: any) => {
  return User.findOne({userId: userIdParam, userPw: userPwParam});
};

// signup ----------------------------------------------------------------------------------------->
export const userSignup = async (userIdParam: any, userPwParam: any) => {
  return User.create({userId: userIdParam, userPw: userPwParam});
};

// login ------------------------------------------------------------------------------------------>
export const userLogin = async (userIdParam: any, userPwParam: any) => {
  return User.findOne({userId: userIdParam, userPw: userPwParam});
};

// userInfo --------------------------------------------------------------------------------------->
export const userInfo = async (userIdParam: any) => {
  return User.findOne({userId: userIdParam});
};

// userUpdate ------------------------------------------------------------------------------------->
export const userUpdate = async (userIdParam: any, updatePwParam: any) => {
  return User.findOneAndUpdate({userId: userIdParam, userPw: updatePwParam});
};

// userDelete ------------------------------------------------------------------------------------->
export const userDelete = async (userIdParam: any) => {
  return User.findOneAndDelete({userId: userIdParam});
};
