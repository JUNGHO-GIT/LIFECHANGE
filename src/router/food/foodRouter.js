// foodRouter.js

import express from "express";
import * as service from "../../service/food/foodService.js";
import * as middleware from "../../middleware/food/foodMiddleware.js";
export const router = express.Router();

// 0. exist --------------------------------------------------------------------------------------->
router.get("/exist", async (req, res) => {
  try {
    let result = await service.exist (
      req.query.user_id,
      req.query.DATE
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

// 1-1. list -------------------------------------------------------------------------------------->
router.get("/list", async (req, res) => {
  try {
    let result = await service.list (
      req.query.user_id,
      req.query.PAGING,
      req.query.DATE
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
        totalCnt: 0,
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

// 2. detail (상세는 eq) -------------------------------------------------------------------------->
router.get("/detail", async (req, res) => {
  try {
    let result = await service.detail (
      req.query.user_id,
      req.query._id,
      req.query.DATE
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
        sectionCnt: 0,
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
      req.body.user_id,
      req.body.OBJECT,
      req.body.DATE
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
router.post("/deletes", async (req, res) => {
  try {
    let result = await service.deletes(
      req.body.user_id,
      req.body._id,
      req.body.DATE
    );
    result = await middleware.deletes(result);
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