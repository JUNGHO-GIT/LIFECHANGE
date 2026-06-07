/**
 * @file auth.spec.ts
 * @description 인증 흐름 경우의수 (리디렉션 / 로그인 성공·실패 / 링크 이동 / sync 반영)
 * @author Jungho
 * @since 2026-06-07
 */

import { expect, test } from "@playwright/test";
import {
  BASE,
  injectSession,
  loginViaUi,
  TEST_ID,
  TEST_PW,
  TITLE,
} from "./helpers";

// 1. 루트 리디렉션 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
test(`비로그인 루트 진입 → /user/login 리디렉션`, async ({ page }) => {
  await page.goto(`${BASE}/`);
  await page.waitForURL(`**${BASE}/user/login*`);
  await expect(page.getByPlaceholder(`abcd@naver.com`)).toBeVisible();
});

test(`세션 보유 루트 진입 → /calendar/list 리디렉션`, async ({ page }) => {
  await injectSession(page);
  await page.goto(`${BASE}/`);
  await page.waitForURL(`**${BASE}/calendar/list*`);
});

// 2. 로그인 화면 구성 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
test(`로그인 화면 요소 렌더 (입력 2 + 버튼 2 + 체크박스 2)`, async ({
  page,
}) => {
  await page.goto(`${BASE}/user/login`);
  await expect(page.getByPlaceholder(`abcd@naver.com`)).toBeVisible();
  await expect(page.locator(`input[type="password"]`)).toBeVisible();
  await expect(
    page.getByRole(`button`, { name: `로그인`, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole(`button`, { name: `구글 아이디로 로그인` }),
  ).toBeVisible();
  await expect(page.getByRole(`checkbox`)).toHaveCount(2);
});

// 3. 로그인 실패 경우의수 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// 주의: TEST_ID(google 사용자)는 서버 userLogin 결함으로 비밀번호 무시(any pw → success).
// 비밀번호 검증 경로는 일반 사용자 계정으로만 확인 가능 (결함은 보고서에 별도 기재).
const failCases = [
  {
    title: `잘못된 비밀번호 (일반 사용자)`,
    id: `e2e-regular@test.com`,
    pw: `wrong_pw_123!`,
  },
  {
    title: `미존재 계정`,
    id: `no-such-user-e2e@test.com`,
    pw: `wrong_pw_123!`,
  },
];
for (const c of failCases) {
  test(`로그인 실패: ${c.title} → 에러 알림 + 페이지 유지`, async ({
    page,
  }) => {
    await page.goto(`${BASE}/user/login`);
    await page.getByPlaceholder(`abcd@naver.com`).fill(c.id);
    await page.locator(`input[type="password"]`).fill(c.pw);
    await page.getByRole(`button`, { name: `로그인`, exact: true }).click();
    await expect(page.getByRole(`alert`)).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain(`${BASE}/user/login`);
  });
}

test(`로그인 실패: 빈 입력 → 검증 차단으로 페이지 유지`, async ({ page }) => {
  await page.goto(`${BASE}/user/login`);
  await page.getByRole(`button`, { name: `로그인`, exact: true }).click();
  await page.waitForTimeout(1000);
  expect(page.url()).toContain(`${BASE}/user/login`);
});

// 4. 로그인 성공 + sync 반영 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
test(`로그인 성공 → /calendar/list 이동 + 세션/sync(favorite 포함) 기록`, async ({
  page,
}) => {
  await loginViaUi(page);

  // 세션 기록 확인
  const sessionId = await page.evaluate((titleParam: string) => {
    const parsed = JSON.parse(
      window.sessionStorage.getItem(titleParam) ?? `{}`,
    );
    return parsed?.setting?.id?.sessionId ?? ``;
  }, TITLE);
  expect(sessionId).toBe(TEST_ID);

  // sync 반영 확인 (L-32 findFavorite + H-23 allSettled 경로 검증)
  await expect
    .poll(
      async () =>
        page.evaluate((titleParam: string) => {
          const parsed = JSON.parse(
            window.sessionStorage.getItem(titleParam) ?? `{}`,
          );
          const syncObj = parsed?.setting?.sync ?? {};
          // favorite 응답은 { foodFavorite: [...] } 형태
          return {
            hasFavorite: Array.isArray(syncObj.favorite?.foodFavorite),
            hasCategory: Boolean(syncObj.category),
          };
        }, TITLE),
      { timeout: 15_000 },
    )
    .toEqual({ hasFavorite: true, hasCategory: true });
});

// 5. 링크 이동 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
const linkCases = [
  {
    label: `회원가입`,
    target: `/user/signup`,
  },
  {
    label: `비밀번호 변경`,
    target: `/user/resetPw`,
  },
];
for (const c of linkCases) {
  test(`로그인 화면 링크: ${c.label} → ${c.target}`, async ({ page }) => {
    await page.goto(`${BASE}/user/login`);
    await page.getByText(c.label, { exact: true }).click();
    await page.waitForURL(`**${BASE}${c.target}*`);
  });
}
