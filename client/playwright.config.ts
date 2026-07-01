/**
 * @file playwright.config.ts
 * @description E2E 경우의수 테스트 설정 (사전조건: vite dev 3000 + API 서버 4001 기동 상태)
 * @author Jungho
 * @since 2026-06-07
 */

import { defineConfig, devices } from "@playwright/test";

// 1. config ---------------------------------------------------------------------------------------
export default defineConfig({
  testDir: `./.playwright/e2e`,
  fullyParallel: true,
  retries: 0,
  workers: 4,
  timeout: 30_000,
  reporter: [[`list`]],
  use: {
    baseURL: `http://localhost:3000`,
    channel: `chrome`,
    locale: `ko-KR`,
    trace: `retain-on-failure`,
    screenshot: `only-on-failure`,
  },
  projects: [
    {
      name: `chromium`,
      use: {
        ...devices[`Desktop Chrome`],
      },
    },
  ],
});
