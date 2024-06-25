// email.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (email, code) => {
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
      from: process.env.EMAIL_FROM,

      // 수신자
      to: email,

      // 제목
      subject: "이메일 인증 코드",

      // 내용
      text: `인증 코드: ${code}`
    });

    console.log("========================================");
    console.log("이메일이 성공적으로 전송되었습니다.");
    console.log("서비스: " + process.env.EMAIL_SERVICE);
    console.log("호스트: " + process.env.EMAIL_HOST);
    console.log("포트: " + process.env.EMAIL_PORT);
    console.log("서버 이메일 : " + process.env.EMAIL_ID);
    console.log("서버 비밀번호 : " + process.env.EMAIL_PW);
    console.log(`클라이언트 이메일: ${email}`);
    console.log(`인증 코드: ${code}`);
    console.log("========================================");
    return "success";
  }
  catch (error) {
    console.log("이메일 전송 중 오류가 발생했습니다.");
    console.log(error);
    return "fail";
  }
};