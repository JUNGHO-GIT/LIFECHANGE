import * as path from "path";
import * as mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";


import userRouter from "./src/router/userRouter";
import adminRouter from "./src/router/adminRouter";
import secretKeysRouter from "./src/router/secretKeysRouter";

const app = express();

app.set("port", process.env.PORT || 4000);

app.use(cors(), (req, res, next) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost/test");

app.use(express.static(path.join(__dirname, "client/build")));

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/secretKeys", secretKeysRouter);

app.listen(app.get("port"), () => {
  console.log("App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
});
