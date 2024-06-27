// index.js

import fs from "fs";
import path from "path";
import cors from "cors";
import util from "util";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
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

// -------------------------------------------------------------------------------------------------
const id = "eric4757";
const pw = "M7m7m7m7m7!";
const host = "34.23.233.23";
const port = "27017";
const db = "LIFECHANGE";
mongoose.connect(`mongodb://${id}:${pw}@${host}:${port}/${db}`);

// -------------------------------------------------------------------------------------------------

const httpPort = Number(process.env.HTTP_PORT) || 4000;
const httpsPort = Number(process.env.HTTPS_PORT) || 443;

function startServer(httpPort, httpsPort) {

  // http 리다이렉트 설정
  /* app.use((req, res, next) => {
    if (req.protocol === 'http') {
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    else {
      next();
    }
  }); */

  // http 서버 시작
  app.listen(httpPort, () => {
    console.log(`HTTP 서버가 포트 ${httpPort}에서 실행 중입니다.`);
  });

  // https 설정
  const options = {
    key: fs.readFileSync("key/privkey.pem"),
    cert: fs.readFileSync("key/cert.pem"),
    ca: fs.readFileSync("key/chain.pem"),
  };

  // https 서버 시작
  https.createServer(options, app).listen(httpsPort, () => {
    console.log(`HTTPS 서버가 포트 ${httpsPort}에서 실행 중입니다.`);
  });
}
startServer(httpPort, httpsPort);

// 미들웨어 설정
app.use(cors());
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
