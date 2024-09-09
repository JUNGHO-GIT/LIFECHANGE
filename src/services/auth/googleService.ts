// googleService.ts

import * as repository from "@repositories/auth/googleRepository";
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import session from "express-session";
import dotenv from 'dotenv';
dotenv.config();

// 0. common ---------------------------------------------------------------------------------------
const URL = process.env.CLIENT_URL;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_CALLBACK_URL;
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const customSession: any = session;

// 1. login ----------------------------------------------------------------------------------------
export const login = async () => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  findResult = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt: 'consent'
  });

  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    statusResult = "success";
    finalResult = findResult;
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2. callback -------------------------------------------------------------------------------------
export const callback = async (
  code_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";
  try {
    const { tokens } = await oAuth2Client.getToken(code_param);
    oAuth2Client.setCredentials(tokens);

    findResult = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: CLIENT_ID as string,
    });

    const payload = findResult.getPayload();
    console.log("googleInfo: " + JSON.stringify(payload, null, 2));

    // 세션에 정보 저장
    if (payload) {
      customSession.status = "authenticated";
      customSession.googleId = payload.email;
    }

    finalResult = `${URL}/auth/google`;
    statusResult = "success";
  }
  catch (err: any) {
    console.error("OAuth 토큰 교환 중 에러 발생: ", err);
    findResult = null;
    statusResult = "fail";
    throw err;
  }
  return {
    status: statusResult,
    result: finalResult
  };
};

// 3. afterCallback --------------------------------------------------------------------------------
export const afterCallback = async () => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let adminResult: any = null;
  let statusResult: string = "";

  if (customSession.status !== "authenticated") {
    finalResult = null;
    statusResult = "fail";
  }

  const googleId = customSession.googleId;
  const saltRounds = 10;
  const token = crypto.randomBytes(20).toString('hex');
  const combinedPw = `${googleId}_${token}`;
  const hashedPassword = await bcrypt.hash(combinedPw, saltRounds);

  findResult = await repository.findUser(
    googleId
  );

  // 아이디 없는 경우
  if (!findResult) {
    finalResult = await repository.createUser(googleId, hashedPassword, token);
    statusResult = "success";
  }

  // 아이디 있는경우
  else if (findResult && findResult.user_pw && findResult.user_token) {
    const ownToken = findResult.user_token;
    const isPasswordMatch = await bcrypt.compare(`${googleId}_${ownToken}`, findResult.user_pw);

    if (isPasswordMatch) {
      finalResult = findResult;
      statusResult = "success";
    }
    else {
      finalResult = null;
      statusResult = "fail";
    }
  }

  // 관리자인 경우
  if (googleId === process.env.ADMIN_ID) {
    adminResult = "admin";
  }

  // 사용자인 경우
  else {
    adminResult = "user";
  }

  return {
    status: statusResult,
    admin: adminResult,
    googleId: googleId,
    googlePw: combinedPw,
    result: finalResult
  };
};