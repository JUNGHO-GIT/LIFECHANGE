// sleepRouter.js

import express from "express";
import * as service from "../service/sleepService.js";
export const sleepRouter = express.Router();

// 1-0. dash -------------------------------------------------------------------------------------->
sleepRouter.get("/dash", async (req, res) => {
  try {
    const result = await service.dash (
      req.query.user_id
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
      req.query._id,
      req.query.user_id,
      req.query.sleep_day,
      req.query.planYn
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
sleepRouter.post("/insert", async (req, res) => {
  try {
    const result = await service.insert (
      req.body.user_id,
      req.body.SLEEP,
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

// 4. update -------------------------------------------------------------------------------------->
sleepRouter.put("/update", async (req, res) => {
  try {
    const result = await service.update (
      req.body._id,
      req.body.SLEEP
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
sleepRouter.delete("/delete", async (req, res) => {
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