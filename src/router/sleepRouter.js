// sleepRouter.js

import express from "express";
import * as service from "../service/sleepService.js";
export const sleepRouter = express.Router();

// 1-0. dash -------------------------------------------------------------------------------------->
sleepRouter.get("/dash", async (req, res) => {
  try {
    const result = await service.dash (
      req.query.user_id,
      req.query.sleep_dur
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

// 1-1. list -------------------------------------------------------------------------------------->
sleepRouter.get("/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.sleep_dur,
      req.query.filter
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
sleepRouter.get("/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query.user_id,
      req.query.sleep_dur,
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
sleepRouter.post("/save", async (req, res) => {
  try {
    const result = await service.save (
      req.body.user_id,
      req.body.SLEEP,
      req.body.sleep_dur,
      req.body.planYn
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
sleepRouter.delete("/delete", async (req, res) => {
  try {
    const result = await service.deletes(
      req.query.user_id,
      req.query.sleep_dur
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