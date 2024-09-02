// index.ts

import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { router as calendarRouter } from "@routers/calendar/calendarRouter";
import { router as exerciseChartRouter } from "@routers/exercise/exerciseChartRouter";
import { router as exerciseRouter } from "@routers/exercise/exerciseRouter";
import { router as exerciseGoalRouter } from "@routers/exercise/exerciseGoalRouter";
import { router as foodChartRouter } from "@routers/food/foodChartRouter";
import { router as foodRouter } from "@routers/food/foodRouter";
import { router as foodGoalRouter } from "@routers/food/foodGoalRouter";
import { router as moneyChartRouter } from "@routers/money/moneyChartRouter";
import { router as moneyRouter } from "@routers/money/moneyRouter";
import { router as moneyGoalRouter } from "@routers/money/moneyGoalRouter";
import { router as sleepChartRouter } from "@routers/sleep/sleepChartRouter";
import { router as sleepRouter } from "@routers/sleep/sleepRouter";
import { router as sleepGoalRouter } from "@routers/sleep/sleepGoalRouter";
import { router as userSyncRouter } from "@routers/user/userSyncRouter";
import { router as userRouter } from "@routers/user/userRouter";
import { router as googleRouter } from "@routers/auth/googleRouter";

// -------------------------------------------------------------------------------------------------
dotenv.config();
const app = express();
const preFix = process.env.HTTP_PREFIX || "";

// MongoDB 설정 ------------------------------------------------------------------------------------
const id = process.env.DB_USER;
const pw = process.env.DB_PASS;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT || '27017';
const db = process.env.DB_NAME;

mongoose.connect(`mongodb://${id}:${pw}@${host}:${port}/${db}`)
.then(() => {
  console.log('MongoDB 연결 성공');
})
.catch((error) => {
  console.error(`MongoDB 연결 실패: ${error}`);
});

// 서버 포트 설정 ----------------------------------------------------------------------------------
const httpPort = Number(process.env.HTTP_PORT) || 4000;
const httpsPort = Number(process.env.HTTPS_PORT) || 443;

function startServer(httpPort: number, httpsPort: number) {
  try {
    const httpServer = app.listen(httpPort, () => {
      console.log(`HTTP 서버가 포트 ${httpPort}에서 실행 중입니다.`);
    });
    httpServer.on('error', (error: any) => {
      if (error?.code === 'EADDRINUSE') {
        console.log(`${httpPort} 포트가 이미 사용 중입니다. ${httpPort + 1}번 포트로 변경합니다.`);
        startServer(httpPort + 1, httpsPort);
      }
      else {
        console.error(`서버 실행 중 오류 발생: ${error}`);
      }
    });
  }
  catch (error: any) {
    console.error(`서버 실행 중 오류 발생: ${error}`);
  }
}
startServer(httpPort, httpsPort);

// 미들웨어 설정 -----------------------------------------------------------------------------------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use((req, res, next) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  next();
});

// 라우터 설정 -------------------------------------------------------------------------------------
app.use(`${preFix}/calendar`, calendarRouter);
app.use(`${preFix}/exercise/chart`, exerciseChartRouter);
app.use(`${preFix}/exercise/goal`, exerciseGoalRouter);
app.use(`${preFix}/exercise`, exerciseRouter);
app.use(`${preFix}/food/chart`, foodChartRouter);
app.use(`${preFix}/food/goal`, foodGoalRouter);
app.use(`${preFix}/food`, foodRouter);
app.use(`${preFix}/money/chart`, moneyChartRouter);
app.use(`${preFix}/money/goal`, moneyGoalRouter);
app.use(`${preFix}/money`, moneyRouter);
app.use(`${preFix}/sleep/chart`, sleepChartRouter);
app.use(`${preFix}/sleep/goal`, sleepGoalRouter);
app.use(`${preFix}/sleep`, sleepRouter);
app.use(`${preFix}/user/sync`, userSyncRouter);
app.use(`${preFix}/user`, userRouter);
app.use(`${preFix}/auth/google`, googleRouter);
