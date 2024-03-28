// userRouter.js

import express from "express";
import * as service from "../service/userService.js";
export const userRouter = express.Router();

// 1. list ---------------------------------------------------------------------------------------->
userRouter.get("/user/list", async (req, res) => {
  try {
    const result = await service.list (
    );
    if (result) {
      res.send(result);
    }
    else {
      res.send("fail");
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// 2. detail -------------------------------------------------------------------------------------->
userRouter.post("/user/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.body.user_id
    );
    if (result) {
      res.send(result);
    }
    else {
      res.send("fail");
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// 3-1. insert ------------------------------------------------------------------------------------>
userRouter.post("/user/insert", async (req, res) => {
  try {
    const resultSub = await service.checkId (
      req.body.user_id
    );
    if (resultSub) {
      res.send("duplicate");
    }
    else {
      const result = await service.insert (
        req.body.user_id,
        req.body.user_pw
      );
      if (result) {
        res.send("success");
      }
      else {
        res.send("fail");
      }
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// 3-2. login ------------------------------------------------------------------------------------->
userRouter.post("/user/login", async (req, res) => {
  try {
    const result = await service.login (
      req.body.user_id,
      req.body.user_pw
    );
    if (result) {
      res.send("success");
    }
    else {
      res.send("fail");
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// 4-1. update ------------------------------------------------------------------------------------>
userRouter.put("/user/update", async (req, res) => {
  try {
    const result = await service.update (
      req.body._id,
      req.body.USER
    );
    if (result) {
      res.send("success");
    }
    else {
      res.send("fail");
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// 4-2. checkIdPw --------------------------------------------------------------------------------->
userRouter.post("/user/checkIdPw", async (req, res) => {
  try {
    const result = await service.checkIdPw (
      req.body.user_id,
      req.body.user_pw
    );
    if (result) {
      res.send("success");
    }
    else {
      res.send("fail");
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// 5. deletes ------------------------------------------------------------------------------------->
userRouter.delete("/user/delete", async (req, res) => {
  try {
    const result = await service.deletes (
      req.query._id
    );
    if (result) {
      res.send("success");
    }
    else {
      res.send("fail");
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});