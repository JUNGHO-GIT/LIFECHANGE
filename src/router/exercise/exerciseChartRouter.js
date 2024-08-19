// exerciseChartRouter.js

import express from "express";
import * as service from "../../service/exercise/exerciseChartService.js";
export const router = express.Router();

// 1-1. chart (bar - today) ------------------------------------------------------------------------
router.get("/bar/today", async (req, res) => {
  try {
    let result = await service.barToday (
      req.query.user_id,
      req.query.DATE,
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

// 1-2. chart (bar - week) -------------------------------------------------------------------------
router.get("/bar/week", async (req, res) => {
  try {
    let result = await service.barWeek (
      req.query.user_id,
      req.query.DATE,
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

// 1-3. chart (bar - month) ------------------------------------------------------------------------
router.get("/bar/month", async (req, res) => {
  try {
    let result = await service.barMonth (
      req.query.user_id,
      req.query.DATE,
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

// 2-1. chart (pie - week) -------------------------------------------------------------------------
router.get("/pie/week", async (req, res) => {
  try {
    let result = await service.pieWeek (
      req.query.user_id,
      req.query.DATE,
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

// 2-2. chart (pie - month) ------------------------------------------------------------------------
router.get("/pie/month", async (req, res) => {
  try {
    let result = await service.pieMonth (
      req.query.user_id,
      req.query.DATE,
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

// 3-1. chart (line - week) ------------------------------------------------------------------------
router.get("/line/week", async (req, res) => {
  try {
    let result = await service.lineWeek (
      req.query.user_id,
      req.query.DATE,
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

// 3-2. chart (line - month) -----------------------------------------------------------------------
router.get("/line/month", async (req, res) => {
  try {
    let result = await service.lineMonth (
      req.query.user_id,
      req.query.DATE,
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

// 0-3. chart (avg - week) -------------------------------------------------------------------------
router.get("/avg/week", async (req, res) => {
  try {
    let result = await service.avgWeek (
      req.query.user_id,
      req.query.DATE,
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

// 4-2. chart (avg - month) ------------------------------------------------------------------------
router.get("/avg/month", async (req, res) => {
  try {
    let result = await service.avgMonth (
      req.query.user_id,
      req.query.DATE,
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