// router.js

import express from "express";
import * as service from "../../service/sleep/sleepDashService.js";
export const router = express.Router();

// 1-1. dash (bar - today) ----------------------------------------------------------------------->
router.get("/dash/bar/today", async (req, res) => {
  try {
    let result = await service.barToday (
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
        msg: "조회 실패",
        result: null
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
router.get("/dash/line/week", async (req, res) => {
  try {
    let result = await service.lineWeek (
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
        msg: "조회 실패",
        result: null
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
router.get("/dash/line/month", async (req, res) => {
  try {
    let result = await service.lineMonth (
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
        msg: "조회 실패",
        result: null
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

// 4-1. dash (avg - month) ------------------------------------------------------------------------->
router.get("/dash/avg/month", async (req, res) => {
  try {
    let result = await service.avgMonth (
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
        msg: "조회 실패",
        result: null
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

// 4-2. dash (avg - year) ------------------------------------------------------------------------>
router.get("/dash/avg/year", async (req, res) => {
  try {
    let result = await service.avgYear (
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
        msg: "조회 실패",
        result: null
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