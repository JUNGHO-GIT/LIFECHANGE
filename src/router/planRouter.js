// planRouter.js

import express from "express";
import * as service from "../service/planService.js";
export const planRouter = express.Router();

// 1-1. list -------------------------------------------------------------------------------------->
planRouter.get("/plan/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.plan_dur,
      req.query.filter,
      req.query.plan_part_val,
      req.query.plan_title_val
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

// 1-2. avg --------------------------------------------------------------------------------------->
planRouter.get("/plan/avg", async (req, res) => {
  try {
    const result = await service.avg (
      req.query.user_id,
      req.query.plan_dur,
      req.query.plan_part_val,
      req.query.plan_title_val,
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
planRouter.get("/plan/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query._id,
      req.query.planSection_id
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

// 3. insert -------------------------------------------------------------------------------------->
planRouter.post("/plan/insert", async (req, res) => {
  try {
    const result = await service.insert (
      req.body.user_id,
      req.body.PLAN
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
planRouter.put("/plan/update", async (req, res) => {
  try {
    const result = await service.update (
      req.body._id,
      req.body.PLAN
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
planRouter.delete("/plan/delete", async (req, res) => {
  try {
    const result = await service.deletes (
      req.query._id,
      req.query.planSection_id
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