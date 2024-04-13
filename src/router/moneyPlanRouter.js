// moneyPlanRouter.js

import express from "express";
import * as service from "../service/moneyPlanService.js";
export const moneyPlanRouter = express.Router();

// 1-1. compare ----------------------------------------------------------------------------------->
moneyPlanRouter.get("/compare", async (req, res) => {
  try {
    const result = await service.compare (
      req.query.user_id,
      req.query.money_dur,
      req.query.money_plan_dur,
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
moneyPlanRouter.get("/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.money_plan_dur,
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
moneyPlanRouter.get("/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query._id,
      req.query.user_id,
      req.query.money_plan_dur
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
moneyPlanRouter.post("/save", async (req, res) => {
  try {
    const result = await service.save (
      req.body.user_id,
      req.body.MONEY_PLAN,
      req.body.money_plan_dur
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
moneyPlanRouter.delete("/delete", async (req, res) => {
  try {
    const result = await service.deletes(
      req.query._id,
      req.query.user_id,
      req.query.money_plan_dur
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