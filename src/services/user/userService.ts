// userService.ts

import fs from "fs";
import path from "path";
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { fileURLToPath } from "url";
import * as repository from "@repositories/user/userRepository";
import { randomNumber, randomTime, calcDate } from '@scripts/utils';
import { exerciseArray } from '@arrays/exerciseArray';
import { foodArray } from '@arrays/foodArray';
import { moneyArray } from '@arrays/moneyArray';
import { emailSending } from "@scripts/email";
dotenv.config();

// 0-1. appInfo ------------------------------------------------------------------------------------
export const appInfo = async () => {

  let finalResult:any = null;
  let statusResult:string = "";

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envData = fs.readFileSync(path.join(__dirname, '../../../.env'), 'utf8');
  const markdownData = fs.readFileSync(path.join(__dirname, '../../../changelog.md'), 'utf8');

  const versionRegex = /(\s*)(\d+\.\d+\.\d+)(\s*)/g;
  const dateRegex = /-\s*(\d{4}-\d{2}-\d{2})\s*\((\d{2}:\d{2}:\d{2})\)/g;
  const gitRegex = /GIT_REPO=(.*)/;
  const licenseRegex = /LICENSE=(.*)/;

  const versionMatches = [...markdownData.matchAll(versionRegex)];
  const dateMatches = [...markdownData.matchAll(dateRegex)];
  const gitMatch = envData.match(gitRegex);
  const licenseMatch = envData.match(licenseRegex);

  const lastVersion = versionMatches.length > 0 ? versionMatches[versionMatches.length - 1][2] : "";
  const lastDateMatch = dateMatches.length > 0 ? dateMatches[dateMatches.length - 1] : null;
  const lastDateTime = lastDateMatch ? `${lastDateMatch[1]}_${lastDateMatch[2]}` : "";
  const lastGit = gitMatch ? gitMatch[1] : "";
  const lastLicense = licenseMatch ? licenseMatch[1] : "";

  finalResult = {
    version: lastVersion,
    date: lastDateTime,
    git: lastGit,
    license: lastLicense,
  };

  if (!finalResult) {
    statusResult = "fail"
  }
  else {
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 1-1. sendEmail ----------------------------------------------------------------------------------
export const sendEmail = async (
  user_id_param: string,
  type_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let sendResult: any = null;
  let statusResult: string = "";

  // 임의의 코드 생성
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 중복 체크
  findResult = await repository.emailFindId (
    user_id_param
  );

  if (type_param === "signup" && findResult) {
    finalResult = null;
    statusResult = "duplicate";
  }
  else if ((type_param === "resetPw" || type_param === "delete") && !findResult) {
    finalResult = null;
    statusResult = "notExist";
  }
  else if((type_param === "resetPw" || type_param === "delete") && findResult.user_google === "Y") {
    finalResult = null;
    statusResult = "isGoogle";
  }
  else {
    sendResult = await emailSending(
      user_id_param, code
    );
    await repository.emailSendEmail(
      user_id_param, code
    );

    if (!sendResult) {
      finalResult = null;
      statusResult = "fail";
    }
    else {
      finalResult = {
        code: code,
        result: sendResult
      };
      statusResult = "success";
    }
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 1-2. verifyEmail --------------------------------------------------------------------------------
export const verifyEmail = async (
  user_id_param: string,
  code_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  findResult = await repository.emailVerifyEmail(
    user_id_param
  );

  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    if (findResult.verify_code === code_param) {
      finalResult = findResult;
      statusResult = "success";
    }
    else {
      finalResult = null;
      statusResult = "fail";
    }
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2-1. userSignup ---------------------------------------------------------------------------------
export const userSignup = async (
  user_id_param: string,
  OBJECT_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let signupResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  findResult = await repository.userCheckId(
    user_id_param
  );

  if (findResult) {
    finalResult = null;
    statusResult = "alreadyExist";
  }
  else {
    const saltRounds = 10;
    const token = crypto.randomBytes(20).toString('hex');
    const combinedPw = `${OBJECT_param.user_pw}_${token}`;
    const hashedPassword = await bcrypt.hash(combinedPw, saltRounds);

    OBJECT_param.user_token = token;
    OBJECT_param.user_pw = hashedPassword;

    signupResult = await repository.userSignup(
      user_id_param, OBJECT_param
    );
  }

  if (!signupResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = signupResult;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2-2. userResetPw --------------------------------------------------------------------------------
export const userResetPw = async (
  user_id_param: string,
  OBJECT_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let resetResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";
  let saltRounds: number = 10;
  let token: string = crypto.randomBytes(20).toString('hex');
  let combinedPw: string = "";

  findResult = await repository.userCheckId(
    user_id_param
  );

  // ID가 존재하지 않으면 바로 종료
  if (!findResult) {
    finalResult = null;
    statusResult = "notExist";
  }
  else {
    // google 사용자인 경우
    if (findResult.user_google === "Y") {
      finalResult = null;
      statusResult = "isGoogle";
    }
    else {
      combinedPw = `${OBJECT_param.user_pw}_${token}`;

      // 해쉬 비밀번호
      const hashedPassword = await bcrypt.hash(combinedPw, saltRounds);
      OBJECT_param.user_token = token
      OBJECT_param.user_pw = hashedPassword;

      resetResult = await repository.userResetPw(
        user_id_param, OBJECT_param
      );
    }
  }

  if (!resetResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = resetResult;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2-3. userLogin ----------------------------------------------------------------------------------
export const userLogin = async (
  user_id_param: string,
  user_pw_param: string,
  isAutoLogin_param: boolean,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = "fail";
  let adminResult: any = "user";
  let combinedPw: string = "";
  let statusResult: string = "";

  // ID 체크
  findResult = await repository.userCheckId(
    user_id_param
  );

  // 1. id가 존재하지 않는 경우
  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
  }
  // 2. id가 존재하는 경우
  else {
    // google 사용자인 경우
    if (findResult.user_google === "Y") {
      // auto login이 아닌 경우
      if (!isAutoLogin_param) {
        finalResult = null;
        statusResult = "isGoogle";
      }
      combinedPw = `${user_id_param}_${findResult.user_token}`;
    }
    // 일반 사용자인 경우
    else {
      combinedPw = `${user_pw_param}_${findResult.user_token}`;
    }

    // 비밀번호 비교
    const isPasswordMatch = await bcrypt.compare(combinedPw, findResult.user_pw);
    if (!isPasswordMatch) {
      finalResult = null;
      statusResult = "pwDoesNotMatch";
    }
    else {
      finalResult = findResult;
      statusResult = "success";
    }

    // 관리자 확인
    if (user_id_param === process.env.ADMIN_ID) {
      adminResult = "admin";
    }
    else {
      adminResult = "user";
    }
  }

  return {
    status: statusResult,
    admin: adminResult,
    result: finalResult,
  };
};

// 2-4. userDetail ---------------------------------------------------------------------------------
export const userDetail = async (
  user_id_param: string
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  findResult = await repository.userDetail(
    user_id_param
  );

  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = findResult;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 2-5. userUpdate ---------------------------------------------------------------------------------
export const userUpdate = async (
  user_id_param: string,
  OBJECT_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  findResult = await repository.userUpdate(
    user_id_param, OBJECT_param
  );

  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = findResult;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2-6. userDelete --------------------------------------------------------------------------------
export const userDelete = async (
  user_id_param: string,
  user_pw_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;
  let deleteResult: any = null;
  let combinedPw: string = "";
  let finalResult: any = null;
  let statusResult: string = "";

  findResult = await repository.userCheckId(
    user_id_param
  );

  // ID가 존재하지 않는 경우
  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
  }
  // ID가 존재하는 경우
  else {
    // google 사용자인 경우
    if (findResult.user_google === "Y") {
      combinedPw = `${user_id_param}_${findResult.user_token}`;
    }
    // 일반 사용자인 경우
    else {
      combinedPw = `${user_pw_param}_${findResult.user_token}`;
    }

    // 비밀번호 비교
    const isPasswordMatch = await bcrypt.compare(combinedPw, findResult.user_pw);
    if (!isPasswordMatch) {
      finalResult = null;
      statusResult = "pwDoesNotMatch";
    }
    else {
      deleteResult = await repository.userDelete(
        user_id_param,
      );
      if (!deleteResult) {
        finalResult = null;
        statusResult = "fail";
      }
      else {
        finalResult = deleteResult;
        statusResult = "success";
      }
    }
  }

  return {
    status: statusResult,
    result: finalResult
  };
}

// 3-2. categoryDetail -----------------------------------------------------------------------------
export const categoryDetail = async (
  user_id_param: string
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  findResult = await repository.categoryDetail(
    user_id_param
  );

  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = findResult;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 3-2. categoryUpdate -----------------------------------------------------------------------------
export const categoryUpdate = async (
  user_id_param: string,
  OBJECT_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  findResult = await repository.categoryUpdate(
    user_id_param, OBJECT_param,
  );

  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = findResult;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};