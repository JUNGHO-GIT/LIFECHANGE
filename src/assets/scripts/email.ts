// email.ts

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// -------------------------------------------------------------------------------------------------
export const emailSending = async (email: string, code: string) => {
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
    await transporter.sendMail({

      // 발신자
      from: `"LIFECHANGE" <${process.env.EMAIL_ID}>`,

      // 수신자
      to: email,

      // 제목
      subject: "LIFECHANGE 인증 코드",

      // html
      html: /* html*/`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>LIFECHANGE 인증 코드</title>
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
                  src="https://storage.googleapis.com/jungho-bucket/JPAGE/IMAGE/main/logo2.webp"
                  alt="logo2"
                  loading="lazy"
                  style="
                    width: 50px;
                    height: auto;
                    vertical-align: middle;
                  "
                />
                <img
                  src="https://storage.googleapis.com/jungho-bucket/JPAGE/IMAGE/main/logo3.webp"
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

    const consoleStr = `
      ========================================
      이메일이 성공적으로 전송되었습니다.
      서비스: ${process.env.EMAIL_SERVICE}
      호스트: ${process.env.EMAIL_HOST}
      포트: ${process.env.EMAIL_PORT}
      서버 이메일: ${process.env.EMAIL_ID}
      서버 비밀번호: ${process.env.EMAIL_PW}
      클라이언트 이메일: ${email}
      인증 코드: ${code}
      ========================================
    `;
    console.log(consoleStr);

    return "success";
  }
  catch (err: any) {
    const consoleStr = `
      ========================================
      이메일 전송 중 오류가 발생했습니다.
      ${err}
    `;
    console.log(consoleStr);

    return "fail";
  }
};