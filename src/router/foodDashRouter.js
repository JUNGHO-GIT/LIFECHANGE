// foodDashRouter.js

import express from "express";
import * as service from "../service/foodDashService.js";
export const foodDashRouter = express.Router();

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
foodDashRouter.get("/bar/today", async (req, res) => {
  try {
    const result = await service.barToday (
      req.query.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패"
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 2-1. dash (pie - today) ------------------------------------------------------------------------>
foodDashRouter.get("/pie/today", async (req, res) => {
  try {
    const result = await service.pieToday (
      req.query.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패"
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 2-2. dash (pie - week) ------------------------------------------------------------------------->
foodDashRouter.get("/pie/week", async (req, res) => {
  try {
    const result = await service.pieWeek (
      req.query.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패"
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 2-3. dash (pie - month) ------------------------------------------------------------------------>
foodDashRouter.get("/pie/month", async (req, res) => {
  try {
    const result = await service.pieMonth (
      req.query.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패"
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 3-1. dash (line - week) ------------------------------------------------------------------------>
foodDashRouter.get("/line/week", async (req, res) => {
  try {
    const result = await service.lineWeek (
      req.query.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패"
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 3-2. dash (line - month) ----------------------------------------------------------------------->
foodDashRouter.get("/line/month", async (req, res) => {
  try {
    const result = await service.lineMonth (
      req.query.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패"
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 4-1. dash (avg - week) ------------------------------------------------------------------------->
foodDashRouter.get("/avg/week", async (req, res) => {
  try {
    const result = await service.avgWeek (
      req.query.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패"
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 4-2. dash (avg - month) ------------------------------------------------------------------------>
foodDashRouter.get("/avg/month", async (req, res) => {
  try {
    const result = await service.avgMonth (
      req.query.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패"
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});