// workDashRouter.js

import express from "express";
import * as service from "../../service/dash//workDashService.js";
export const workDashRouter = express.Router();

// 1-1. dash (scatter - week) -------------------------------------------------------------------->
workDashRouter.get("/scatter/week", async (req, res) => {
  try {
    const result = await service.scatterWeek (
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

// 1-2. dash (scatter - month) -------------------------------------------------------------------->
workDashRouter.get("/scatter/month", async (req, res) => {
  try {
    const result = await service.scatterMonth (
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

// 2-1. dash (pie - week) ------------------------------------------------------------------------->
workDashRouter.get("/pie/week", async (req, res) => {
  try {
    const result = await service.pieWeek (
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

// 2-2. dash (pie - month) ------------------------------------------------------------------------>
workDashRouter.get("/pie/month", async (req, res) => {
  try {
    const result = await service.pieMonth (
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

// 3-1. dash (line - week) ------------------------------------------------------------------------>
workDashRouter.get("/line/week", async (req, res) => {
  try {
    const result = await service.lineWeek (
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

// 3-2. dash (line - month) ----------------------------------------------------------------------->
workDashRouter.get("/line/month", async (req, res) => {
  try {
    const result = await service.lineMonth (
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
workDashRouter.get("/avg/week", async (req, res) => {
  try {
    const result = await service.avgWeek (
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

// 4-2. dash (avg - month) ------------------------------------------------------------------------>
workDashRouter.get("/avg/month", async (req, res) => {
  try {
    const result = await service.avgMonth (
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