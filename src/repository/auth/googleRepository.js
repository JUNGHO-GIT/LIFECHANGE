// googleRepository.js

import mongoose from "mongoose";
import {newDate} from "../../assets/js/date.js";
import {User} from "../../schema/user/User.js";

// 1. find -----------------------------------------------------------------------------------------
export const findUser = async (
  user_id_param
) => {
  const findResult = await User.findOne({
    user_id: user_id_param,
    user_google: "Y"
  })
  .lean();

  return findResult;
}

// 2. create ---------------------------------------------------------------------------------------
export const createUser = async (
  user_id_param
) => {
  const finalResult = await User.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    user_pw: "google",
    user_google: "Y",
    user_regDt: newDate,
    user_updateDt: "",
  });

  return finalResult;
}