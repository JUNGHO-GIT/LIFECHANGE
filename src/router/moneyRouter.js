// moneyRouter.js

import express from "express";
import * as service from "../service/moneyService.js";
export const moneyRouter = express.Router();

// 1-1. list -------------------------------------------------------------------------------------->
moneyRouter.get("/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.money_dur
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
moneyRouter.get("/avg", async (req, res) => {
  try {
    const result = await service.avg (
      req.query.user_id,
      req.query.money_dur,
      req.query.money_part_val,
      req.query.money_title_val,
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
moneyRouter.get("/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query._id,
      req.query.money_section_id
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
moneyRouter.post("/insert", async (req, res) => {
  try {
    const result = await service.insert (
      req.body.user_id,
      req.body.MONEY
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
moneyRouter.put("/update", async (req, res) => {
  try {
    const result = await service.update (
      req.body._id,
      req.body.MONEY
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
moneyRouter.delete("/delete", async (req, res) => {
  try {
    const result = await service.deletes (
      req.query._id,
      req.query.money_section_id
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