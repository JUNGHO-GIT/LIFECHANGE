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

// 1. login ----------------------------------------------------------------------------------------
export const login = async () => {

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt: 'consent'
  });

  return {
    status: "success",
    url: authUrl
  };
};

// 2. callback -------------------------------------------------------------------------------------
export const callback = async (
  code_param: string,
) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code_param);
    oAuth2Client.setCredentials(tokens);

    const userInfo = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID
    });

    const payload = userInfo.getPayload();
    console.log("googleInfo: " + JSON.stringify(payload, null, 2));

    // 세션에 정보 저장
    if (payload) {
      session.status = "authenticated";
      session.googleId = payload.email;
    }

    return {
      status: "success",
      url: `${URL}/auth/google`,
    };

  }
  catch (err) {
    console.error("OAuth 토큰 교환 중 에러 발생: ", err);
    throw err;
  }
};

// 3. afterCallback --------------------------------------------------------------------------------
export const afterCallback = async () => {

  if (session.status !== "authenticated") {
    return null;
  }

  let findResult: any = null;
  let finalResult: any = null;
  let adminResult: any = null;

  const googleId = session.googleId;
  const saltRounds = 10;
  const token = crypto.randomBytes(20).toString('hex');
  const combinedPw = `${googleId}_${token}`;
  const hashedPassword = await bcrypt.hash(combinedPw, saltRounds);

  findResult = await repository.findUser(googleId);

  // 아이디 있는경우
  if (findResult && findResult.user_pw && findResult.user_token) {
    const ownToken = findResult.user_token;
    const isPasswordMatch = await bcrypt.compare(`${googleId}_${ownToken}`, findResult.user_pw);

    if (isPasswordMatch) {
      finalResult = findResult;
    }
    else {
      return {
        status: "fail",
        message: "Google login password mismatch"
      };
    }
  }

  // 아이디 없는경우
  else if (!findResult) {
    finalResult = await repository.createUser(googleId, hashedPassword, token);
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
    status: "success",
    result: finalResult,
    admin: adminResult,
    googleId: googleId,
    googlePw: `${googleId}_google`
  };
}