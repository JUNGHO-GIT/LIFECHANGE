// userService.js

import * as repository from "../../repository/user/userRepository.js";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {email} from "../../assets/js/email.js";
import crypto from 'crypto';

// 0-0. info -------------------------------------------------------------------------------------->
export const info = async (
  user_id_param
) => {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../package.json'), 'utf-8'));

  const finalResult = {
    version: json.version || "",
    date: json.date || "",
    git: json.git || "",
    license: json.license || "",
  };

  return finalResult;
};

// 0-0. verify ------------------------------------------------------------------------------------>
export const verify = async (
  user_id_param
) => {

  // 토큰 1시간 설정
  const token = crypto.randomBytes(20).toString('hex');
  const expire = Date.now() + 3600000;

  const finalResult = await repository.verify.verify(
    user_id_param, token
  );

  if (!finalResult) {
    return null;
  }

  await email(
    user_id_param,
    "이메일 인증",
    "http://localhost:3000/user/verify?user_id=" + user_id_param + "&token=" + token
  );

  return finalResult;
};

// 0-0. signup ------------------------------------------------------------------------------------>
export const signup = async (
  user_id_param, user_pw_param
) => {

  const findResult = await repository.signup.checkId(
    user_id_param
  );

  let finalResult = null;
  if (findResult.length === 0) {
    finalResult = await repository.signup.signup(
      user_id_param, user_pw_param
    );
  }
  else {
    finalResult = "duplicated";
  }

  return finalResult;
};

// 0-0. extra ------------------------------------------------------------------------------------->
export const extra = async (
  user_id_param, OBJECT_param
) => {

  const findResult = await repository.extra.extra(
    user_id_param, OBJECT_param
  );

  let finalResult = null;
  if (findResult !== null) {
    finalResult = findResult;
  }
  else {
    finalResult = "fail";
  }

  return finalResult;
};

// 0-1. login ------------------------------------------------------------------------------------->
export const login = async (
  user_id_param, user_pw_param
) => {

  const findResult = await repository.login.login(
    user_id_param, user_pw_param
  );

  let finalResult = null;
  if (findResult !== null) {
    finalResult = findResult;
  }
  else {
    finalResult = "fail";
  }

  return finalResult;
};

// 2. detail (상세는 eq) -------------------------------------------------------------------------->
export const detail = async (
  user_id_param, _id_param
) => {

  const finalResult = await repository.detail(
    user_id_param, _id_param
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param, OBJECT_param, DATE_param
) => {

  const findResult = await repository.save.detail(
    user_id_param, ""
  );

  let finalResult = null;
  if (!findResult) {
    finalResult = await repository.save.create(
      user_id_param, OBJECT_param
    );
  }
  else {
    finalResult = await repository.save.update(
      user_id_param, findResult._id, OBJECT_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  user_id_param
) => {

  const finalResult = await repository.deletes.deletes(
    user_id_param
  );

  return finalResult
};