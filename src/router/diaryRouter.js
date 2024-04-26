// router.js

import express from "express";
import * as service from "../service/diaryService.js";
import * as middleware from "../middleware/diaryMiddleware.js";
export const router = express.Router();

// 1-1. list -------------------------------------------------------------------------------------->
router.get("/list", async (req, res) => {
  try {
    let result = await service.list (
      req.query.customer_id,
      req.query.duration
    );
    if (result && result.result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        totalCnt: result.totalCnt,
        result: result.result
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

// 2. detail -------------------------------------------------------------------------------------->
router.get("/detail", async (req, res) => {
  try {
    let result = await service.detail (
      req.query.customer_id,
      req.query._id,
      req.query.category,
      req.query.duration
    );
    if (result && result.result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        sectionCnt: result.sectionCnt,
        result: result.result
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

// 3. save ---------------------------------------------------------------------------------------->
router.post("/save", async (req, res) => {
  try {
    let result = await service.save(
      req.body.customer_id,
      req.body.category,
      req.body.OBJECT,
      req.body.duration
    );
    result = await middleware.save(result);
    if (result) {
      res.json({
        status: "success",
        msg: "저장 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "저장 실패",
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

// 4. deletes ------------------------------------------------------------------------------------->
router.delete("/delete", async (req, res) => {
  try {
    let result = await service.deletes(
      req.query.customer_id,
      req.query._id,
      req.query.category,
      req.query.duration
    );
    result = await middleware.save(result);
    if (result) {
      res.json({
        status: "success",
        msg: "삭제 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "삭제 실패",
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