/**
 * @file GoogleService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as repository from "@repositories/auth/GoogleRepository";
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import session from "express-session";
import dotenv from 'dotenv';
dotenv.config();

// 0. common ---------------------------------------------------------------------------------------
const URL: string | undefined = process.env.CLIENT_URL;
const CLIENT_ID: string | undefined = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET: string | undefined = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI: string | undefined = process.env.GOOGLE_CALLBACK_URL;
const oAuth2Client: OAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const customSession: any = session;

// 1. login ----------------------------------------------------------------------------------------
export const login = async () => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	findResult = oAuth2Client.generateAuthUrl({
		scope: [
			`https://www.googleapis.com/auth/userinfo.profile`,
			`https://www.googleapis.com/auth/userinfo.email`,
		],
		access_type: `offline`,
		prompt: `consent`,
	});

	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	}
	else {
		statusResult = `success`;
		finalResult = findResult;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2. callback -------------------------------------------------------------------------------------
export const callback = async (
	code_param: string
) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;
	try {
		const { tokens } = await oAuth2Client.getToken(code_param);
		oAuth2Client.setCredentials(tokens);

		findResult = await oAuth2Client.verifyIdToken({
			idToken: tokens.id_token as string,
			audience: CLIENT_ID as string,
		});

		const payload: any = findResult.getPayload();
		console.log(`googleInfo: ${JSON.stringify(payload, null, 2)}`);

		// 세션에 정보 저장
		if (payload) {
			customSession.status = `authenticated`;
			customSession.googleId = payload.email;
		}

		finalResult = `${URL}/auth/google`;
		statusResult = `success`;
	}
	catch (error: unknown) {
		console.error(`OAuth 토큰 교환 중 에러 발생:`, error);
		findResult = null;
		statusResult = `fail`;
		throw error;
	}
	return {
		status: statusResult,
		result: finalResult,
	};
};

// 3. afterCallback --------------------------------------------------------------------------------
export const afterCallback = async () => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let adminResult: any = null;
	let statusResult: string = ``;

	if (customSession.status !== `authenticated`) {
		finalResult = null;
		statusResult = `fail`;
	}

	const googleId: any = customSession.googleId;
	const saltRounds: number = 10;
	const token: string = crypto.randomBytes(20).toString(`hex`);
	const combinedPw: string = `${googleId}_${token}`;
	const hashedPassword: string = await bcrypt.hash(combinedPw, saltRounds);
	findResult = await repository.findUser(
		googleId as string
	);

	// 아이디 없는 경우
	if (!findResult) {
		finalResult = await repository.createUser(googleId, hashedPassword, token);
		statusResult = `success`;
	}

	// 아이디 있는경우
	else if (findResult?.user_pw && findResult.user_token) {
		const ownToken: any = findResult.user_token;
		const isPasswordMatch: boolean = await bcrypt.compare(`${googleId}_${ownToken}`, findResult.user_pw);

		if (isPasswordMatch) {
			finalResult = findResult;
			statusResult = `success`;
		}
		else {
			finalResult = null;
			statusResult = `fail`;
		}
	}

	// 관리자인 경우 or 일반 유저인 경우
	googleId === process.env.ADMIN_ID ? (adminResult = `admin`) : (adminResult = `user`);

	return {
		status: statusResult,
		admin: adminResult,
		googleId: googleId,
		googlePw: combinedPw,
		result: finalResult,
	};
};
