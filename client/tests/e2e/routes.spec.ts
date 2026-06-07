/**
 * @file routes.spec.ts
 * @description 전 라우트 렌더 경우의수 매트릭스 (세션 주입 × 크래시/ErrorBoundary/5xx 감지)
 * @author Jungho
 * @since 2026-06-07
 */

import { expect, test } from "@playwright/test";
import {
  BASE,
  injectSession,
  trackPageErrors,
  trackServer5xx,
} from "./helpers";

// 1. 케이스 테이블 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// auth/google 은 OAuth 콜백 파라미터 의존이라 제외
const routeCases = [
  // calendar
  { path: `/calendar/list`, session: true },
  { path: `/calendar/detail`, session: true },
  // exercise
  { path: `/exercise/chart/list`, session: true },
  { path: `/exercise/goal/list`, session: true },
  { path: `/exercise/goal/detail`, session: true },
  { path: `/exercise/record/list`, session: true },
  { path: `/exercise/record/detail`, session: true },
  // food
  { path: `/food/chart/list`, session: true },
  { path: `/food/goal/list`, session: true },
  { path: `/food/goal/detail`, session: true },
  { path: `/food/record/list`, session: true },
  { path: `/food/record/detail`, session: true },
  { path: `/food/find/list`, session: true },
  { path: `/food/favorite/list`, session: true },
  // money
  { path: `/money/chart/list`, session: true },
  { path: `/money/goal/list`, session: true },
  { path: `/money/goal/detail`, session: true },
  { path: `/money/record/list`, session: true },
  { path: `/money/record/detail`, session: true },
  // sleep
  { path: `/sleep/chart/list`, session: true },
  { path: `/sleep/goal/list`, session: true },
  { path: `/sleep/goal/detail`, session: true },
  { path: `/sleep/record/list`, session: true },
  { path: `/sleep/record/detail`, session: true },
  // user
  { path: `/user/detail`, session: true },
  { path: `/user/category`, session: true },
  { path: `/user/appSetting`, session: true },
  { path: `/user/appInfo`, session: true },
  { path: `/user/delete`, session: true },
  { path: `/user/signup`, session: false },
  { path: `/user/resetPw`, session: false },
  // admin
  { path: `/admin/dashboard`, session: true },
  // auth (공개)
  { path: `/auth/privacy`, session: false },
  { path: `/auth/error`, session: false },
];

// 2. 렌더 매트릭스 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
for (const c of routeCases) {
  test(`렌더: ${c.path}${c.session ? `` : ` (비로그인)`}`, async ({ page }) => {
    if (c.session) {
      await injectSession(page);
    }
    const pageErrors = trackPageErrors(page);
    const serverErrors = trackServer5xx(page);

    await page.goto(`${BASE}${c.path}`);
    await expect(page.locator(`.App`)).toBeVisible();
    await page.waitForLoadState(`networkidle`);

    // ErrorBoundary 폴백 / vite 오버레이 / 미처리 예외 / 서버 5xx 모두 없어야 한다
    await expect(page.getByText(`오류가 발생했습니다`)).toHaveCount(0);
    await expect(page.locator(`vite-error-overlay`)).toHaveCount(0);
    expect(pageErrors).toEqual([]);
    expect(serverErrors).toEqual([]);
  });
}
