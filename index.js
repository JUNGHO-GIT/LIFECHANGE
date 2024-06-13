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
import {router as exerciseGoalRouter} from "./src/router/exercise/exerciseGoalRouter.js";

import {router as foodDashRouter} from "./src/router/food/foodDashRouter.js";
import {router as foodDiffRouter} from "./src/router/food/foodDiffRouter.js";
import {router as foodFindRouter} from "./src/router/food/foodFindRouter.js";
import {router as foodRouter} from "./src/router/food/foodRouter.js";
import {router as foodGoalRouter} from "./src/router/food/foodGoalRouter.js";

import {router as moneyDashRouter} from "./src/router/money/moneyDashRouter.js";
import {router as moneyDiffRouter} from "./src/router/money/moneyDiffRouter.js";
import {router as moneyRouter} from "./src/router/money/moneyRouter.js";
import {router as moneyGoalRouter} from "./src/router/money/moneyGoalRouter.js";

import {router as sleepDashRouter} from "./src/router/sleep/sleepDashRouter.js";
import {router as sleepDiffRouter} from "./src/router/sleep/sleepDiffRouter.js";
import {router as sleepRouter} from "./src/router/sleep/sleepRouter.js";
import {router as sleepGoalRouter} from "./src/router/sleep/sleepGoalRouter.js";

import {router as userPercentRouter} from "./src/router/user/userPercentRouter.js";
import {router as userDataRouter} from "./src/router/user/userDataRouter.js";
import {router as userRouter} from "./src/router/user/userRouter.js";

// ------------------------------------------------------------------------------------------------>
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------------------------------------------------>
const id = "eric4757";
const pw = "M7m7m7m7m7!";
const host = "34.23.233.23";
const port = "27017";
const db = "LIFECHANGE";

// ------------------------------------------------------------------------------------------------>
const customLogger = (collectionName, method, query, doc) => {
  const message = util.format(
    "\n==============================================\n1.schema: \"%s\" \n2.method: \"%s\" \n3.query: %s \n4.doc: %s",
    collectionName,
    method,
    JSON.stringify(query, null, 3),
    JSON.stringify(doc, null, 3)
  );
  console.log(message);
};

// ------------------------------------------------------------------------------------------------>
// mongodb://eric4757:M7m7m7m7m7!@34.23.233.23:27017/LIFECHANGE
mongoose.connect(`mongodb://${id}:${pw}@${host}:${port}/${db}`);
// mongoose.set("debug", customLogger);

// ------------------------------------------------------------------------------------------------>
const appPort = Number(process.env.PORT) || 3000;
function startServer(port) {
  app.set("port", port);
  const server = app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
  });
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`${port} 포트가 이미 사용 중입니다. 다른 포트로 변경합니다.`);
      startServer(port + 1);
    } else {
      console.error(`서버 실행 중 오류 발생: ${error}`);
    }
  });
};
startServer(appPort);

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