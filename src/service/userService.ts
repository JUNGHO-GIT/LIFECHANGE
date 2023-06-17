import User from "../model/User";

// secretKey
export const secretKey = (secretKeyParam: any) => {
  return User.findOne({secretKey: secretKeyParam});
};

// checkId
export const checkId = async (userIdParam: any) => {
  return User.findOne({userId: userIdParam});
};

// signup
export const signupUser = async (userIdParam: any, userPwParam: any) => {
  return User.create({userId: userIdParam, userPw: userPwParam});
};

// login
export const loginUser = async (userIdParam: any, userPwParam: any) => {
  return User.findOne({userId: userIdParam, userPw: userPwParam});
};

// myPage
export const myPage = async (userIdParam: any) => {
  return User.findOne({userId: userIdParam});
};

// update
export const updateUser = async (userIdParam: any, userPwParam: any) => {
  return User.findOneAndUpdate({userId: userIdParam}, {userPw: userPwParam});
};

// delete
export const deleteUser = async (userIdParam: any) => {
  return User.findOneAndDelete({userId: userIdParam});
};
