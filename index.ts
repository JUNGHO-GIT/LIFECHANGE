// index.ts

import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

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
const port = process.env.DB_PORT;
const db = process.env.DB_NAME;

mongoose.connect(`mongodb://${id}:${pw}@${host}:${port}/${db}`)
  .then(() => {
    console.log(`${db} MongoDB 연결 성공`);
  })
  .catch((error) => {
    console.error(`${db} MongoDB 연결 실패: ${error}`);
  });

// 서버 포트 설정 ----------------------------------------------------------------------------------
const httpPort = Number(process.env.HTTP_PORT) || 4000;
const httpsPort = Number(process.env.HTTPS_PORT) || 443;

function startServer(httpPort: number, httpsPort: number) {
  try {
    const httpServer = app.listen(httpPort, () => {
      console.log(`HTTP 서버가 포트 ${httpPort}에서 실행 중입니다.`);
    });
    httpServer.on('error', (err: any) => {
      if (err?.code === 'EADDRINUSE') {
        console.log(`${httpPort} 포트가 이미 사용 중입니다. 다른 포트로 변경합니다.`);
        startServer(httpPort + 1, httpsPort);
      }
      else {
        console.error(`서버 실행 중 오류 발생: ${err}`);
      }
    });
  }
  catch (err: any) {
    console.error(`서버 실행 중 오류 발생: ${err}`);
  }
}
startServer(httpPort, httpsPort);

// 미들웨어 설정 -----------------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  maxAge: 3600,
  optionsSuccessStatus: 204,
  preflightContinue: false,
}));
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({
    status: 500,
    message: err.message,
  });
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
