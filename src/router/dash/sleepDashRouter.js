// sleepDashRouter.js

import express from "express";
import * as service from "../../service/dash/sleepDashService.js";
export const sleepDashRouter = express.Router();

// 0-1. dash (bar) -------------------------------------------------------------------------------->
sleepDashRouter.get("/bar", async (req, res) => {
  try {
    const result = await service.dashBar (
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

// 0-3. dash (line) ------------------------------------------------------------------------------->
sleepDashRouter.get("/line", async (req, res) => {
  try {
    const result = await service.dashLine (
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

// 0-4. dash (avg - week) ------------------------------------------------------------------------->
sleepDashRouter.get("/avgWeek", async (req, res) => {
  try {
    const result = await service.dashAvgWeek (
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

// 0-4. dash (avg - month) ------------------------------------------------------------------------>
sleepDashRouter.get("/avgMonth", async (req, res) => {
  try {
    const result = await service.dashAvgMonth (
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