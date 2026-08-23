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
import { createToken } from "@assets/scripts/jwt";
import { auditLog, auditSubject } from "@assets/scripts/audit";
loadEnv();

// 존재하지 않는 계정의 로그인 응답 시간을 실제 비교와 맞추기 위한 더미 해시
const dummyHash: string = bcrypt.hashSync(crypto.randomBytes(32).toString(`hex`), 10);

// 1-0. 토큼 세대 확보 ---------------------------------------------------------------------------
// - 기존 계정은 세대 값이 없어 로그인 시점에 발급해 저장한 뒤 토큼에 담음
// - user_token 은 밀번호 해시 솔트 성분이므로 세대 관리에 재사용하지 않음
const ensureTokenVersion = async (
  user_id_param: string,
  current_param: unknown,
): Promise<string> => {
  const current: string = String(current_param ?? ``).trim();
  if (current !== ``) {
    return current;
  }

  const rotateResult: any = await repository.userRotateTokenVersion(
    user_id_param, crypto.randomBytes(20).toString(`hex`),
  );

  return String(rotateResult?.user_tokenVersion ?? ``);
};

// 1-0-1. 인증 코드 대조·만료 판정 ----------------------------------------------------------------
// - 길이 선검사 후 timingSafeEqual 로 비교해 일치 여부가 응답 시간으로 새지 않게 함
// - TTL 인덱스 정리는 지연될 수 있으므로 애플리케이션 계층에서 만료를 다시 판정함
const isCodeMatched = (stored_param: unknown, input_param: unknown): boolean => {
  const stored: Buffer = Buffer.from(String(stored_param ?? ``), `utf8`);
  const input: Buffer = Buffer.from(String(input_param ?? ``), `utf8`);

  if (stored.length === 0 || stored.length !== input.length) {
    return false;
  }

  return crypto.timingSafeEqual(stored, input);
};
const isVerifyExpired = (regDt_param: unknown): boolean => {
  const ttlSec: number = Number(process.env.VERIFY_TTL_SEC ?? 600);
  const issuedAt: number = new Date(String(regDt_param ?? ``)).getTime();

  if (!Number.isFinite(issuedAt)) {
    return true;
  }

  return Date.now() - issuedAt > ttlSec * 1000;
};

// 1-1. sendEmailCode ----------------------------------------------------------------------------------
export const sendEmailCode = async (
  user_id_param: string,
  type_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;
  let sendResult: any = null;

  // 인증 코드 생성 (예측 가능한 Math.random 대신 CSPRNG 사용)
  const code: string = String(crypto.randomInt(100_000, 1_000_000));

  // 중복 체크
  findResult = await repository.emailFindId(
    user_id_param,
  );

  // 가입 시 이미 존재하는 아이디
  if (type_param === `signup` && findResult) {
    return {
      status: `duplicate`,
      result: null,
    };
  }
  // 재설정·삭제 시 존재하지 않는 아이디 (계정 존재 여부를 노출하지 않도록 발송 없이 성공 응답)
  if ((type_param === `resetPw` || type_param === `delete`) && !findResult) {
    return {
      status: `success`,
      result: {
        sent: true,
      },
    };
  }
  // 재설정·삭제 시 구글 계정
  if ((type_param === `resetPw` || type_param === `delete`) && findResult.user_google === `Y`) {
    return {
      status: `isGoogle`,
      result: null,
    };
  }

  sendResult = await sendEmail(
    user_id_param, code,
  );
  await repository.emailSendEmail(
    user_id_param, code,
  );

  // 발송 실패
  if (!sendResult) {
    return {
      status: `fail`,
      result: null,
    };
  }

  // 인증 코드는 응답 본문에 담지 않음 (메일 수신자만 확인 가능해야 함)
  return {
    status: `success`,
    result: {
      sent: true,
    },
  };
};

