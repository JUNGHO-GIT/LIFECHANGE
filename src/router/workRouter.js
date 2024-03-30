// workRouter.js

import express from "express";
import * as service from "../service/workService.js";
export const workRouter = express.Router();

// 1-1. list -------------------------------------------------------------------------------------->
workRouter.get("/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.work_dur,
      req.query.planYn,
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
workRouter.get("/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query.user_id,
      req.query.work_day,
      req.query.planYn,
      req.query._id
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
workRouter.post("/insert", async (req, res) => {
  try {
    const result = await service.insert (
      req.body.user_id,
      req.body.WORK
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
workRouter.put("/update", async (req, res) => {
  try {
    const result = await service.update (
      req.body._id,
      req.body.WORK
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
workRouter.delete("/delete", async (req, res) => {
  try {
    const result = await service.deletes (
      req.query._id,
      req.query.work_section_id
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