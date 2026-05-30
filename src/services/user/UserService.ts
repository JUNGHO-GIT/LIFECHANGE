/**
 * @file UserService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { loadEnv } from "@assets/scripts/env";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import * as repository from "@repositories/user/UserRepository";
import { sendEmail } from "@assets/scripts/email";
loadEnv();

// 1-1. sendEmailCode ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const sndEmlCd = async (
	usrIdPrm: string,
	type_param: string,
) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let sendResult: any = null;
	let statusResult: string = ``;

	// 임의의 코드 생성
	const code: string = Math.floor(100_000 + Math.random() * 900_000).toString();

	// 중복 체크
	findResult = await repository.emailFindId(usrIdPrm);

	if (type_param === `signup` && findResult) {
		finalResult = null;
		statusResult = `duplicate`;
	} else if (
		(type_param === `resetPw` || type_param === `delete`) &&
		!findResult
	) {
		finalResult = null;
		statusResult = `notExist`;
	} else if (
		(type_param === `resetPw` || type_param === `delete`) &&
		findResult.user_google === `Y`
	) {
		finalResult = null;
		statusResult = `isGoogle`;
	} else {
		sendResult = await sendEmail(usrIdPrm, code);
		await repository.emailSendEmail(usrIdPrm, code);

		if (!sendResult) {
			finalResult = null;
			statusResult = `fail`;
		} else {
			finalResult = {
				code: code,
				result: sendResult,
			};
			statusResult = `success`;
		}
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 1-2. verifyEmail ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const verifyEmail = async (
	usrIdPrm: string,
	code_param: string,
) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	findResult = await repository.emailVerifyEmail(usrIdPrm);

	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		if (findResult.verify_code === code_param) {
			finalResult = findResult;
			statusResult = `success`;
		} else {
			finalResult = null;
			statusResult = `fail`;
		}
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2-1. userSignup ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const userSignup = async (usrIdPrm: string, OBJECT_param: any) => {
	// result 변수 선언
	let findResult: any = null;
	let signupResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	findResult = await repository.userCheckId(usrIdPrm);

	if (findResult) {
		finalResult = null;
		statusResult = `alreadyExist`;
	} else {
		const saltRounds: number = 10;
		const token: string = crypto.randomBytes(20).toString(`hex`);
		const combinedPw: string = `${OBJECT_param.user_pw}_${token}`;
		const hshdPssw: string = await bcrypt.hash(combinedPw, saltRounds);

		OBJECT_param.user_token = token;
		OBJECT_param.user_pw = hshdPssw;

		signupResult = await repository.userSignup(usrIdPrm, OBJECT_param);
	}

	if (!signupResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = signupResult;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2-2. userResetPw ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const userResetPw = async (usrIdPrm: string, OBJECT_param: any) => {
	// result 변수 선언
	let findResult: any = null;
	let resetResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;
	const saltRounds: number = 10;
	let token: string = crypto.randomBytes(20).toString(`hex`);
	let combinedPw: string = ``;

	findResult = await repository.userCheckId(usrIdPrm);

	// ID가 존재하지 않으면 바로 종료
	if (!findResult) {
		finalResult = null;
		statusResult = `notExist`;
	} else {
		// google 사용자인 경우
		if (findResult.user_google === `Y`) {
			finalResult = null;
			statusResult = `isGoogle`;
		} else {
			combinedPw = `${OBJECT_param.user_pw}_${token}`;

			// 해쉬 비밀번호
			const hshdPssw: string = await bcrypt.hash(combinedPw, saltRounds);
			OBJECT_param.user_token = token;
			OBJECT_param.user_pw = hshdPssw;

			resetResult = await repository.userResetPw(usrIdPrm, OBJECT_param);
		}
	}

	if (!resetResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = resetResult;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2-3. userLogin ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const userLogin = async (
	usrIdPrm: string,
	usrPwPrm: string,
	isAtLgnPrm: boolean,
) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = `fail`;
	let adminResult: any = `user`;
	let combinedPw: string = ``;
	let statusResult: string = ``;

	// ID 체크
	findResult = await repository.userCheckId(usrIdPrm);

	// 1. id가 존재하지 않는 경우
	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	}
	// 2. id가 존재하는 경우
	else {
		// google 사용자인 경우
		if (findResult.user_google === `Y`) {
			// auto login이 아닌 경우
			if (!isAtLgnPrm) {
				finalResult = null;
				statusResult = `isGoogle`;
			}
			combinedPw = `${usrIdPrm}_${findResult.user_token}`;
		}
		// 일반 사용자인 경우
		else {
			combinedPw = `${usrPwPrm}_${findResult.user_token}`;
		}

		// 비밀번호 비교
		const isPsswMtch: boolean = await bcrypt.compare(
			combinedPw,
			findResult.user_pw,
		);
		if (!isPsswMtch) {
			finalResult = null;
			statusResult = `pwDoesNotMatch`;
		} else {
			finalResult = findResult;
			statusResult = `success`;
		}

		// 관리자 확인
		adminResult = usrIdPrm === process.env.ADMIN_ID ? `admin` : `user`;
	}

	return {
		status: statusResult,
		admin: adminResult,
		result: finalResult,
	};
};

// 2-4. userDetail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const userDetail = async (usrIdPrm: string) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	findResult = await repository.userDetail(usrIdPrm);

	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = findResult;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2-5. userUpdate ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const userUpdate = async (usrIdPrm: string, OBJECT_param: any) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	findResult = await repository.userUpdate(usrIdPrm, OBJECT_param);

	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = findResult;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2-6. userDelete ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const userDelete = async (
	usrIdPrm: string,
	usrPwPrm: string,
) => {
	// result 변수 선언
	let findResult: any = null;
	let deleteResult: any = null;
	let combinedPw: string = ``;
	let finalResult: any = null;
	let statusResult: string = ``;

	findResult = await repository.userCheckId(usrIdPrm);

	// ID가 존재하지 않는 경우
	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	}
	// ID가 존재하는 경우
	else {
		// google 사용자인 경우
		if (findResult.user_google === `Y`) {
			combinedPw = `${usrIdPrm}_${findResult.user_token}`;
		}
		// 일반 사용자인 경우
		else {
			combinedPw = `${usrPwPrm}_${findResult.user_token}`;
		}

		// 비밀번호 비교
		const isPsswMtch: boolean = await bcrypt.compare(
			combinedPw,
			findResult.user_pw,
		);
		if (!isPsswMtch) {
			finalResult = null;
			statusResult = `pwDoesNotMatch`;
		} else {
			deleteResult = await repository.userDelete(usrIdPrm);
			if (!deleteResult) {
				finalResult = null;
				statusResult = `fail`;
			} else {
				finalResult = deleteResult;
				statusResult = `success`;
			}
		}
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 3-2. categoryDetail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const catDtl = async (usrIdPrm: string) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	findResult = await repository.categoryDetail(usrIdPrm);

	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = findResult;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 3-2. categoryUpdate ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const catUpdt = async (
	usrIdPrm: string,
	OBJECT_param: any,
) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	findResult = await repository.categoryUpdate(usrIdPrm, OBJECT_param);

	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = findResult;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};
