// basicService.js

import puppeteer from "puppeteer";

// 0. screenShot -----------------------------------------------------------------------------------
export const screenShot = async (
  user_id_param
) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
    const filePath = `./src/assets/images/${user_id_param}_${timestamp}.webp`;

    // 페이지 설정
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 스크린샷 찍을 페이지 URL
    await page.goto("https://www.junghomun.com", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    // 해상도 설정
    const originalViewport = page.viewport() || { width: 800, height: 600 };
    await page.setViewport({
      width: originalViewport.width / 2,
      height: originalViewport.height / 2
    });

    // 스크린샷 생성
    await page.screenshot({
      path: filePath,
      type: "webp",
      quality: 50,
      fullPage: true
    });

    // 브라우저 종료
    await browser.close();

    // 파일 경로를 반환
    return filePath;
  }
  catch (err) {
    console.error(err);
    return null;
  }
}
