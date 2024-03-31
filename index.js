// index.js

import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {userRouter} from "./src/router/userRouter.js";
import {boardRouter} from "./src/router/boardRouter.js";
import {foodRouter} from "./src/router/foodRouter.js";
import {calendarRouter} from "./src/router/calendarRouter.js";
import {workRouter} from "./src/router/workRouter.js";
import {sleepRouter} from "./src/router/sleepRouter.js";
import {moneyRouter} from "./src/router/moneyRouter.js";

mongoose.connect("mongodb://127.0.0.1:27017");
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("port", process.env.PORT || 4000);
app.use(cors(), (req, res, next) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/user", userRouter);
app.use("/board", boardRouter);
app.use("/food", foodRouter);
app.use("/calendar", calendarRouter);
app.use("/work", workRouter);
app.use("/sleep", sleepRouter);
app.use("/money", moneyRouter);

app.listen(app.get("port"), () => {
  console.log("App is running at http://127.0.0.1:%d in %s mode", app.get("port"), app.get("env"));
});
