/**
 * @file data.spec.ts
 * @description 실데이터 렌더 경우의수 (즐겨찾기/달력/차트/리스트 — 서버 수정사항 런타임 검증)
 * @author Jungho
 * @since 2026-06-07
 */

import { expect, test } from "@playwright/test";
import { BASE, loginViaUi, trackPageErrors, trackServer5xx } from "./helpers";

// 1. 즐겨찾기 리스트 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// 로그인 → sync(favorite) → 즐겨찾기 페이지 데이터 렌더 (Mongo 31249 재발 시 5xx로 감지)
test(`로그인 후 즐겨찾기 리스트 데이터 렌더 (findFavorite 경로)`, async ({
  page,
}) => {
  const serverErrors = trackServer5xx(page);
  await loginViaUi(page);
  await page.goto(`${BASE}/food/favorite/list`);
  await page.waitForLoadState(`networkidle`);
  await expect(page.getByText(`양념치킨`).first()).toBeVisible({
    timeout: 15_000,
  });
  expect(serverErrors).toEqual([]);
});

// 2. 달력 렌더 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
test(`로그인 후 달력 위젯 렌더`, async ({ page }) => {
  const pageErrors = trackPageErrors(page);
  await loginViaUi(page);
  await expect(page.locator(`.react-calendar`)).toBeVisible({
    timeout: 15_000,
  });
  expect(pageErrors).toEqual([]);
});

// 3. 차트 렌더 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// H-21(수입 차트 복원) 포함 — 차트 페이지에서 recharts SVG 렌더 + 5xx 없음
const chartCases = [
  { path: `/money/chart/list` },
  { path: `/exercise/chart/list` },
];
for (const c of chartCases) {
  test(`로그인 후 차트 렌더: ${c.path}`, async ({ page }) => {
    const serverErrors = trackServer5xx(page);
    await loginViaUi(page);
    await page.goto(`${BASE}${c.path}`);
    await page.waitForLoadState(`networkidle`);
    await expect(page.locator(`svg.recharts-surface`).first()).toBeVisible({
      timeout: 15_000,
    });
    expect(serverErrors).toEqual([]);
  });
}

// 4. 리스트 API 정상 응답 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// returnDocument 전환 이후 목록 조회 경로가 정상 status 로 응답하는지 확인
test(`로그인 후 기록 리스트 API 응답 정상`, async ({ page }) => {
  await loginViaUi(page);
  const resPromise = page.waitForResponse(
    (res) => res.url().includes(`/api/exercise/record/list`),
    { timeout: 15_000 },
  );
  await page.goto(`${BASE}/exercise/record/list`);
  const res = await resPromise;
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect([`success`, `fail`]).toContain(body.status);
});
