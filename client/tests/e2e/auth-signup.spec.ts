/**
 * @file auth-signup.spec.ts
 * @description 회원가입→로그인 풀스택 실작동 e2e (빈 로컬 DB 증명 + 인증 개편 회귀 토대)
 * @author Jungho
 * @since 2026-06-12
 */

import { expect, test } from "@playwright/test";
import { BASE, TITLE } from "./helpers";

// 시스템 Chrome 채널 사용 (chromium 바이너리 미설치 환경 대응)
test.use({ channel: `chrome` });

// 1. 고정 테스트 계정 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// 멱등 실행 위해 매 실행 동일 계정 사용. 비밀번호는 UserSignup validatePw 규칙 준수:
// 8자 이상 + 문자 + 숫자 + 특수문자([!#$%&*?@]) 포함.
const SIGNUP_ID = `e2e-signup@test.com`;
const SIGNUP_PW = `e2eTest_123!`;
const INIT_SCALE = `70`;
const INIT_KCAL = `2000`;
const INIT_PROPERTY = `1000000`;

// 2. 회원가입 → 로그인 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// 흐름:
//  (a) /email/send 호출 → 응답 result.code 캡처 (서버가 발급한 인증코드)
//  (b) /email/verify 로 코드 검증 → 비밀번호/초기값 입력 잠금 해제
//  (c) /signup 제출 → 성공(신규) 또는 alreadyExist(중복) graceful 분기
//  (d) /login → /calendar/list 도달 + 세션 sessionId 기록 확인
// 멱등성: 가입이 중복(alreadyExist)이어도 바로 로그인 단계로 진행하므로 매 실행 재실행 가능.
test(`회원가입 폼 제출 → 로그인 → /calendar/list 도달 + 세션 기록`, async ({
  page,
}) => {
  // (a) 가입 폼 진입
  await page.goto(`${BASE}/user/signup`);
  await expect(page.locator(`.App`)).toBeVisible({ timeout: 10_000 });

  // 이메일 입력
  await page.getByPlaceholder(`abcd@naver.com`).fill(SIGNUP_ID);

  // /email/send 응답에서 서버 발급 인증코드 캡처
  const sendRespPromise = page.waitForResponse((res) =>
    res.url().includes(`/email/send`) && res.request().method() === `POST`,
  );
  await page.getByRole(`button`, { name: `전송`, exact: true }).click();
  const sendResp = await sendRespPromise;
  const sendBody = await sendResp.json();

  // duplicate(이미 가입된 계정)면 가입 단계를 건너뛰고 바로 로그인으로 진행
  let verifyCode: string = ``;
  const isDuplicate: boolean = sendBody?.status === `duplicate`;
  if (!isDuplicate) {
    expect(sendBody?.status).toBe(`success`);
    verifyCode = String(sendBody?.result?.code ?? ``);
    expect(verifyCode).toMatch(/^\d{6}$/);

    // (b) 인증코드 검증
    await page.getByPlaceholder(`123456`).fill(verifyCode);
    const verifyRespPromise = page.waitForResponse((res) =>
      res.url().includes(`/email/verify`) && res.request().method() === `POST`,
    );
    await page.getByRole(`button`, { name: `인증`, exact: true }).click();
    const verifyResp = await verifyRespPromise;
    const verifyBody = await verifyResp.json();
    expect(verifyBody?.status).toBe(`success`);

    // (c) 비밀번호/초기값 입력 (인증 후 잠금 해제됨)
    const pwInputs = page.locator(`input[type="password"]`);
    await pwInputs.nth(0).fill(SIGNUP_PW);
    await pwInputs.nth(1).fill(SIGNUP_PW);

    // 초기 체중(체중) / 목표 칼로리(평균 칼로리 섭취량) / 초기 자산(자산) - label 기준 입력
    await page.getByLabel(`체중`, { exact: true }).fill(INIT_SCALE);
    await page.getByLabel(`평균 칼로리 섭취량`, { exact: true }).fill(INIT_KCAL);
    await page.getByLabel(`자산`, { exact: true }).fill(INIT_PROPERTY);

    // 가입 제출 → 성공 시 /user/login 으로 이동 (엔드포인트: URL_OBJECT + /signup)
    const signupRespPromise = page.waitForResponse((res) =>
      res.url().includes(`/signup`) && res.request().method() === `POST`,
    );
    await page.getByRole(`button`, { name: `회원가입`, exact: true }).click();
    const signupResp = await signupRespPromise;
    const signupBody = await signupResp.json();
    // 신규=success, 경합으로 중복=alreadyExist 둘 다 graceful 허용
    expect([`success`, `alreadyExist`]).toContain(signupBody?.status);
  }

  // (d) 로그인 단계 (가입 직후/중복 모두 동일 경로)
  await page.goto(`${BASE}/user/login`);
  await page.getByPlaceholder(`abcd@naver.com`).fill(SIGNUP_ID);
  await page.locator(`input[type="password"]`).fill(SIGNUP_PW);
  await page.getByRole(`button`, { name: `로그인`, exact: true }).click();
  await page.waitForURL(`**${BASE}/calendar/list*`, { timeout: 15_000 });

  // 세션 기록 확인 (setSession(`setting`,`id`) → sessionId 저장)
  const sessionId = await page.evaluate((titleParam: string) => {
    const parsed = JSON.parse(
      window.sessionStorage.getItem(titleParam) ?? `{}`,
    );
    return parsed?.setting?.id?.sessionId ?? ``;
  }, TITLE);
  expect(sessionId).toBe(SIGNUP_ID);
});
