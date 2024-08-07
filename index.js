// index.js

import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";

import { router as calendarRouter } from "./src/router/calendar/calendarRouter.js";
import { router as exerciseChartRouter } from "./src/router/exercise/exerciseChartRouter.js";
import { router as exerciseDiffRouter } from "./src/router/exercise/exerciseDiffRouter.js";
import { router as exerciseRouter } from "./src/router/exercise/exerciseRouter.js";
import { router as exerciseGoalRouter } from "./src/router/exercise/exerciseGoalRouter.js";
import { router as foodChartRouter } from "./src/router/food/foodChartRouter.js";
import { router as foodDiffRouter } from "./src/router/food/foodDiffRouter.js";
import { router as foodRouter } from "./src/router/food/foodRouter.js";
import { router as foodGoalRouter } from "./src/router/food/foodGoalRouter.js";
import { router as moneyChartRouter } from "./src/router/money/moneyChartRouter.js";
import { router as moneyDiffRouter } from "./src/router/money/moneyDiffRouter.js";
import { router as moneyRouter } from "./src/router/money/moneyRouter.js";
import { router as moneyGoalRouter } from "./src/router/money/moneyGoalRouter.js";
import { router as sleepChartRouter } from "./src/router/sleep/sleepChartRouter.js";
import { router as sleepDiffRouter } from "./src/router/sleep/sleepDiffRouter.js";
import { router as sleepRouter } from "./src/router/sleep/sleepRouter.js";
import { router as sleepGoalRouter } from "./src/router/sleep/sleepGoalRouter.js";
import { router as userSyncRouter } from "./src/router/user/userSyncRouter.js";
import { router as userRouter } from "./src/router/user/userRouter.js";
import { router as googleRouter } from "./src/router/auth/googleRouter.js";

// -------------------------------------------------------------------------------------------------
dotenv.config();
const app = express();

// MongoDB 설정 ------------------------------------------------------------------------------------
const id = process.env.DB_USER;
const pw = process.env.DB_PASS;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT || '27017';
const db = process.env.DB_NAME;
mongoose.connect(`mongodb://${id}:${pw}@${host}:${port}/${db}`);

// 서버 포트 설정 ----------------------------------------------------------------------------------
const httpPort = Number(process.env.HTTP_PORT) || 4000;
const httpsPort = Number(process.env.HTTPS_PORT) || 443;

function startServer(httpPort, httpsPort) {
  try {
    const httpServer = app.listen(httpPort, () => {
      console.log(`HTTP 서버가 포트 ${httpPort}에서 실행 중입니다.`);
    });
    httpServer.on('error', (error) => {
      // @ts-ignore
      if (error?.code === 'EADDRINUSE') {
        console.log(`${httpPort} 포트가 이미 사용 중입니다. 다른 포트로 변경합니다.`);
        startServer(httpPort + 1);
      }
      else {
        console.error(`서버 실행 중 오류 발생: ${error}`);
      }
    });
  }
  catch (error) {
    console.error('HTTP 서버 설정 중 오류가 발생했습니다:', error.message);
  }
}
startServer(httpPort, httpsPort);


// 미들웨어 설정 -----------------------------------------------------------------------------------
// app.use(morgan('dev'));
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

// -------------------------------------------------------------------------------------------------
app.use("/api/calendar", calendarRouter);
app.use("/api/exercise/chart", exerciseChartRouter);
app.use("/api/exercise/diff", exerciseDiffRouter);
app.use("/api/exercise/goal", exerciseGoalRouter);
app.use("/api/exercise", exerciseRouter);
app.use("/api/food/chart", foodChartRouter);
app.use("/api/food/diff", foodDiffRouter);
app.use("/api/food/goal", foodGoalRouter);
app.use("/api/food", foodRouter);
app.use("/api/money/chart", moneyChartRouter);
app.use("/api/money/diff", moneyDiffRouter);
app.use("/api/money/goal", moneyGoalRouter);
app.use("/api/money", moneyRouter);
app.use("/api/sleep/chart", sleepChartRouter);
app.use("/api/sleep/diff", sleepDiffRouter);
app.use("/api/sleep/goal", sleepGoalRouter);
app.use("/api/sleep", sleepRouter);
app.use("/api/user/sync", userSyncRouter);
app.use("/api/user", userRouter);
app.use("/api/google", googleRouter);