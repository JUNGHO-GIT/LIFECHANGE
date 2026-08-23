/**
 * @file email.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import nodemailer from 'nodemailer';
import { loadEnv } from "@assets/scripts/env";
loadEnv();

// 로그 노출용 이메일 마스킹 (로컬파트 첫 글자만 유지)
const maskEmail = (email: string): string => {
  const atIndex: number = email.indexOf(`@`);
  if (atIndex <= 0) {
    return `***`;
  }
  return `${email.slice(0, 1)}***${email.slice(atIndex)}`;
};
// -------------------------------------------------------------------------------------------------
export const sendEmail = async (email: string, code: string) => {
  try {
    // 이메일 서버 설정
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE as string,
      host: process.env.EMAIL_HOST as string,
      port: process.env.EMAIL_PORT as unknown as number,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_ID as string,
        pass: process.env.EMAIL_PW as string,
      },
    });

    // 이메일 전송
    const bucketPath: string | undefined = process.env.GCLOUD_BUCKET_PATH;
    await transporter.sendMail({

      // 발신자
      from: `"LIFECHANGE" <${process.env.EMAIL_ID}>`,

      // 수신자
      to: email,

      // 제목
      subject: `LIFECHANGE 인증 코드`,

      // html
      html: /* html */ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>LIFECHANGE 인증 코드</title>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body
            style="
              font-family: 'Arial', sans-serif;
              background-color: #f5f5f5;
              padding: 0;
              margin: 0;
            "
          >
            <div
              style="
                width: 100%;
                height: auto;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 30px;
                box-sizing: border-box;
                border: 1px solid #dad9d9;
              "
            >
              <div
                style="
                  text-align: left;
                  margin-bottom: 20px;
                "
              >
                <img
                  src="${bucketPath}/main/logo1.webp"
                  alt="logo2"
                  loading="lazy"
                  style="
                    width: 50px;
                    height: auto;
                    vertical-align: middle;
                  "
                />
                <img
                  src="${bucketPath}/main/logo3.webp"
                  alt="logo3"
                  loading="lazy"
                  style="
                    width: 250px;
                    height: auto;
                    vertical-align: middle;
                  "
                />
              </div>
              <hr
                style="
                  width: 100%;
                  margin: 30px 0;
                  border: 0;
                  border-top: 1px solid #dad9d9;
                "
              />
              <h3
                style="
                  display: block;
                  margin-bottom: 15px;
                  font-size: 24px;
                "
              >
                <span
                  style="
                    color: #006bb5;
                    font-weight: bold;
                  "
                >
                  LIFECHANGE
                </span>
                <span
                  style="
                    color: #000000;
                    font-weight: normal;
                  "
                >
                  인증 코드
                </span>
              </h3>
              <h3
                style="
                  display: block;
                  margin-bottom: 15px;
                  font-size: 18px;
                "
              >
                <span
                  style="
                    color: #000000;
                    font-weight: normal;
                  "
                >
                  아래의 코드를 사용하여 인증을 완료하세요
                </span>
              </h3>
              <h1
                style="
                  font-size: 26px;
                  font-weight: bolder;
                  color: #006bb5;
                "
              >
                ${code}
              </h1>
            </div>
          </body>
        </html>
      `,
    });

    // 자격증명·인증코드는 로그에 남기지 않고 수신 주소는 마스킹함
    const consoleStr: string = `
      -----------------------------------------
      이메일이 성공적으로 전사되었습니다.
      서버스: ${process.env.EMAIL_SERVICE}
      호스트: ${process.env.EMAIL_HOST}
      포트: ${process.env.EMAIL_PORT}
      클라이언트 이메일: ${maskEmail(email)}
      -----------------------------------------
    `;
    console.log(consoleStr);
    return `success`;
  }
  catch (error: any) {
    const consoleStr: string = `
      -----------------------------------------
      이메일 전송 중 오류가 발생했습니다.
      ${error}
      -----------------------------------------
    `;
    console.log(consoleStr);
    return `fail`;
  }
};
