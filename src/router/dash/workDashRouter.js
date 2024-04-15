// workDashRouter.js

import express from "express";
import * as service from "../../service/dash//workDashService.js";
export const workDashRouter = express.Router();

// 0-1. dash (bar) -------------------------------------------------------------------------------->
workDashRouter.get("/bar", async (req, res) => {
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

// 0-2. dash (pie) -------------------------------------------------------------------------------->
workDashRouter.get("/pie", async (req, res) => {
  try {
    const result = await service.dashPie (
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
workDashRouter.get("/line", async (req, res) => {
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

// 0-3. dash (avg - week) ------------------------------------------------------------------------->
workDashRouter.get("/avgWeek", async (req, res) => {
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
workDashRouter.get("/avgMonth", async (req, res) => {
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