// planRouter.js

import express from "express";
import * as service from "../service/planService.js";
export const planRouter = express.Router();

// 1-1. list -------------------------------------------------------------------------------------->
planRouter.get("/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.plan_dur,
      req.query.filter,
      req.query.paging,
      req.query.planYn,
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
planRouter.get("/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query._id,
      req.query.user_id,
      req.query.plan_dur,
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

// 3. save ---------------------------------------------------------------------------------------->
planRouter.post("/save", async (req, res) => {
  try {
    const result = await service.save (
      req.body.user_id,
      req.body.SLEEP,
      req.body.plan_dur,
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
planRouter.delete("/delete", async (req, res) => {
  try {
    const result = await service.deletes(
      req.query._id,
      req.query.user_id,
      req.query.plan_dur,
      req.query.planYn
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