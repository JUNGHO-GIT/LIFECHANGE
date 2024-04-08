import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { userRouter } from "./src/router/userRouter.js";
import { foodRouter } from "./src/router/foodRouter.js";
import { calendarRouter } from "./src/router/calendarRouter.js";
import { workRouter } from "./src/router/workRouter.js";
import { sleepRouter } from "./src/router/sleepRouter.js";
import { moneyRouter } from "./src/router/moneyRouter.js";
import winston from "winston";
import expressWinston from "express-winston";

// ------------------------------------------------------------------------------------------------>
mongoose.connect("mongodb://127.0.0.1:27017");
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 로그 설정 -------------------------------------------------------------------------------------->
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// 요청 로그 미들웨어 ----------------------------------------------------------------------------->
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/request.log" }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(info => `====요청 로그====\n${info.level}: ${info.message} ${info.meta.res.statusCode} ${info.meta.responseTime}ms\n\n`)
  ),
  msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  expressFormat: false,
  colorize: true,
}));

// ------------------------------------------------------------------------------------------------>
app.set("port", process.env.PORT || 4000);
app.use(cors(), (req, res, next) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));
app.use("/user", userRouter);
app.use("/food", foodRouter);
app.use("/calendar", calendarRouter);
app.use("/work", workRouter);
app.use("/sleep", sleepRouter);
app.use("/money", moneyRouter);

// 응답 로그 미들웨어 ----------------------------------------------------------------------------->
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/response.log" }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(info => `====응답 로그====\n${info.level}: ${info.message} ${info.meta.res.statusCode} ${info.meta.responseTime}ms\n\n`)
  ),
}));

// 에러 로그 미들웨어 ----------------------------------------------------------------------------->
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log" }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(error => `====에러 로그====\n${error.level}: ${error.message} ${error.meta.res.statusCode} ${error.meta.responseTime}ms\n\n`)
  ),
}));

// ------------------------------------------------------------------------------------------------>
app.listen(app.get("port"), () => {
  console.log(`App is running at http://127.0.0.1:${app.get("port")} in ${app.get("env")} mode`);
});
