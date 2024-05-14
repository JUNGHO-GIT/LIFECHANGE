// index.js

import path from "path";
import cors from "cors";
import util from "util";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {fileURLToPath} from "url";

import {router as calendarRouter} from "./src/router/calendar/calendarRouter.js";

import {router as exerciseDashRouter} from "./src/router/exercise/exerciseDashRouter.js";
import {router as exerciseDiffRouter} from "./src/router/exercise/exerciseDiffRouter.js";
import {router as exerciseRouter} from "./src/router/exercise/exerciseRouter.js";
import {router as exercisePlanRouter} from "./src/router/exercise/exercisePlanRouter.js";

import {router as foodDashRouter} from "./src/router/food/foodDashRouter.js";
import {router as foodDiffRouter} from "./src/router/food/foodDiffRouter.js";
import {router as foodFindRouter} from "./src/router/food/foodFindRouter.js";
import {router as foodRouter} from "./src/router/food/foodRouter.js";
import {router as foodPlanRouter} from "./src/router/food/foodPlanRouter.js";

import {router as moneyDashRouter} from "./src/router/money/moneyDashRouter.js";
import {router as moneyDiffRouter} from "./src/router/money/moneyDiffRouter.js";
import {router as moneyRouter} from "./src/router/money/moneyRouter.js";
import {router as moneyPlanRouter} from "./src/router/money/moneyPlanRouter.js";

import {router as sleepDashRouter} from "./src/router/sleep/sleepDashRouter.js";
import {router as sleepDiffRouter} from "./src/router/sleep/sleepDiffRouter.js";
import {router as sleepRouter} from "./src/router/sleep/sleepRouter.js";
import {router as sleepPlanRouter} from "./src/router/sleep/sleepPlanRouter.js";

import {router as userPercentRouter} from "./src/router/user/userPercentRouter.js";
import {router as userPlanRouter} from "./src/router/user/userPlanRouter.js";
import {router as userRouter} from "./src/router/user/userRouter.js";

// ------------------------------------------------------------------------------------------------>
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------------------------------------------------>
const id = "eric4757";
const pw = "M7m7m7m7m7!";
const host = "34.75.165.209";
const port = "27017";
const db = "LIFECHANGE";
// mongoose.connect("mongodb://eric4757:M7m7m7m7m7!@34.75.165.209:27017/LIFECHANGE");

// ------------------------------------------------------------------------------------------------>
const customLogger = (collectionName, method, query, doc) => {
  const message = util.format(
    "\n======================= \n-schema: \"%s\" \n-method: \"%s\" \n-query: %s \n-doc: %s",
    collectionName,
    method,
    JSON.stringify(query, null, 3),
    JSON.stringify(doc, null, 3)
  );
  console.log(message);
};

// ------------------------------------------------------------------------------------------------>
mongoose.connect(`mongodb://${id}:${pw}@${host}:${port}/${db}`);
// mongoose.set("debug", customLogger);

// ------------------------------------------------------------------------------------------------>
const appPort = Number(process.env.PORT);
try {
  app.set("port", appPort);
  console.log(`서버가 포트 ${appPort}에서 실행 중입니다.`);
}
catch (error) {
  if (error.code === "EADDRINUSE") {
    console.log(`${appPort} 포트가 이미 사용 중입니다. 다른 포트로 변경합니다.`);
    app.set("port", appPort + 1);
  } else {
    console.error(`서버 실행 중 오류 발생: ${error}`);
  }
}

// ------------------------------------------------------------------------------------------------>
app.use(cors(), (req, res, next) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, "client/build")));

// ------------------------------------------------------------------------------------------------>
app.use("/calendar", calendarRouter);

app.use("/exercise", exerciseDashRouter);
app.use("/exercise", exerciseDiffRouter);
app.use("/exercise", exerciseRouter);
app.use("/exercise", exercisePlanRouter);

app.use("/food", foodDashRouter);
app.use("/food", foodDiffRouter);
app.use("/food", foodFindRouter);
app.use("/food", foodRouter);
app.use("/food", foodPlanRouter);

app.use("/money", moneyDashRouter);
app.use("/money", moneyDiffRouter);
app.use("/money", moneyRouter);
app.use("/money", moneyPlanRouter);

app.use("/sleep", sleepDashRouter);
app.use("/sleep", sleepDiffRouter);
app.use("/sleep", sleepRouter);
app.use("/sleep", sleepPlanRouter);

app.use("/user", userPercentRouter);
app.use("/user", userPlanRouter);
app.use("/user", userRouter);

// ------------------------------------------------------------------------------------------------>
app.listen(app.get("port"), () => {
  console.log(`App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
});