// googleService.js

import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

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

// 3. callback -------------------------------------------------------------------------------------
export const callback = async (code_param) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code_param);
    oAuth2Client.setCredentials(tokens);

    const userInfo = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID
    });

    console.log("userInfo: " + JSON.stringify(userInfo.getPayload(), null, 2));

    return {
      status: "success",
      url: `${URL}/calendar/list`
    };

  }
  catch (err) {
    console.error("OAuth 토큰 교환 중 에러 발생: ", err);
    throw err;
  }
};
