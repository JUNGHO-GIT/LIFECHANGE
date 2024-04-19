import path from "path";
import cors from "cors";
import util from "util";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import {fileURLToPath} from "url";

import {foodDashRouter} from "./src/router/foodDashRouter.js";
import {moneyDashRouter} from "./src/router/moneyDashRouter.js";
import {sleepDashRouter} from "./src/router/sleepDashRouter.js";
import {workDashRouter} from "./src/router/workDashRouter.js";

import {foodPlanRouter} from "./src/router/foodPlanRouter.js";
import {moneyPlanRouter} from "./src/router/moneyPlanRouter.js";
import {sleepPlanRouter} from "./src/router/sleepPlanRouter.js";
import {workPlanRouter} from "./src/router/workPlanRouter.js";

import {foodRouter} from "./src/router/foodRouter.js";
import {moneyRouter} from "./src/router/moneyRouter.js";
import {sleepRouter} from "./src/router/sleepRouter.js";
import {userRouter} from "./src/router/userRouter.js";
import {workRouter} from "./src/router/workRouter.js";

// ------------------------------------------------------------------------------------------------>
const customLogger = (collectionName, method, query, doc, options) => {
  const message = util.format(
    "\n======================= \nschema: %s \nmethod: %s \nquery: %s \ndoc: %s \noptions: %s",
    collectionName,
    method,
    JSON.stringify(query, null, 2),
    JSON.stringify(doc, null, 2),
    JSON.stringify(options, null, 2),
  );
  console.log(message);
}

// ------------------------------------------------------------------------------------------------>
mongoose.connect("mongodb://127.0.0.1:27017");
mongoose.set("debug", customLogger);
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
app.use(bodyParser.urlencoded({ extended: true }));
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
