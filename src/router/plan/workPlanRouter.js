// workPlanRouter.js

import express from "express";
import * as service from "../../service/plan/workPlanService.js";
export const workPlanRouter = express.Router();

// 1-1. compare ----------------------------------------------------------------------------------->
workPlanRouter.get("/compare", async (req, res) => {
  try {
    const result = await service.compare (
      req.query.user_id,
      req.query.work_dur,
      req.query.work_plan_dur,
      req.query.FILTER,
      req.query.PAGING
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
workPlanRouter.get("/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.work_plan_dur,
      req.query.FILTER,
      req.query.PAGING
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
workPlanRouter.get("/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query._id,
      req.query.user_id,
      req.query.work_plan_dur
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
workPlanRouter.post("/save", async (req, res) => {
  try {
    const result = await service.save (
      req.body.user_id,
      req.body.WORK_PLAN,
      req.body.work_plan_dur
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
workPlanRouter.delete("/delete", async (req, res) => {
  try {
    const result = await service.deletes(
      req.query._id,
      req.query.user_id,
      req.query.work_plan_dur
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