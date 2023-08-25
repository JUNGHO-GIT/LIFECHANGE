// userService.ts
import User from "../schemas/User";
import * as mongoose from "mongoose";

// 1. userList ------------------------------------------------------------------------------------>
export const userList = async (
) => {
  const userList = await User.find (
  );
  return userList;
};

// 2. userDetail ---------------------------------------------------------------------------------->
export const userDetail = async (
  user_id_param: any
) => {
  const userDetail = await User.findOne ({
    user_id: user_id_param
  });
  return userDetail;
};

// 3. userInsert ---------------------------------------------------------------------------------->
export const userInsert = async (
  user_id_param: any,
  user_pw_param: any
) => {
  const userInsert = await User.create ({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    user_pw: user_pw_param
  });
  return userInsert;
};


// 3-1. userCheckId ------------------------------------------------------------------------------->
export const userCheckId = async (
  user_id_param: any
) => {
  const userCheckId = await User.findOne ({
    user_id: user_id_param
  });
  return userCheckId;
};

// 3-2. userCheckIdPw ----------------------------------------------------------------------------->
export const userCheckIdPw = async (
  user_id_param: any,
  user_pw_param: any
) => {
  const userCheckIdPw = await User.findOne ({
    user_id: user_id_param,
    user_pw: user_pw_param
  });
  return userCheckIdPw;
};

// 3-3. userLogin --------------------------------------------------------------------------------->
export const userLogin = async (
  user_id_param: any,
  user_pw_param: any
) => {
  const userLogin = await User.findOne ({
    user_id: user_id_param,
    user_pw: user_pw_param
  });
  return userLogin;
};

// 4. userUpdate ---------------------------------------------------------------------------------->
export const userUpdate = async (
  user_id_param: any,
  update_pw_param: any
) => {
  const userUpdate = await User.findOneAndUpdate ({
    user_id: user_id_param,
    user_pw: update_pw_param
  });
  return userUpdate;
};

// 5. userDelete ---------------------------------------------------------------------------------->
export const userDelete = async (
  user_id_param: any
) => {
  const userDelete = await User.findOneAndDelete ({
    user_id: user_id_param
  });
  return userDelete;
};