// 1-2. verifyEmail --------------------------------------------------------------------------------
export const verifyEmail = async (
  user_id_param: string,
  code_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;

  findResult = await repository.emailVerifyEmail(
    user_id_param,
  );

  // 발급 이력 없음
  if (!findResult) {
    return {
      status: `fail`,
      result: null,
    };
  }
  // 만료된 코드
  if (isVerifyExpired(findResult.verify_regDt)) {
    return {
      status: `fail`,
      result: null,
    };
  }
  // 코드 불일치
  if (!isCodeMatched(findResult.verify_code, code_param)) {
    return {
      status: `fail`,
      result: null,
    };
  }

  // 일치한 코드는 즉시 폐기하고 인증 사실을 일회용 티켓으로 치환함
  const ticket: string = crypto.randomBytes(32).toString(`base64url`);
  const issueResult: any = await repository.emailIssueTicket(
    user_id_param, ticket,
  );

  // 티켓 발급 실패
  if (!issueResult) {
    return {
      status: `fail`,
      result: null,
    };
  }

  // 인증 코드·문서 본문은 반환하지 않고 후속 단계용 티켓만 전달함
  return {
    status: `success`,
    result: {
      user_verify_ticket: ticket,
    },
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

  // 인증 티켓 부재 (이메일 소유 증명 없이 임의 주소로 가입되는 것을 차단함)
  const ticket: string = String(OBJECT_param?.user_verify_ticket ?? ``).trim();
  if (ticket === ``) {
    return {
      status: `notVerified`,
      result: null,
    };
  }

  findResult = await repository.userCheckId(
    user_id_param,
  );

  // 이미 가입된 아이디
  if (findResult) {
    return {
      status: `duplicated`,
      result: null,
    };
  }

  // 티켓 소비 실패 (미인증·만료·재사용)
  const consumeResult: any = await repository.emailConsumeTicket(
    user_id_param, ticket,
  );
  if (!consumeResult) {
    return {
      status: `notVerified`,
      result: null,
    };
  }

  // 비밀번호 해싱 (계정별 토큰을 섞어 동일 비밀번호의 해시 재사용을 방지함)
  const saltRounds: number = 10;
  const token: string = crypto.randomBytes(20).toString(`hex`);
  const combinedPw: string = `${OBJECT_param.user_pw}_${token}`;
  const hashedPassword: string = await bcrypt.hash(combinedPw, saltRounds);

  OBJECT_param.user_token = token;
  OBJECT_param.user_pw = hashedPassword;

  signupResult = await repository.userSignup(
    user_id_param, OBJECT_param,
  );

  // 생성 실패
  if (!signupResult) {
    return {
      status: `fail`,
      result: null,
    };
  }

  return {
    status: `success`,
    result: signupResult,
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

  // 인증 티켓 부재 (이메일 인증을 거치지 않은 재설정 요청을 계정 조회 전에 차단함)
  const ticket: string = String(OBJECT_param?.user_verify_ticket ?? ``).trim();
  if (ticket === ``) {
    return {
      status: `notVerified`,
      result: null,
    };
  }

  // 티켓 소비 실패 (미인증·만료·재사용)
  const consumeResult: any = await repository.emailConsumeTicket(
    user_id_param, ticket,
  );
  if (!consumeResult) {
    auditLog(`passwordReset`, `denied`, {
      subject: auditSubject(user_id_param),
      reason: `invalidTicket`,
    });
    return {
      status: `notVerified`,
      result: null,
    };
  }

  findResult = await repository.userCheckId(
    user_id_param,
  );

  // ID가 존재하지 않는 경우
  if (!findResult) {
    return {
      status: `notExist`,
      result: null,
    };
  }
  // google 사용자인 경우 (비밀번호 자격이 없어 재설정 대상이 아님)
  if (findResult.user_google === `Y`) {
    return {
      status: `isGoogle`,
      result: null,
    };
  }

  // 토큰 재발급과 함께 비밀번호 해싱
  const saltRounds: number = 10;
  const token: string = crypto.randomBytes(20).toString(`hex`);
  const combinedPw: string = `${OBJECT_param.user_pw}_${token}`;
  const hashedPassword: string = await bcrypt.hash(combinedPw, saltRounds);

  OBJECT_param.user_token = token;
  OBJECT_param.user_pw = hashedPassword;
  OBJECT_param.user_tokenVersion = crypto.randomBytes(20).toString(`hex`);

  resetResult = await repository.userResetPw(
    user_id_param, OBJECT_param,
  );

  // 갱신 실패
  if (!resetResult) {
    return {
      status: `fail`,
      result: null,
    };
  }

  // 재설정 성공은 기존 토큰 전량 무효화를 동반하므로 세대 갱신 사실까지 남김
  auditLog(`passwordReset`, `success`, {
    subject: auditSubject(user_id_param),
    tokenVersionRotated: true,
  });

  return {
    status: `success`,
    result: resetResult,
  };
};

// 2-3. userLogin ----------------------------------------------------------------------------------
// - 구글 계정은 비밀번호 자격이 없으므로 이 경로를 항상 거부하고 OAuth 플로우로만 처리함
// - 성공 시 액세스 토큰을 발급해 이후 요청의 주체 판별에 사용함
export const userLogin = async (
  user_id_param: string,
  user_pw_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;

  // ID 체크
  findResult = await repository.userCheckId(
    user_id_param,
  );

  // id가 존재하지 않는 경우 (계정 유무가 응답 시간으로 드러나지 않도록 동일 비용을 소모함)
  if (!findResult) {
    await bcrypt.compare(String(user_pw_param ?? ``), dummyHash);
    auditLog(`login`, `fail`, {
      subject: auditSubject(user_id_param),
      reason: `unknownAccount`,
    });
    return {
      status: `fail`,
      admin: `user`,
      token: ``,
      result: null,
    };
  }
  // google 사용자인 경우
  if (findResult.user_google === `Y`) {
    return {
      status: `isGoogle`,
      admin: `user`,
      token: ``,
      result: null,
    };
  }

  // 비밀번호 불일치 (아이디 오류와 동일한 상태·문구로 응답해 계정 열거를 막음)
  const combinedPw: string = `${user_pw_param}_${findResult.user_token}`;
  const isPasswordMatch: boolean = await bcrypt.compare(combinedPw, findResult.user_pw);
  if (!isPasswordMatch) {
    auditLog(`login`, `fail`, {
      subject: auditSubject(user_id_param),
      reason: `passwordMismatch`,
    });
    return {
      status: `fail`,
      admin: `user`,
      token: ``,
      result: null,
    };
  }

  // 관리자 확인 및 상세 이름 제외
  const adminResult: string = user_id_param === process.env.ADMIN_ID ? `admin` : `user`;
  const tokenVersion: string = await ensureTokenVersion(
    user_id_param, findResult.user_tokenVersion,
  );

  auditLog(`login`, `success`, {
    subject: auditSubject(user_id_param),
    admin: adminResult === `admin`,
  });

  return {
    status: `success`,
    admin: adminResult,
    token: createToken(user_id_param, tokenVersion),
    result: {
      user_id: findResult.user_id,
      user_google: findResult.user_google,
      user_image: findResult.user_image,
    },
  };
};

// 2-4. userDetail ---------------------------------------------------------------------------------
export const userDetail = async (
  user_id_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;

  findResult = await repository.userDetail(
    user_id_param,
  );

  // 조회 실패
  if (!findResult) {
    return {
      status: `fail`,
      result: null,
    };
  }

  return {
    status: `success`,
    result: findResult,
  };
};

// 2-5. userUpdate ---------------------------------------------------------------------------------
export const userUpdate = async (
  user_id_param: string,
  OBJECT_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;

  findResult = await repository.userUpdate(
    user_id_param, OBJECT_param,
  );

  // 대상 계정 없음 또는 갱신 실패
  if (!findResult) {
    return {
      status: `fail`,
      result: null,
    };
  }

  return {
    status: `success`,
    result: findResult,
  };
};

// 2-6. userDelete --------------------------------------------------------------------------------
// - 구글 계정은 저장된 비밀번호 자격이 없어 재확인을 생략하고 인증된 주체만으로 처리함
export const userDelete = async (
  user_id_param: string,
  user_pw_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;
  let deleteResult: any = null;

  findResult = await repository.userCheckId(
    user_id_param,
  );

  // ID가 존재하지 않는 경우
  if (!findResult) {
    return {
      status: `fail`,
      result: null,
    };
  }

  // 일반 사용자는 비밀번호 재확인 필수
  if (findResult.user_google !== `Y`) {
    const combinedPw: string = `${user_pw_param}_${findResult.user_token}`;
    const isPasswordMatch: boolean = await bcrypt.compare(combinedPw, findResult.user_pw);
    if (!isPasswordMatch) {
      return {
        status: `pwDoesNotMatch`,
        result: null,
      };
    }
  }

  deleteResult = await repository.userDelete(
    user_id_param,
  );

  // 삭제 실패
  if (!deleteResult) {
    return {
      status: `fail`,
      result: null,
    };
  }

  return {
    status: `success`,
    result: deleteResult,
  };
};

// 2-7. userSession -------------------------------------------------------------------------------
// - 저장된 토큰만으로 세션을 복원하는 자동로그인 경로 (평문 비밀번호 보관을 대체함)
export const userSession = async (
  user_id_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;

  findResult = await repository.userCheckId(
    user_id_param,
  );

  // 토큰은 유효하나 계정이 삭제된 경우
  if (!findResult) {
    return {
      status: `fail`,
      admin: `user`,
      result: null,
    };
  }

  const adminResult: string = user_id_param === process.env.ADMIN_ID ? `admin` : `user`;

  return {
    status: `success`,
    admin: adminResult,
    result: {
      user_id: findResult.user_id,
      user_google: findResult.user_google,
      user_image: findResult.user_image,
    },
  };
};

// 2-8. userLogout --------------------------------------------------------------------------------
// - 토큼 세대를 갱싱해 해당 계정으로 발급된 모든 액세스 토큼을 서버에서 무효화함
export const userLogout = async (
  user_id_param: string,
) => {

  // result 변수 선언
  let rotateResult: any = null;

  rotateResult = await repository.userRotateTokenVersion(
    user_id_param, crypto.randomBytes(20).toString(`hex`),
  );

  // 대상 계정 없음
  if (!rotateResult) {
    return {
      status: `fail`,
      result: null,
    };
  }

  return {
    status: `success`,
    result: null,
  };
};

// 3-1. categoryDetail -----------------------------------------------------------------------------
export const categoryDetail = async (
  user_id_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;

  findResult = await repository.categoryDetail(
    user_id_param,
  );

  // 조회 실패
  if (!findResult) {
    return {
      status: `fail`,
      result: null,
    };
  }

  return {
    status: `success`,
    result: findResult,
  };
};

// 3-2. categoryUpdate -----------------------------------------------------------------------------
export const categoryUpdate = async (
  user_id_param: string,
  OBJECT_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;

  findResult = await repository.categoryUpdate(
    user_id_param, OBJECT_param,
  );

  // 대상 계정 없음 또는 갱신 실패
  if (!findResult) {
    return {
      status: `fail`,
      result: null,
    };
  }

  return {
    status: `success`,
    result: findResult,
  };
};
