import path from "path";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {fileURLToPath} from "url";
import {foodPlanRouter} from "./src/router/plan/foodPlanRouter.js";
import {moneyPlanRouter} from "./src/router/plan/moneyPlanRouter.js";
import {sleepPlanRouter} from "./src/router/plan/sleepPlanRouter.js";
import {userPlanRouter} from "./src/router/plan/userPlanRouter.js";
import {workPlanRouter} from "./src/router/plan/workPlanRouter.js";
import {foodRouter} from "./src/router/real/foodRouter.js";
import {moneyRouter} from "./src/router/real/moneyRouter.js";
import {sleepRouter} from "./src/router/real/sleepRouter.js";
import {userRouter} from "./src/router/real/userRouter.js";
import {workRouter} from "./src/router/real/workRouter.js";

// ------------------------------------------------------------------------------------------------>
mongoose.connect("mongodb://127.0.0.1:27017");
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------------------------------------------------>
app.set("port", process.env.PORT || 4000);
app.use(cors(), (req, res, next) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  next();
});

// ------------------------------------------------------------------------------------------------>
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/food/plan", foodPlanRouter);
app.use("/money/plan", moneyPlanRouter);
app.use("/sleep/plan", sleepPlanRouter);
app.use("/user/plan", userPlanRouter);
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
