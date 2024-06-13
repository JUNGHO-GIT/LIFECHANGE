// email.js

import nodemailer from 'nodemailer';

export const email = async (email) => {
  try {

    // 이메일 서버 설정
    const transporter = nodemailer.createTransport({

      // SMTP 서버 주소
      host: 'smtp.example.com',

      // SMTP 포트 (일반적으로 587)
      port: 587,
      secure: false,
      auth: {
        user: 'example@example.com', // 이메일 계정
        pass: 'password' // 이메일 비밀번호
      }
    });

    // 이메일 전송
    await transporter.sendMail({

      // 발신자
      from: "junghomun000@gmail.com",

      // 수신자
      to: email,

      // 제목
      subject: "이메일 제목",

      // 내용
      text: "이메일 내용"
    });

    console.log("이메일이 성공적으로 전송되었습니다.");
  }
  catch (error) {
    console.log("이메일 전송 중 오류가 발생했습니다.", error);
  }
};