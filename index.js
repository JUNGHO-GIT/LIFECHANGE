// index.js

import fs from "fs";
import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import https from "https";

import { router as calendarRouter } from "./src/router/calendar/calendarRouter.js";
import { router as exerciseDashRouter } from "./src/router/exercise/exerciseDashRouter.js";
import { router as exerciseDiffRouter } from "./src/router/exercise/exerciseDiffRouter.js";
import { router as exerciseRouter } from "./src/router/exercise/exerciseRouter.js";
import { router as exerciseGoalRouter } from "./src/router/exercise/exerciseGoalRouter.js";
import { router as foodDashRouter } from "./src/router/food/foodDashRouter.js";
import { router as foodDiffRouter } from "./src/router/food/foodDiffRouter.js";
import { router as foodFindRouter } from "./src/router/food/foodFindRouter.js";
import { router as foodRouter } from "./src/router/food/foodRouter.js";
import { router as foodGoalRouter } from "./src/router/food/foodGoalRouter.js";
import { router as moneyDashRouter } from "./src/router/money/moneyDashRouter.js";
import { router as moneyDiffRouter } from "./src/router/money/moneyDiffRouter.js";
import { router as moneyRouter } from "./src/router/money/moneyRouter.js";
import { router as moneyGoalRouter } from "./src/router/money/moneyGoalRouter.js";
import { router as sleepDashRouter } from "./src/router/sleep/sleepDashRouter.js";
import { router as sleepDiffRouter } from "./src/router/sleep/sleepDiffRouter.js";
import { router as sleepRouter } from "./src/router/sleep/sleepRouter.js";
import { router as sleepGoalRouter } from "./src/router/sleep/sleepGoalRouter.js";
import { router as userPercentRouter } from "./src/router/user/userPercentRouter.js";
import { router as userDataRouter } from "./src/router/user/userDataRouter.js";
import { router as userRouter } from "./src/router/user/userRouter.js";

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

  try {
    const keyPath = process.env.PRIVKEY_PATH || './key/privkey.pem';
    const certPath = process.env.FULLCHAIN_PATH || './key/fullchain.pem';
    const options = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    https.createServer(options, app).listen(httpsPort, () => {
      console.log(`HTTPS 서버가 포트 ${httpsPort}에서 실행 중입니다.`);
    });
  }
  catch (error) {
    console.error('HTTPS 서버 설정 중 오류가 발생했습니다:', error.message);
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

// -------------------------------------------------------------------------------------------------
app.use("/calendar", calendarRouter);
app.use("/exercise/dash", exerciseDashRouter);
app.use("/exercise/diff", exerciseDiffRouter);
app.use("/exercise/goal", exerciseGoalRouter);
app.use("/exercise", exerciseRouter);
app.use("/food/dash", foodDashRouter);
app.use("/food/diff", foodDiffRouter);
app.use("/food/find", foodFindRouter);
app.use("/food/goal", foodGoalRouter);
app.use("/food", foodRouter);
app.use("/money/dash", moneyDashRouter);
app.use("/money/diff", moneyDiffRouter);
app.use("/money/goal", moneyGoalRouter);
app.use("/money", moneyRouter);
app.use("/sleep/dash", sleepDashRouter);
app.use("/sleep/diff", sleepDiffRouter);
app.use("/sleep/goal", sleepGoalRouter);
app.use("/sleep", sleepRouter);
app.use("/user/percent", userPercentRouter);
app.use("/user/data", userDataRouter);
app.use("/user", userRouter);
