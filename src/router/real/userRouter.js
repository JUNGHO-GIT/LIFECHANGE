// userRouter.js

import express from "express";
import * as service from "../../service/real/userService.js";
export const userRouter = express.Router();

// 0-1. login ------------------------------------------------------------------------------------->
userRouter.post("/login", async (req, res) => {
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

// 0-2. checkId ----------------------------------------------------------------------------------->
userRouter.post("/checkId", async (req, res) => {
  try {
    const result = await service.checkId (
      req.body.user_id
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

// 1-1. dataset ----------------------------------------------------------------------------------->
userRouter.get("/dataset", async (req, res) => {
  try {
    const result = await service.dataset (
      req.query.user_id,
      req.query.user_pw
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

// 1-2. list -------------------------------------------------------------------------------------->
userRouter.get("/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.sort,
      req.query.limit,
      req.query.page
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
userRouter.get("/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query._id,
      req.query.user_id,
      req.query.user_pw
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

// 3. save ---------------------------------------------------------------------------------------->
userRouter.post("/save", async (req, res) => {
  try {
    const result = await service.save (
      req.body.user_id,
      req.body.user_pw,
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

// 4. deletes ------------------------------------------------------------------------------------->
userRouter.delete("/delete", async (req, res) => {
  try {
    const result = await service.deletes(
      req.query._id,
      req.query.user_id
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