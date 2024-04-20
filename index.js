// index.js

import path from "path";
import cors from "cors";
import util from "util";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import {fileURLToPath} from "url";

import {router as foodDashRouter} from "./src/router/foodDashRouter.js";
import {router as moneyDashRouter} from "./src/router/moneyDashRouter.js";
import {router as sleepDashRouter} from "./src/router/sleepDashRouter.js";
import {router as workDashRouter} from "./src/router/workDashRouter.js";

import {router as foodPlanRouter} from "./src/router/foodPlanRouter.js";
import {router as moneyPlanRouter} from "./src/router/moneyPlanRouter.js";
import {router as sleepPlanRouter} from "./src/router/sleepPlanRouter.js";
import {router as workPlanRouter} from "./src/router/workPlanRouter.js";

import {router as foodRouter} from "./src/router/foodRouter.js";
import {router as moneyRouter} from "./src/router/moneyRouter.js";
import {router as sleepRouter} from "./src/router/sleepRouter.js";
import {router as userRouter} from "./src/router/userRouter.js";
import {router as workRouter} from "./src/router/workRouter.js";

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
}

// ------------------------------------------------------------------------------------------------>
mongoose.connect("mongodb://127.0.0.1:27017");
/* mongoose.set("debug", customLogger); */
mongoose.set("autoIndex", true);
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------------------------------------------------>
app.set("port", process.env.PORT || 4000);
app.use(cors(), (req, res, next) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/food/dash", foodDashRouter);
app.use("/money/dash", moneyDashRouter);
app.use("/sleep/dash", sleepDashRouter);
app.use("/work/dash", workDashRouter);

app.use("/food/plan", foodPlanRouter);
app.use("/money/plan", moneyPlanRouter);
app.use("/sleep/plan", sleepPlanRouter);
app.use("/work/plan", workPlanRouter);

app.use("/food", foodRouter);
app.use("/money", moneyRouter);
app.use("/sleep", sleepRouter);
app.use("/user", userRouter);
app.use("/work", workRouter);

// ------------------------------------------------------------------------------------------------>
app.listen(app.get("port"), () => {
  console.log(`App is running at http://127.0.0.1:${app.get("port")} in ${app.get("env")} mode`);
});
