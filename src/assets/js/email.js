// email.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (email, code) => {
  try {
    // 이메일 서버 설정
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PW,
      },
    });

    // 이메일 전송
    await transporter.sendMail({

      // 발신자
      from: "LIFECHANGE",

      // 수신자
      to: email,

      // 제목
      subject: "이메일 인증 코드",

      // 내용
      text: `인증 코드: ${code}`
    });

    console.log("이메일이 성공적으로 전송되었습니다.");
    return "success";
  }
  catch (error) {
    console.log("이메일 전송 중 오류가 발생했습니다.");
    console.log(error);
    return "fail";
  }
};

export const verifyEmail = async (email, code) => {
  try {
    // 이메일 서버 설정
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PW,
      },
    });

    // 이메일 전송
    await transporter.sendMail({

      // 발신자
      from: "LIFECHANGE",

      // 수신자
      to: email,

      // 제목
      subject: "이메일 인증 코드",

      // 내용
      text: `인증 코드: ${code}`
    });

    console.log("이메일이 성공적으로 전송되었습니다.");
    return "success";
  }
  catch (error) {
    console.log("이메일 전송 중 오류가 발생했습니다.");
    console.log(error);
    return "fail";
  }
}
