/**
 * @file helpers.ts
 * @description E2E 공통 헬퍼 (세션 주입, 오류 수집, UI 로그인)
 * @author Jungho
 * @since 2026-06-07
 */

import type { Page } from "@playwright/test";

// 1. 상수 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const BASE = `/lifechange`;
export const TITLE = `lifechange`;
export const TEST_ID = `junghomun00@gmail.com`;
export const TEST_PW = `junghomun00@gmail.com_123123123`;

// 2. 세션 주입 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// setSession(`setting`, `id`, ``, {...}) 와 동일한 sessionStorage 형태를 페이지 로드 전에 주입
export const injectSession = async (page: Page): Promise<void> => {
  await page.addInitScript(
    ([titleParam, idParam]) => {
      window.sessionStorage.setItem(
        String(titleParam),
        JSON.stringify({
          setting: {
            id: {
              sessionId: idParam,
              admin: `true`,
            },
          },
        }),
      );
    },
    [TITLE, TEST_ID],
  );
};

// 3. 페이지 미처리 예외 수집 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const trackPageErrors = (page: Page): string[] => {
  const errors: string[] = [];
  page.on(`pageerror`, (err: Error) => {
    errors.push(String(err?.message ?? err));
  });
  return errors;
};

// 4. 서버 5xx 응답 수집 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const trackServer5xx = (page: Page): string[] => {
  const failures: string[] = [];
  page.on(`response`, (res) => {
    if (res.status() >= 500) {
      failures.push(`${res.status()} ${res.url()}`);
    }
  });
  return failures;
};

// 5. UI 로그인 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const loginViaUi = async (page: Page): Promise<void> => {
  await page.goto(`${BASE}/user/login`);
  await page.getByPlaceholder(`abcd@naver.com`).fill(TEST_ID);
  await page.locator(`input[type="password"]`).fill(TEST_PW);
  await page.getByRole(`button`, { name: `로그인`, exact: true }).click();
  await page.waitForURL(`**${BASE}/calendar/list*`, { timeout: 15_000 });
};
