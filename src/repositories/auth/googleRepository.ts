// googleRepository.ts

import mongoose from "mongoose";
import { User } from "@schemas/user/User";

// 1. find -----------------------------------------------------------------------------------------
export const findUser = async (
  user_id_param: string,
) => {
  const findResult:any = await User.findOne({
    user_id: user_id_param,
    user_google: "Y",
  })
  .lean();

  return findResult;
}

// 2. create ---------------------------------------------------------------------------------------
export const createUser = async (
  user_id_param: string,
  user_pw_param: string,
  token_param: string,
) => {
  const finalResult:any = await User.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    user_google: "Y",
    user_token: token_param,
    user_pw: user_pw_param,
    user_initScale: "0",
    user_curScale: "0",
    user_initProperty: "0",
    user_curPropertyInclude: "0",
    user_curPropertyExclude: "0",
    user_image: "",
    user_regDt: new Date(),
    user_updateDt: "",
  });

  return finalResult;
}