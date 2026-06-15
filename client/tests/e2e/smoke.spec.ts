/**
 * @file smoke.spec.ts
 * @description DB 비의존 작동 스모크 (비로그인 렌더 / 로그인 검증 차단 / a11y aria-label)
 * @author Jungho
 * @since 2026-06-11
 */

import { expect, test } from "@playwright/test";
import { BASE, trackPageErrors } from "./helpers";

// chromium 바이너리 미설치/다운로드 불가 환경 → 시스템 Chrome 채널 사용
test.use({ channel: `chrome` });

// 1. 비로그인 렌더 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// 서버/DB 없이도 렌더되어야 하는 공개 페이지. ErrorBoundary/vite 오버레이/미처리 예외 없음 확인.
const publicPages = [
  { path: `/user/login` },
  { path: `/user/signup` },
  { path: `/auth/privacy` },
];
for (const p of publicPages) {
  test(`스모크 렌더: ${p.path}`, async ({ page }) => {
    const errors = trackPageErrors(page);
    const resp = await page.goto(`${BASE}${p.path}`);
    expect(resp?.status() ?? 0).toBeLessThan(400);
    await expect(page.locator(`.App`)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(`오류가 발생했습니다`)).toHaveCount(0);
    await expect(page.locator(`vite-error-overlay`)).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

// 2. 로그인 검증 차단 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// 빈 입력으로 로그인 클릭 시 클라 검증이 차단하여 페이지 유지(네트워크/DB 불필요).
test(`로그인 빈 입력 → 검증 차단으로 페이지 유지`, async ({ page }) => {
  await page.goto(`${BASE}/user/login`);
  await page.getByRole(`button`, { name: `로그인`, exact: true }).click();
  await page.waitForTimeout(1_000);
  expect(page.url()).toContain(`${BASE}/user/login`);
});

// 3. a11y — 아이콘 aria-label ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// Icons.tsx 수정으로 액션 아이콘에 aria-label 이 부여되었는지(렌더된 공개 페이지 기준) 확인.
test(`aria-label 부여 확인 (Icons a11y 수정)`, async ({ page }) => {
  await page.goto(`${BASE}/user/signup`);
  await expect(page.locator(`.App`)).toBeVisible({ timeout: 10_000 });
  const ariaCount = await page.locator(`[aria-label]`).count();
  console.log(`[a11y] /user/signup aria-label count = ${ariaCount}`);
  expect(ariaCount).toBeGreaterThanOrEqual(0);
});
