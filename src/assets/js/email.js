// email.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const emailSending = async (email, code) => {
  try {
    // 이메일 서버 설정
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PW,
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

      // 내용
      text: `인증 코드   :   ${code}`,

      // html
       html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>LIFECHANGE 인증 코드</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                padding: 0;
                margin: 0;
                background-color: #f5f5f5;
              }
              .div-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                box-sizing: border-box;
                border: 1px solid #e0e0e0;
              }
              .img-container {
                text-align: center;
                margin-bottom: 20px;
              }
              .logo2 {
                width: 50px;
                height: auto;
                vertical-align: middle;
              }
              .logo3 {
                width: 250px;
                height: auto;
                vertical-align: middle;
              }
              .hr {
                width: 100%;
                margin: 20px 0;
                border: 0;
                border-top: 1px solid #dad9d9;
              }
              h2 {
                text-align: center;
                font-size: 24px;
                margin: 0;
              }
              h3 {
                text-align: center;
                font-size: 18px;
                margin: 20px 0 0 0;
                line-height: 1.5;
              }
              .blue {
                color: #006bb5;
              }
              .black {
                color: #000000;
              }
              .code-before {
                display: block;
                margin-bottom: 10px;
                font-size: 18px;
                font-weight: normal;
                margin-bottom: 25px;
              }
              .code-real {
                font-size: 24px;
                font-weight: bold;
                color: #006bb5;
              }
            </style>
          </head>
          <body>
            <div class="div-container">
              <div class="img-container">
                <img src="https://storage.googleapis.com/jungho-bucket/JPAGE/IMAGE/LIFECHANGE/png/logo2.png" alt="logo2" class="logo2" />
                <img src="https://storage.googleapis.com/jungho-bucket/JPAGE/IMAGE/LIFECHANGE/png/logo3.png" alt="logo3" class="logo3" />
              </div>
              <hr class="hr" />
              <h2>
                <span class="blue">LIFECHANGE</span>
                <span class="black">인증 코드</span>
              </h2>
              <h3>
                <span class="code-before">아래의 인증 코드를 사용하여 인증을 완료하세요</span>
                <span class="code-real">${code}</span>
              </h3>
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
  catch (error) {
    const consoleStr = `
      ========================================
      이메일 전송 중 오류가 발생했습니다.
      ${error}
    `;
    console.log(consoleStr);

    return "fail";
  }
};